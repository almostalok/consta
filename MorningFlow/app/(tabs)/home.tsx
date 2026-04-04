import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import { getFormattedGreetingDate } from '@/utils/dateHelpers';
import { Colors, SIZES } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import TimerRing from '@/components/TimerRing';
import ModuleCard from '@/components/ModuleCard';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { Activity, Smile, Mic, User, CheckSquare } from 'lucide-react-native';

const MODULES = [
  { id: 'workout', title: 'Workout', icon: Activity, duration: 10, route: '/workout' },
  { id: 'facial', title: 'Facial Exercises', icon: Smile, duration: 5, route: '/facial' },
  { id: 'vocal', title: 'Vocal Exercises', icon: Mic, duration: 5, route: '/vocal' },
  { id: 'posture', title: 'Posture Correction', icon: User, duration: 5, route: '/posture' },
  { id: 'checklist', title: 'Morning Checklist', icon: CheckSquare, duration: 2, route: '/checklist' },
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
          <Text style={[styles.date, { color: theme.textSecondary }]}>{getFormattedGreetingDate()}</Text>
          <Text style={[styles.greeting, { color: theme.primary }]}>
            Overview
          </Text>
        </Animated.View>

        {/* Progress Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(800).easing(Easing.out(Easing.exp))} style={styles.progressSection}>
          <View style={[styles.progressCard, { backgroundColor: theme.surfaceContainer, borderColor: theme.border }]}>
            <View style={styles.progressTextContainer}>
               <Text style={[styles.progressTitle, { color: theme.primary }]}>Daily Regimen</Text>
               <Text style={[styles.progressDesc, { color: theme.textSecondary }]}>
                 {streak} Day Streak
               </Text>
            </View>
            <TimerRing progress={totalProgress} label="Done" color={theme.primary} />
          </View>
        </Animated.View>

        {/* Modules Grid */}
        <Animated.View entering={FadeInDown.delay(400).duration(800).easing(Easing.out(Easing.exp))} style={styles.modulesSection}>
          <Text style={[styles.sectionTitle, { color: theme.secondary }]}>MODULES</Text>
          <View style={styles.moduleList}>
            {MODULES.map((mod, index) => (
              <ModuleCard
                key={mod.id}
                title={mod.title}
                IconComponent={mod.icon}
                duration={mod.duration}
                // @ts-ignore
                completed={progress[mod.id]}
                onPress={() => handleModulePress(mod.route)}
                index={index}
                isLast={index === MODULES.length - 1}
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
    paddingBottom: 60,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  date: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  greeting: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 32,
    letterSpacing: -1,
  },
  progressSection: {
    marginBottom: 40,
  },
  progressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1, // Sharp 1px border
  },
  progressTextContainer: {
    flex: 1,
    paddingRight: 20,
  },
  progressTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 20,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  progressDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: SIZES.labelMd,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modulesSection: {
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  moduleList: {
    borderTopWidth: 1,
    borderTopColor: '#222222',
  }
});
