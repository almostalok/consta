import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors, SIZES } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CheckCircle2, Clock } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

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

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(500)} style={styles.wrapper}>
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: theme.surfaceContainer }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
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
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 0, // Using gap from parent
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderRadius: SIZES.radiusLg,
    // The "Leveling" rule: No standard drop shadows, separation by color tier.
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
    marginRight: 20, // More breathing room
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
    opacity: 0.5, // Ghost Border
  }
});
