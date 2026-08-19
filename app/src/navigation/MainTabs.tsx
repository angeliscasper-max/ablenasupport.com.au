import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { FeedStack } from './FeedStack';
import { ScheduleStack } from './ScheduleStack';
import { MessagesStack } from './MessagesStack';
import { ProfileStack } from './ProfileStack';
import { NavFeedIcon, NavMessagesIcon, NavProfileIcon, NavScheduleIcon } from '../icons';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Mirrors .kin-bottomnav / .kin-navicon: bold uppercase labels, accent-800
// when active, neutral-600 otherwise.
export function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent800,
        tabBarInactiveTintColor: colors.neutral600,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.divider,
          backgroundColor: colors.bg,
          height: 58 + insets.bottom,
          paddingTop: 10,
          paddingBottom: insets.bottom + 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'BarlowCondensed_600SemiBold',
          fontSize: 11,
          letterSpacing: 0.3,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tab.Screen
        name="FeedTab"
        component={FeedStack}
        options={{ tabBarLabel: 'Feed', tabBarIcon: ({ color }) => <NavFeedIcon color={color} /> }}
      />
      <Tab.Screen
        name="ScheduleTab"
        component={ScheduleStack}
        options={{ tabBarLabel: 'Schedule', tabBarIcon: ({ color }) => <NavScheduleIcon color={color} /> }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagesStack}
        options={{ tabBarLabel: 'Messages', tabBarIcon: ({ color }) => <NavMessagesIcon color={color} /> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color }) => <NavProfileIcon color={color} /> }}
      />
    </Tab.Navigator>
  );
}
