import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, SIZES } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { WORKOUT_EXERCISES } from '@/constants/exercises';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import { useTimer } from '@/hooks/useTimer';
import ProgressBar from '@/components/ProgressBar';
import TimerRing from '@/components/TimerRing';
import * as Haptics from 'expo-haptics';
import { Play, Pause, SkipForward, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from 'react-native-reanimated';

export default function WorkoutModule() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { markModuleComplete } = useRoutineStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentExercise = WORKOUT_EXERCISES[currentIndex];
  const timerDuration = isResting ? currentExercise.rest : currentExercise.duration;

  const { timeLeft, isActive, toggle, reset, start, pause } = useTimer(timerDuration, () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (!isResting && currentExercise.rest > 0) {
      setIsResting(true);
      reset();
      start();
    } else {
      handleNext();
    }
  });

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < WORKOUT_EXERCISES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsResting(false);
      reset();
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = () => {
    setIsFinished(true);
    markModuleComplete('workout');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (isFinished) {
    return (
      <View style={[styles.container, styles.centerAll, { backgroundColor: theme.background }]}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.centerAll}>
          <CheckCircle2 size={100} color={theme.success} />
          <Text style={[styles.title, { color: theme.text, marginTop: 24 }]}>Workout Complete!</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, marginBottom: 40 }]}>
            You crushed it. Great job!
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

  const progress = currentIndex / WORKOUT_EXERCISES.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Morning Workout</Text>
        <Text style={[styles.counter, { color: theme.textSecondary }]}>{currentIndex + 1} / {WORKOUT_EXERCISES.length}</Text>
      </View>
      <ProgressBar progress={progress} height={6} />

      {/* Exercise Content */}
      <Animated.View 
        key={isResting ? `rest-${currentExercise.id}` : `active-${currentExercise.id}`}
        entering={FadeInRight} 
        exiting={FadeOutLeft}
        style={styles.content}
      >
        <Text style={styles.bigIcon}>{isResting ? '😮‍💨' : currentExercise.icon}</Text>
        <Text style={[styles.title, { color: theme.text }]}>
          {isResting ? 'Rest' : currentExercise.name}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {isResting ? `Next: ${WORKOUT_EXERCISES[currentIndex + 1]?.name || 'Finish Line!'}` : currentExercise.type}
        </Text>

        <View style={styles.timerContainer}>
          <TimerRing 
            progress={(timeLeft / timerDuration) * 100} 
            radius={100} 
            strokeWidth={15} 
            color={isResting ? theme.accent : theme.primary} 
          />
          <Text style={[styles.timerText, { color: theme.text }]}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={[styles.controlButton, { backgroundColor: theme.surface }]} onPress={toggle}>
            {isActive ? <Pause size={32} color={theme.text} /> : <Play size={32} color={theme.text} />}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.skipButton, { backgroundColor: theme.surface }]} onPress={handleNext}>
            <SkipForward size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerAll: { justifyContent: 'center', alignItems: 'center' },
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
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  bigIcon: { fontSize: 80, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 18, marginTop: 8, textAlign: 'center' },
  timerContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    position: 'absolute',
    fontSize: 48,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 20,
  },
  skipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
