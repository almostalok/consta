import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence, withDelay } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MOTIVATIONAL_QUOTES } from '@/constants/quotes';
import { Colors } from '@/constants/theme';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import { getFormattedGreetingDate } from '@/utils/dateHelpers';

// Weekday gradients
const GRADIENTS = [
  ['#FF7E5F', '#FEB47B'], // Sunday (Warm Sunrise)
  ['#00C6FF', '#0072FF'], // Monday (Cool Blue)
  ['#f12711', '#f5af19'], // Tuesday (Fiery Orange)
  ['#8360c3', '#2ebf91'], // Wednesday (Purple Mint)
  ['#11998e', '#38ef7d'], // Thursday (Fresh Green)
  ['#8A2387', '#E94057'], // Friday (Vibrant Pink)
  ['#FC466B', '#3F5EFB'], // Saturday (Bright Purple)
];

export default function SplashScreen() {
  const router = useRouter();
  const { userName, progress, loading } = useRoutineStore();
  const [quote, setQuote] = useState('');
  const [gradient, setGradient] = useState(GRADIENTS[0]);

  const pulse = useSharedValue(1);

  useEffect(() => {
    // Select daily gradient
    const dayOfWeek = new Date().getDay();
    setGradient(GRADIENTS[dayOfWeek]);

    // Select random quote
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);

    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
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

  if (loading) return null;

  const percent = calculateCompletionPercent();

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }]
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradient}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Background Particles Placeholder: For a real app, you could use react-native-particles */}
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
          <Text style={styles.date}>{getFormattedGreetingDate()}</Text>
          <Text style={styles.greeting}>Good Morning{userName ? `, ${userName}` : ''}!</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(500).duration(1000)} style={styles.quoteCard}>
          <Text style={styles.quoteText}>"{quote}"</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1000).duration(800)} style={styles.progressContainer}>
          {/* Custom animated ring would go here, simple text for now */}
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{percent}%</Text>
            <Text style={styles.progressLabel}>Completed</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1500).duration(800)} style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <TouchableOpacity 
            style={styles.beginButton} 
            onPress={handleBegin} 
            activeOpacity={0.8}
          >
            <Text style={styles.beginButtonText}>Let's Begin</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)', // light overlay
  },
  header: { alignItems: 'center', marginTop: 40 },
  date: { color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  greeting: { color: '#FFF', fontSize: 36, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
  quoteCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 24,
    borderRadius: 20,
    width: '100%',
    marginVertical: 20,
  },
  quoteText: { color: '#FFF', fontSize: 20, fontStyle: 'italic', textAlign: 'center', lineHeight: 28 },
  progressContainer: { alignItems: 'center' },
  progressCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  progressText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  progressLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
  buttonContainer: { width: '100%', marginBottom: 30 },
  beginButton: {
    backgroundColor: '#FFF',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  beginButtonText: { color: Colors.light.primary, fontSize: 20, fontWeight: 'bold' }
});
