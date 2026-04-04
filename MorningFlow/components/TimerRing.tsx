import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TimerRingProps {
  progress: number; // 0 to 100
  radius?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export default function TimerRing({ 
  progress, 
  radius = 60, 
  strokeWidth = 3, // precision thin strokes
  color,
  label
}: TimerRingProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark']; // Enforce dark
  
  const ringColor = color || theme.primary;
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;
  
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 1200,
      easing: Easing.out(Easing.exp),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (circumference * animatedProgress.value) / 100;
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.container}>
      <Svg 
        width={halfCircle * 2} 
        height={halfCircle * 2} 
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <Circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke={theme.border}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          rotation="-90"
          originX={halfCircle}
          originY={halfCircle}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFillObject, styles.textContainer]}>
        <Text style={[styles.progressText, { color: theme.text }]}>{Math.round(progress)}<Text style={styles.percentText}>%</Text></Text>
        {label && <Text style={[styles.labelText, { color: theme.textSecondary }]}>{label}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 24,
    letterSpacing: -1,
  },
  percentText: {
    fontSize: 14,
    fontFamily: 'Manrope_600SemiBold',
  },
  labelText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 8,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
  }
});
