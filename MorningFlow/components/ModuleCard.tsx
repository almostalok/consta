import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Colors, SIZES } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CheckCircle2, Clock } from 'lucide-react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface ModuleCardProps {
  title: string;
  IconComponent: any;
  duration: number; // in mins
  completed: boolean;
  onPress: () => void;
  index: number;
  isLast?: boolean;
}

export default function ModuleCard({ title, IconComponent, duration, completed, onPress, index, isLast = false }: ModuleCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark']; // Enforce dark

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withTiming(0.98, { duration: 150, easing: Easing.out(Easing.ease) });
    opacity.value = withTiming(0.6, { duration: 150 });
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
    <Animated.View entering={FadeInDown.delay(index * 100).duration(600).easing(Easing.out(Easing.exp))} style={styles.wrapper}>
      <Pressable 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Animated.View style={[styles.card, { borderBottomColor: isLast ? 'transparent' : theme.border }, animatedStyle]}>
          <View style={styles.leftContent}>
            <View style={[styles.iconContainer, { backgroundColor: theme.surfaceLow }]}>
                <IconComponent size={20} color={theme.text} strokeWidth={1.5} />
            </View>
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
              <CheckCircle2 size={24} color={theme.text} strokeWidth={1.5} />
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
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1, // Sleek list item
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: SIZES.radiusDefault,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: {
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    letterSpacing: -0.3,
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
  }
});
