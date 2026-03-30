import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Colors, SIZES } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import { format, subDays } from 'date-fns';
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Flame, Target, Trophy, Calendar } from 'lucide-react-native';
import { getData } from '@/utils/storage';

const BarChart = ({ data, theme }: { data: number[], theme: any }) => {
  return (
    <View style={styles.chartContainer}>
      {data.map((value, index) => {
        const heightVal = useSharedValue(0);
        React.useEffect(() => {
          heightVal.value = withTiming(value, { duration: 1000 });
        }, [value]);

        const animatedStyle = useAnimatedStyle(() => ({
          height: `${heightVal.value}%`
        }));

        return (
          <View key={index} style={styles.barCol}>
            <View style={[styles.barBg, { backgroundColor: theme.border }]}>
              <Animated.View style={[styles.barFill, { backgroundColor: theme.primary }, animatedStyle]} />
            </View>
            <Text style={[styles.barLabel, { color: theme.textSecondary }]}>
              {format(subDays(new Date(), 6 - index), 'EE').charAt(0)}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default function ProgressScreen() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const { streak } = useRoutineStore();
  
  const [historyCount, setHistoryCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const fetchHistory = async () => {
      const historyDates = await getData<string[]>('completed_history') || [];
      setHistoryCount(historyDates.length);
      
      // Mocking some weekly data for visual purposes
      // In a real app, you would parse the historyDates and cross reference with the last 7 days
      const mockData = [40, 60, 100, 80, 20, 100, Math.random() > 0.5 ? 100 : 80];
      setWeeklyData(mockData);
    };
    fetchHistory();
  }, [streak]);

  const StatCard = ({ icon, title, value, index }: any) => (
    <Animated.View entering={FadeInUp.delay(index * 100)} style={[styles.statCard, { backgroundColor: theme.surface }]}>
      <View style={[styles.iconWrapper, { backgroundColor: theme.background }]}>
        {icon}
      </View>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: theme.textSecondary }]}>{title}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Your Journey</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.statsRow}>
          <StatCard 
            index={0}
            icon={<Flame size={24} color="#FF6B6B" />} 
            title="Day Streak" 
            value={streak} 
          />
          <StatCard 
            index={1}
            icon={<Target size={24} color="#1DD1A1" />} 
            title="Total Days" 
            value={historyCount} 
          />
        </View>

        <Animated.View entering={FadeInUp.delay(300)} style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.cardHeader}>
            <Calendar size={20} color={theme.text} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Last 7 Days</Text>
          </View>
          <BarChart data={weeklyData} theme={theme} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400)} style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.cardHeader}>
            <Trophy size={20} color={theme.secondary} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Milestones</Text>
          </View>
          
          <View style={styles.milestoneRow}>
            <View style={[styles.milestoneCircle, { backgroundColor: theme.primary }]}><Text style={styles.milestoneEmoji}>🔥</Text></View>
            <View style={styles.milestoneInfo}>
              <Text style={[styles.milestoneTitle, { color: theme.text }]}>First Flow</Text>
              <Text style={[styles.milestoneDesc, { color: theme.textSecondary }]}>Completed your first routine</Text>
            </View>
            <CheckCircle2 color={theme.success} size={24} />
          </View>

          <View style={styles.milestoneRow}>
            <View style={[styles.milestoneCircle, { backgroundColor: theme.border }]}><Text style={styles.milestoneEmoji}>⭐</Text></View>
            <View style={styles.milestoneInfo}>
              <Text style={[styles.milestoneTitle, { color: theme.text }]}>7-Day Streak</Text>
              <Text style={[styles.milestoneDesc, { color: theme.textSecondary }]}>Complete a full week ({streak}/7)</Text>
            </View>
          </View>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: SIZES.padding, paddingTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  content: { padding: SIZES.padding, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  statTitle: { fontSize: 14, fontWeight: '500' },
  card: {
    padding: 20,
    borderRadius: SIZES.radius,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 10,
  },
  barCol: { alignItems: 'center', width: 30, height: '100%' },
  barBg: {
    width: 12,
    flex: 1,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barLabel: { marginTop: 8, fontSize: 12, fontWeight: '500' },
  milestoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  milestoneCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  milestoneEmoji: { fontSize: 20 },
  milestoneInfo: { flex: 1 },
  milestoneTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  milestoneDesc: { fontSize: 13 },
});

import { CheckCircle2 } from 'lucide-react-native';
