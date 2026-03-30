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
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(500)} style={styles.wrapper}>
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: theme.surface }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.leftContent}>
          <Text style={styles.icon}>{icon}</Text>
          <View style={styles.info}>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <View style={styles.durationContainer}>
              <Clock size={12} color={theme.textSecondary} />
              <Text style={[styles.durationText, { color: theme.textSecondary }]}>{duration} min</Text>
            </View>
          </View>
        </View>
        <View style={styles.rightContent}>
          {completed ? (
            <CheckCircle2 size={24} color={theme.success} />
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
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
    marginRight: 16,
  },
  info: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  rightContent: {
    paddingLeft: 10,
  },
  uncompletedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  }
});
