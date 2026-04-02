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
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';

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
  const theme = Colors[colorScheme ?? 'dark']; // Enforce dark
  
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
        <Animated.View entering={FadeInDown.duration(800).easing(Easing.out(Easing.exp))} style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.date, { color: theme.textSecondary }]}>{getFormattedGreetingDate()}</Text>
            <Text style={[styles.greeting, { color: theme.primary }]}>
              Hi{userName ? ` ${userName}` : ''}.
            </Text>
          </View>
          <View style={[styles.streakBadge, { backgroundColor: theme.surfaceContainer, borderColor: theme.border }]}>
            <Flame size={16} color={theme.text} />
            <Text style={[styles.streakText, { color: theme.text }]}>{streak}</Text>
          </View>
        </Animated.View>

        {/* Progress Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(800).easing(Easing.out(Easing.exp))} style={styles.progressSection}>
          <View style={[styles.progressCard, { backgroundColor: theme.surfaceLow }]}>
            <View style={styles.progressTextContainer}>
               <Text style={[styles.progressTitle, { color: theme.primary }]}>Your Daily Flow</Text>
               <Text style={[styles.progressDesc, { color: theme.textSecondary }]}>
                 {totalProgress === 100 
                   ? "You’ve conquered the morning."
                   : "Consistency creates prestige."}
               </Text>
            </View>
            <TimerRing progress={totalProgress} label="Done" color={theme.primary} />
          </View>
        </Animated.View>

        {/* Modules Grid */}
        <Animated.View entering={FadeInDown.delay(400).duration(800).easing(Easing.out(Easing.exp))} style={styles.modulesSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Routine</Text>
          <View style={{ gap: SIZES.padding / 2 }}>
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
        </Animated.View>

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
    paddingBottom: 120, // accommodate sticky bottom tabs
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 40, // Increased whitespace
  },
  headerTextContainer: {
    paddingRight: 10,
  },
  date: {
    fontFamily: 'Inter_500Medium',
    fontSize: SIZES.labelMd,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  greeting: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: SIZES.headlineLg,
    letterSpacing: -1,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1, // Ghost border
  },
  streakText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: SIZES.labelMd,
    marginLeft: 6,
    letterSpacing: 1,
  },
  progressSection: {
    marginBottom: 48, // Generous whitespace
  },
  progressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radiusLg, // surface_lowest context
  },
  progressTextContainer: {
    flex: 1,
    paddingRight: 20,
  },
  progressTitle: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 20,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  progressDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: SIZES.labelMd,
    lineHeight: 18,
  },
  modulesSection: {
  },
  sectionTitle: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: SIZES.headlineLg,
    marginBottom: 24, // Separation of Space
    letterSpacing: -1,
  }
});
