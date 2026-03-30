import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, SIZES } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { VOCAL_EXERCISES } from '@/constants/exercises';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import { useTimer } from '@/hooks/useTimer';
import ProgressBar from '@/components/ProgressBar';
import * as Haptics from 'expo-haptics';
import { Mic, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeIn, FadeInRight, FadeOutLeft, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';

const Waveform = ({ color }: { color: string }) => {
  return (
    <View style={styles.waveformContainer}>
      {[0, 1, 2, 3, 4].map((i) => {
        const heightMultiplier = useSharedValue(1);
        
        useEffect(() => {
          heightMultiplier.value = withRepeat(
            withSequence(
              withTiming(Math.random() * 2 + 0.5, { duration: 300 + Math.random() * 200 }),
              withTiming(1, { duration: 300 + Math.random() * 200 })
            ),
            -1,
            true
          );
        }, []);

        const style = useAnimatedStyle(() => ({
          transform: [{ scaleY: heightMultiplier.value }]
        }));

        return (
          <Animated.View 
            key={i} 
            style={[styles.waveBar, { backgroundColor: color }, style]} 
          />
        );
      })}
    </View>
  );
};

export default function VocalModule() {
  const router = useRouter();
  const theme = Colors[useColorScheme() ?? 'light'];
  const { markModuleComplete } = useRoutineStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentExercise = VOCAL_EXERCISES[currentIndex];

  const { timeLeft, isActive, toggle, start, reset } = useTimer(currentExercise.duration, () => {
    handleNext();
  });

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < VOCAL_EXERCISES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      reset();
    } else {
      finishRoutine();
    }
  };

  const finishRoutine = () => {
    setIsFinished(true);
    markModuleComplete('vocal');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (isFinished) {
    return (
      <View style={[styles.container, styles.centerAll, { backgroundColor: theme.background }]}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.centerAll}>
          <Text style={{ fontSize: 80, marginBottom: 20 }}>🎶</Text>
          <Text style={[styles.title, { color: theme.text }]}>Voice Warmed Up!</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, marginBottom: 40 }]}>
            You are ready to speak your truth today.
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

  const progress = currentIndex / VOCAL_EXERCISES.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Vocal Warm-up</Text>
        <Text style={[styles.counter, { color: theme.textSecondary }]}>{currentIndex + 1} / {VOCAL_EXERCISES.length}</Text>
      </View>
      <ProgressBar progress={progress} height={6} />

      <Animated.View 
        key={currentExercise.id}
        entering={FadeInRight} 
        exiting={FadeOutLeft}
        style={styles.content}
      >
        <Text style={styles.bigIcon}>{currentExercise.icon}</Text>
        <Text style={[styles.title, { color: theme.text }]}>
          {currentExercise.name}
        </Text>
        
        <View style={[styles.instructionCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.instruction, { color: theme.text }]}>
            {currentExercise.instruction}
          </Text>
        </View>

        <Waveform color={isActive ? theme.primary : theme.textSecondary} />

        <Text style={[styles.timerText, { color: theme.text }]}>
          {timeLeft}s
        </Text>

        <TouchableOpacity 
          style={[
            styles.recordButton, 
            { backgroundColor: isActive ? theme.surface : theme.primary }
          ]} 
          onPress={toggle}
        >
          {isActive ? (
            <Text style={[styles.primaryButtonText, { color: theme.primary }]}>Pause</Text>
          ) : (
            <>
              <Mic color="#FFF" size={24} style={{ marginRight: 8 }} />
              <Text style={styles.primaryButtonText}>Start Exercise</Text>
            </>
          )}
        </TouchableOpacity>

        {isActive && (
          <TouchableOpacity style={{ marginTop: 20 }} onPress={handleNext}>
            <Text style={{ color: theme.textSecondary, fontSize: 16 }}>Skip to Next</Text>
          </TouchableOpacity>
        )}
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
  bigIcon: { fontSize: 80, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  instructionCard: {
    padding: 24,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  instruction: { fontSize: 18, textAlign: 'center', lineHeight: 28 },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginBottom: 30,
  },
  waveBar: {
    width: 12,
    height: 40,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
