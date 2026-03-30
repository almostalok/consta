import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Colors, SIZES } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
}

export default function ProgressBar({ progress, height = 8 }: ProgressBarProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withTiming(progress * 100, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedWidth.value}%`,
    };
  });

  return (
    <View style={[styles.container, { height, backgroundColor: theme.border }]}>
      <Animated.View style={[styles.bar, { backgroundColor: theme.primary, height }, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    borderRadius: 4,
  }
});
