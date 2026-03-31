import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, SIZES } from '@/constants/theme';
import { Home, BarChart2, Settings } from 'lucide-react-native';
import { Platform, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark']; // Enforce dark

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        headerShown: false,
        tabBarShowLabel: false, // The Floating Tab Bar has no labels 
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <View style={styles.blurContainer}>
             <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          </View>
        ),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
             <View style={styles.iconContainer}>
               <Home size={28} color={color} />
               {focused && <View style={[styles.glowDot, { backgroundColor: theme.primary }]} />}
             </View>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, focused }) => (
             <View style={styles.iconContainer}>
               <BarChart2 size={28} color={color} />
               {focused && <View style={[styles.glowDot, { backgroundColor: theme.primary }]} />}
             </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
             <View style={styles.iconContainer}>
                <Settings size={28} color={color} />
                {focused && <View style={[styles.glowDot, { backgroundColor: theme.primary }]} />}
             </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    height: 64,
    borderRadius: 32, // Pill shape
    borderWidth: 0,
    borderTopWidth: 0,
    elevation: 0, // Remove shadow
    backgroundColor: 'transparent',
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(53, 53, 53, 0.6)', // surface_container_highest with opacity
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  glowDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  }
});
