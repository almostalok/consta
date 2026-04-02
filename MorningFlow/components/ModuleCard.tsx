import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Colors, SIZES } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CheckCircle2, Clock } from 'lucide-react-native';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface ModuleCardProps {
  title: string;
  icon: string;
  duration: number; // in mins
  completed: boolean;
  onPress: () => void;
  index: number;
}

export default function ModuleCard({ title, icon, duration, completed, onPress, index }: ModuleCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark']; // Enforce dark

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withTiming(0.97, { duration: 150, easing: Easing.out(Easing.ease) });
    opacity.value = withTiming(0.9, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) });
    opacity.value = withTiming(1, { duration: 250 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View entering={FadeInUp.delay(index * 150).springify().damping(18).stiffness(150)} style={styles.wrapper}>
      <Pressable 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Animated.View style={[styles.card, { backgroundColor: theme.surfaceContainer }, animatedStyle]}>
          <View style={styles.leftContent}>
            <Text style={styles.icon}>{icon}</Text>
            <View style={styles.info}>
              <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
              <View style={styles.durationContainer}>
                <Clock size={12} color={theme.textSecondary} />
                <Text style={[styles.durationText, { color: theme.textSecondary }]}>
                  {String(duration).padStart(2, '0')}:00
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.rightContent}>
            {completed ? (
              <CheckCircle2 size={24} color={theme.primary} />
            ) : (
               <View style={[styles.uncompletedCircle, { borderColor: theme.border }]} />
            )}
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 0,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderRadius: SIZES.radiusLg,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
    marginRight: 20,
  },
  info: {
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 18,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  rightContent: {
    paddingLeft: 10,
  },
  uncompletedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    opacity: 0.5,
  }
});
