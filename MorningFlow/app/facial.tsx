import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, SIZES } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FACIAL_EXERCISES } from '@/constants/exercises';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import { useTimer } from '@/hooks/useTimer';
import ProgressBar from '@/components/ProgressBar';
import TimerRing from '@/components/TimerRing';
import * as Haptics from 'expo-haptics';
import { CheckCircle2, ChevronRight } from 'lucide-react-native';
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from 'react-native-reanimated';

export default function FacialModule() {
  const router = useRouter();
  const theme = Colors[useColorScheme() ?? 'light'];
  const { markModuleComplete } = useRoutineStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentExercise = FACIAL_EXERCISES[currentIndex];

  const { timeLeft, isActive, start, reset } = useTimer(currentExercise.duration, () => {
    handleNext();
  });

  // Start timer automatically when exercise loads
  React.useEffect(() => {
    start();
  }, [currentIndex]);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < FACIAL_EXERCISES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      reset();
    } else {
      finishRoutine();
    }
  };

  const finishRoutine = () => {
    setIsFinished(true);
    markModuleComplete('facial');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (isFinished) {
    return (
      <View style={[styles.container, styles.centerAll, { backgroundColor: theme.background }]}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.centerAll}>
          <Text style={{ fontSize: 80, marginBottom: 20 }}>✨</Text>
          <Text style={[styles.title, { color: theme.text }]}>Glowing!</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, marginBottom: 40 }]}>
            Facial exercises completed.
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

  const progress = currentIndex / FACIAL_EXERCISES.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Facial Yoga</Text>
        <Text style={[styles.counter, { color: theme.textSecondary }]}>{currentIndex + 1} / {FACIAL_EXERCISES.length}</Text>
      </View>
      <ProgressBar progress={progress} height={6} />

      <Animated.View 
        key={currentExercise.id}
        entering={FadeInRight} 
        exiting={FadeOutLeft}
        style={styles.content}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.bigIcon}>{currentExercise.icon}</Text>
        </View>
        
        <Text style={[styles.title, { color: theme.text, marginTop: 30 }]}>
          {currentExercise.name}
        </Text>
        <Text style={[styles.instruction, { color: theme.textSecondary }]}>
          {currentExercise.instruction}
        </Text>

        <View style={styles.timerContainer}>
          <TimerRing 
            progress={(timeLeft / currentExercise.duration) * 100} 
            radius={90} 
            strokeWidth={12} 
            color={theme.accent} 
          />
          <Text style={[styles.timerText, { color: theme.text }]}>{timeLeft}s</Text>
        </View>

        <TouchableOpacity style={[styles.nextButton, { backgroundColor: theme.surface }]} onPress={handleNext}>
          <Text style={[styles.nextButtonText, { color: theme.text }]}>Skip to Next</Text>
          <ChevronRight size={20} color={theme.text} />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerAll: { justifyContent: 'center', alignItems: 'center', flex: 1 },
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
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigIcon: { fontSize: 100 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  instruction: { fontSize: 18, marginTop: 16, textAlign: 'center', lineHeight: 28 },
  timerContainer: {
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
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
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
