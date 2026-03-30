import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import { Colors, SIZES } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import * as Haptics from 'expo-haptics';
import { User, Bell, Clock, Trash2, Info } from 'lucide-react-native';
import { clearAll } from '@/utils/storage';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const router = useRouter();
  const { userName, setUserName, refresh } = useRoutineStore();
  
  const [localName, setLocalName] = useState(userName);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveName = () => {
    Haptics.selectionAsync();
    setUserName(localName);
  };

  const handleResetData = () => {
    Alert.alert(
      "Reset All Data",
      "Are you sure you want to delete all your progress and history? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset", 
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await clearAll();
            await refresh();
            Alert.alert("Data Wiped", "Your progress has been reset.");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Profile Group */}
        <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>PROFILE</Text>
        <View style={[styles.group, { backgroundColor: theme.surface }]}>
          <View style={styles.row}>
            <User size={20} color={theme.text} style={styles.icon} />
            <Text style={[styles.label, { color: theme.text }]}>Your Name</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              value={localName}
              onChangeText={setLocalName}
              onBlur={handleSaveName}
              placeholder="Enter name"
              placeholderTextColor={theme.textSecondary}
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Preferences Group */}
        <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>PREFERENCES</Text>
        <View style={[styles.group, { backgroundColor: theme.surface }]}>
          <View style={[styles.row, styles.bottomBorder, { borderBottomColor: theme.border }]}>
            <Bell size={20} color={theme.text} style={styles.icon} />
            <Text style={[styles.label, { color: theme.text }]}>Daily Reminders</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>
          <View style={styles.row}>
            <Clock size={20} color={theme.text} style={styles.icon} />
            <Text style={[styles.label, { color: theme.text }]}>Wake Up Time</Text>
            <Text style={[styles.value, { color: theme.textSecondary }]}>6:30 AM</Text>
          </View>
        </View>

        {/* Data Group */}
        <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>DATA</Text>
        <View style={[styles.group, { backgroundColor: theme.surface }]}>
          <TouchableOpacity style={styles.row} onPress={handleResetData}>
            <Trash2 size={20} color={theme.primary} style={styles.icon} />
            <Text style={[styles.label, { color: theme.primary }]}>Reset Daily Progress</Text>
          </TouchableOpacity>
        </View>

        {/* About Group */}
        <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>ABOUT APP</Text>
        <View style={[styles.group, { backgroundColor: theme.surface }]}>
          <View style={[styles.row, styles.bottomBorder, { borderBottomColor: theme.border }]}>
            <Info size={20} color={theme.text} style={styles.icon} />
            <Text style={[styles.label, { color: theme.text }]}>Version</Text>
            <Text style={[styles.value, { color: theme.textSecondary }]}>1.0.0</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: SIZES.padding, paddingTop: 20, marginBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  content: { padding: SIZES.padding, paddingBottom: 100 },
  groupTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 12,
  },
  group: {
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    textAlign: 'right',
    width: 150,
    padding: 0,
  }
});
