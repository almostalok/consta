import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
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

  const pulse = useSharedValue(1);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark']; // Enforce dark

  useEffect(() => {
    // Select random quote
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);

    pulse.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
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

  const handleBegin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(tabs)/home');
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }]
  }));

  if (loading) return null;

  const percent = calculateCompletionPercent();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Subtle ambient lighting in background: intentional asymmetry */}
      <View style={styles.ambientGlow} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
          <Text style={[styles.date, { color: theme.textSecondary }]}>{getFormattedGreetingDate()}</Text>
          <Text style={[styles.greeting, { color: theme.primary }]}>
            Good Morning{userName ? `,\n${userName}` : ''}.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(800).duration(1000)} style={styles.quoteWrapper}>
          {/* Glassmorphism Quote Card using BlurView */}
          <BlurView intensity={40} tint="dark" style={styles.quoteCard}>
            <View style={styles.quoteCardInner}>
              <Text style={[styles.quoteText, { color: theme.textSecondary }]}>"{quote}"</Text>
            </View>
          </BlurView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1200).duration(800)} style={styles.progressContainer}>
          <View style={[styles.progressCircle, { borderColor: theme.surfaceContainer }]}>
            <Text style={[styles.progressText, { color: theme.text }]}>{percent}%</Text>
            <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>Completed</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1600).duration(800)} style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <TouchableOpacity 
            style={styles.beginButton} 
            onPress={handleBegin} 
            activeOpacity={0.9}
          >
            <LinearGradient
               colors={['#FFFFFF', '#D4D4D4']}
               style={styles.buttonGradient}
               start={{x: 0, y: 0}}
               end={{x: 0, y: 1}}
            >
              <Text style={styles.beginButtonText}>Let's Begin</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  ambientGlow: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#FFFFFF',
    opacity: 0.03, // ambient shadow glow
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: { 
    alignItems: 'flex-start', // Asymmetry rule
  },
  date: { 
    fontFamily: 'Inter_500Medium',
    fontSize: SIZES.labelMd,
    textTransform: 'uppercase', 
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  greeting: { 
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 48, 
    lineHeight: 52,
    letterSpacing: -1, // Tight tracking
  },
  quoteWrapper: {
    overflow: 'hidden',
    borderRadius: SIZES.radiusLg,
    marginVertical: 20,
    // Add a ghost border simulating physical glass edge
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  quoteCard: {
    width: '100%',
  },
  quoteCardInner: {
    padding: SIZES.padding,
    backgroundColor: 'rgba(255,255,255,0.03)', // subtle fill
  },
  quoteText: { 
    fontFamily: 'Inter_400Regular',
    fontSize: SIZES.bodyLg, 
    fontStyle: 'italic', 
    lineHeight: 24,
  },
  progressContainer: { 
    alignItems: 'center',
    marginVertical: 20, 
  },
  progressCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)'
  },
  progressText: { 
    fontFamily: 'Manrope_700Bold',
    fontSize: SIZES.displayLg, 
    letterSpacing: -1,
  },
  progressLabel: { 
    fontFamily: 'Inter_500Medium',
    fontSize: SIZES.labelMd, 
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: -5,
  },
  buttonContainer: { 
    width: '100%', 
  },
  beginButton: {
    shadowColor: '#FFFFFF', // Ambient Colored Shadow glow
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 20,
    borderRadius: SIZES.radiusXl,
    alignItems: 'center',
  },
  beginButtonText: { 
    color: '#1A1C1C', 
    fontFamily: 'Manrope_700Bold',
    fontSize: SIZES.bodyLg,
  }
});
