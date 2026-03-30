import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, SIZES } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { POSTURE_EXERCISES } from '@/constants/exercises';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import { useTimer } from '@/hooks/useTimer';
import ProgressBar from '@/components/ProgressBar';
import TimerRing from '@/components/TimerRing';
import * as Haptics from 'expo-haptics';
import { Star } from 'lucide-react-native';
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from 'react-native-reanimated';

export default function PostureModule() {
  const router = useRouter();
  const theme = Colors[useColorScheme() ?? 'light'];
  const { markModuleComplete } = useRoutineStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [rating, setRating] = useState(0);

  const currentExercise = POSTURE_EXERCISES[currentIndex];

  const { timeLeft, isActive, toggle, start, reset } = useTimer(currentExercise.duration, () => {
    handleNext();
  });

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < POSTURE_EXERCISES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      reset();
    } else {
      setIsFinished(true); // move to rating screen
    }
  };

  const finishRoutine = () => {
    markModuleComplete('posture');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  if (isFinished) {
    return (
      <View style={[styles.container, styles.centerAll, { backgroundColor: theme.background }]}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.centerAll}>
          <Text style={{ fontSize: 60, marginBottom: 20 }}>🧘‍♂️</Text>
          <Text style={[styles.title, { color: theme.text }]}>Posture Realignment Complete</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, marginBottom: 40 }]}>
            How is your posture feeling today?
          </Text>
          
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => {
                Haptics.selectionAsync();
                setRating(star);
              }}>
                <Star 
                  size={40} 
                  color={star <= rating ? theme.secondary : theme.border} 
                  fill={star <= rating ? theme.secondary : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[
              styles.primaryButton, 
              { backgroundColor: rating > 0 ? theme.primary : theme.border, marginTop: 40 }
            ]}
            onPress={rating > 0 ? finishRoutine : undefined}
            disabled={rating === 0}
          >
            <Text style={styles.primaryButtonText}>Finish & Save</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  const progress = currentIndex / POSTURE_EXERCISES.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Posture Reset</Text>
        <Text style={[styles.counter, { color: theme.textSecondary }]}>{currentIndex + 1} / {POSTURE_EXERCISES.length}</Text>
      </View>
      <ProgressBar progress={progress} height={6} />

      <Animated.ScrollView 
        contentContainerStyle={styles.content}
        key={currentExercise.id}
        entering={FadeInRight} 
        exiting={FadeOutLeft}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.surface }]}>
          <Text style={styles.bigIcon}>{currentExercise.icon}</Text>
        </View>
        
        <Text style={[styles.title, { color: theme.text, marginTop: 30 }]}>
          {currentExercise.name}
        </Text>
        <Text style={[styles.instruction, { color: theme.textSecondary }]}>
          {currentExercise.instruction}
        </Text>

        <View style={styles.timerWrapper}>
          <TimerRing 
            progress={(timeLeft / currentExercise.duration) * 100} 
            radius={90} 
            strokeWidth={12} 
            color={theme.primary} 
          />
          <Text style={[styles.timerText, { color: theme.text }]}>{timeLeft}s</Text>
        </View>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: isActive ? theme.border : theme.primary }]} 
          onPress={isActive ? toggle : start}
        >
          <Text style={[styles.actionButtonText, { color: isActive ? theme.text : '#FFF' }]}>
            {isActive ? 'Pause Hold' : 'Start Hold'}
          </Text>
        </TouchableOpacity>

        {isActive && (
          <TouchableOpacity style={{ marginTop: 20 }} onPress={handleNext}>
            <Text style={{ color: theme.textSecondary, fontSize: 16 }}>Skip</Text>
          </TouchableOpacity>
        )}
      </Animated.ScrollView>
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
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  counter: { fontSize: 16, fontWeight: '600' },
  content: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  bigIcon: { fontSize: 80 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  instruction: { fontSize: 18, marginTop: 16, textAlign: 'center', lineHeight: 28 },
  timerWrapper: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    position: 'absolute',
    fontSize: 40,
    fontWeight: 'bold',
  },
  actionButton: {
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
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
