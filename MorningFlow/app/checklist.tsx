import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, SIZES } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import * as Haptics from 'expo-haptics';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';

export default function ChecklistModule() {
  const router = useRouter();
  const theme = Colors[useColorScheme() ?? 'light'];
  const { progress, saveProgress, markModuleComplete } = useRoutineStore();

  const [items, setItems] = useState(progress.checklistItems);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [isFinished, setIsFinished] = useState(progress.checklist);

  useEffect(() => {
    // Check if all are completed
    if (items.length > 0 && items.every(item => item.completed) && !isFinished) {
       finishRoutine();
    }
  }, [items]);

  const toggleItem = (id: string) => {
    Haptics.selectionAsync();
    const newItems = items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setItems(newItems);
    saveProgress({ ...progress, checklistItems: newItems });
  };

  const addItem = () => {
    if (newItemTitle.trim() === '') return;
    const newItem = { id: Date.now().toString(), title: newItemTitle, completed: false };
    const newItems = [...items, newItem];
    setItems(newItems);
    saveProgress({ ...progress, checklistItems: newItems });
    setNewItemTitle('');
  };

  const removeItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    saveProgress({ ...progress, checklistItems: newItems });
  };

  const finishRoutine = () => {
    setIsFinished(true);
    markModuleComplete('checklist');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (isFinished) {
    return (
      <View style={[styles.container, styles.centerAll, { backgroundColor: theme.background }]}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.centerAll}>
          <Text style={{ fontSize: 80, marginBottom: 20 }}>✅</Text>
          <Text style={[styles.title, { color: theme.text }]}>Checklist Complete!</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, marginBottom: 40 }]}>
            You are ready to take on the day.
          </Text>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  const completedCount = items.filter(i => i.completed).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Morning Routine</Text>
        <Text style={[styles.counter, { color: theme.textSecondary }]}>{completedCount} / {items.length}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {items.map((item, index) => (
          <Animated.View 
            key={item.id} 
            entering={FadeInDown.delay(index * 50)} 
            layout={Layout.springify()}
            style={styles.itemWrapper}
          >
            <TouchableOpacity 
              style={[
                styles.itemCard, 
                { backgroundColor: item.completed ? theme.background : theme.surface },
                { borderColor: item.completed ? theme.border : 'transparent', borderWidth: 1 }
              ]} 
              onPress={() => toggleItem(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.itemLeft}>
                {item.completed ? (
                  <CheckCircle2 color={theme.success} size={28} />
                ) : (
                  <Circle color={theme.textSecondary} size={28} />
                )}
                <Text style={[
                  styles.itemTitle, 
                  { 
                    color: item.completed ? theme.textSecondary : theme.text,
                    textDecorationLine: item.completed ? 'line-through' : 'none' 
                  }
                ]}>
                  {item.title}
                </Text>
              </View>
              
              <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteButton}>
                <Trash2 size={20} color={theme.textSecondary} opacity={0.5} />
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View style={[styles.addItemContainer, { backgroundColor: theme.surface }]}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Add new habit..."
            placeholderTextColor={theme.textSecondary}
            value={newItemTitle}
            onChangeText={setNewItemTitle}
            onSubmitEditing={addItem}
          />
          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={addItem}>
            <Plus color="#FFF" size={24} />
          </TouchableOpacity>
        </View>
        
        {items.length > 0 && completedCount !== items.length && (
          <TouchableOpacity 
            style={[styles.forceCompleteBtn, { borderColor: theme.border }]} 
            onPress={finishRoutine}
          >
            <Text style={{ color: theme.textSecondary, fontWeight: '600' }}>Skip Remaining</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerAll: { justifyContent: 'center', alignItems: 'center', flex: 1, padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  counter: { fontSize: 18, fontWeight: '600' },
  content: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 50,
  },
  itemWrapper: {
    marginBottom: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: SIZES.radius,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
    flexShrink: 1,
  },
  deleteButton: {
    padding: 8,
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    height: 40,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forceCompleteBtn: {
    marginTop: 30,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderRadius: 20,
  },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 18, marginTop: 16, textAlign: 'center' },
  primaryButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
