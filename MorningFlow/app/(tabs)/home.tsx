import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import { getFormattedGreetingDate } from '@/utils/dateHelpers';
import { Colors, SIZES } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import TimerRing from '@/components/TimerRing';
import ModuleCard from '@/components/ModuleCard';
import { Flame } from 'lucide-react-native';

const MODULES = [
  { id: 'workout', title: 'Workout', icon: '💪', duration: 10, route: '/workout' },
  { id: 'facial', title: 'Facial Exercises', icon: '😊', duration: 5, route: '/facial' },
  { id: 'vocal', title: 'Vocal Exercises', icon: '🎤', duration: 5, route: '/vocal' },
  { id: 'posture', title: 'Posture Correction', icon: '🧍', duration: 5, route: '/posture' },
  { id: 'checklist', title: 'Morning Checklist', icon: '📋', duration: 2, route: '/checklist' },
];

export default function HomeDashboard() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const { userName, progress, streak, refresh, loading } = useRoutineStore();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const calculateTotalProgress = () => {
    let completed = 0;
    if (progress.workout) completed++;
    if (progress.facial) completed++;
    if (progress.vocal) completed++;
    if (progress.posture) completed++;
    if (progress.checklist) completed++;
    return (completed / 5) * 100;
  };

  const handleModulePress = (route: string) => {
    // @ts-ignore
    router.push(route);
  };

  if (loading) return null;

  const totalProgress = calculateTotalProgress();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.date, { color: theme.textSecondary }]}>{getFormattedGreetingDate()}</Text>
            <Text style={[styles.greeting, { color: theme.text }]}>
              Hi{userName ? ` ${userName}` : ''}!
            </Text>
          </View>
          <View style={[styles.streakBadge, { backgroundColor: theme.surface }]}>
            <Flame size={16} color={theme.primary} />
            <Text style={[styles.streakText, { color: theme.text }]}>{streak}</Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <TimerRing progress={totalProgress} label="Completed" color={theme.primary} />
          {totalProgress === 100 && (
            <Text style={[styles.celebrationText, { color: theme.success }]}>
              Amazing! You conquered the morning! 🎉
            </Text>
          )}
        </View>

        {/* Modules Grid */}
        <View style={styles.modulesSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Flow</Text>
          {MODULES.map((mod, index) => (
            <ModuleCard
              key={mod.id}
              title={mod.title}
              icon={mod.icon}
              duration={mod.duration}
              // @ts-ignore
              completed={progress[mod.id]}
              onPress={() => handleModulePress(mod.route)}
              index={index}
            />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 100, // accommodate sticky bottom tabs
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  streakText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  celebrationText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  modulesSection: {},
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  }
});
