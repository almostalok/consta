import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MOTIVATIONAL_QUOTES } from '@/constants/quotes';
import { Colors, SIZES } from '@/constants/theme';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import { getFormattedGreetingDate } from '@/utils/dateHelpers';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { userName, progress, loading } = useRoutineStore();
  const [quote, setQuote] = useState('');

  const buttonScale = useSharedValue(1);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark']; // Enforce dark

  useEffect(() => {
    // Select random quote
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  const calculateCompletionPercent = () => {
    let completed = 0;
    if (progress.workout) completed++;
    if (progress.facial) completed++;
    if (progress.vocal) completed++;
    if (progress.posture) completed++;
    if (progress.checklist) completed++;
    return (completed / 5) * 100;
  };

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    buttonScale.value = withTiming(0.96, { duration: 150, easing: Easing.out(Easing.ease) });
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) });
  };

  const handleBegin = () => {
    router.replace('/(tabs)/home');
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  if (loading) return null;

  const percent = calculateCompletionPercent();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(800).easing(Easing.out(Easing.exp))} style={styles.header}>
          <Text style={[styles.date, { color: theme.textSecondary }]}>{getFormattedGreetingDate()}</Text>
          <Text style={[styles.greeting, { color: theme.primary }]}>
            Good Morning{userName ? `,\n${userName}` : ''}.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(400).duration(1000)} style={styles.quoteWrapper}>
          <Text style={[styles.quoteText, { color: theme.textSecondary }]}>"{quote}"</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(800).easing(Easing.out(Easing.exp))} style={styles.progressContainer}>
          <View style={[styles.progressCircle, { borderColor: theme.border }]}>
            <Text style={[styles.progressText, { color: theme.text }]}>{percent}%</Text>
            <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>COMPLETED</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(800).duration(800).easing(Easing.out(Easing.exp))} style={styles.buttonContainer}>
          <Pressable 
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleBegin}
          >
            <Animated.View style={[styles.beginButton, buttonAnimatedStyle, { backgroundColor: theme.primary }]}>
                <Text style={[styles.beginButtonText, { color: theme.textInverse }]}>Enter Regimen</Text>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.paddingLarge,
    paddingTop: 100,
    paddingBottom: 60,
    justifyContent: 'space-between',
  },
  header: { 
    alignItems: 'flex-start',
  },
  date: { 
    fontFamily: 'Inter_500Medium',
    fontSize: SIZES.labelMd,
    textTransform: 'uppercase', 
    letterSpacing: 2,
    marginBottom: 12,
  },
  greeting: { 
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 42, 
    lineHeight: 48,
    letterSpacing: -1.5, 
  },
  quoteWrapper: {
    marginVertical: 20,
  },
  quoteText: { 
    fontFamily: 'Inter_400Regular',
    fontSize: SIZES.bodyLg, 
    fontStyle: 'italic', 
    lineHeight: 26,
  },
  progressContainer: { 
    alignItems: 'center',
    marginVertical: 40, 
  },
  progressCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: { 
    fontFamily: 'Manrope_700Bold',
    fontSize: SIZES.displayLg, 
    letterSpacing: -2,
  },
  progressLabel: { 
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginTop: -5,
  },
  buttonContainer: { 
    width: '100%', 
  },
  beginButton: {
    paddingVertical: 18,
    borderRadius: SIZES.radiusDefault, // 6px solid rectangle
    alignItems: 'center',
  },
  beginButtonText: { 
    fontFamily: 'Manrope_700Bold',
    fontSize: SIZES.bodyLg,
  }
});
