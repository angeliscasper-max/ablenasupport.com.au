import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { RequestsStack } from './RequestsStack';
import { BrowseStack } from './BrowseStack';
import { MessagesStack } from './MessagesStack';
import { ParticipantProfileStack } from './ParticipantProfileStack';
import { NavBrowseIcon, NavMessagesIcon, NavProfileIcon, NavRequestsIcon } from '../icons';
import type { ParticipantTabParamList } from './types';

const Tab = createBottomTabNavigator<ParticipantTabParamList>();

// Participant-side equivalent of MainTabs — same visual treatment
// (.kin-bottomnav pattern), different set of tabs.
export function ParticipantTabs() {
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
        name="RequestsTab"
        component={RequestsStack}
        options={{ tabBarLabel: 'Requests', tabBarIcon: ({ color }) => <NavRequestsIcon color={color} /> }}
      />
      <Tab.Screen
        name="BrowseTab"
        component={BrowseStack}
        options={{ tabBarLabel: 'Browse', tabBarIcon: ({ color }) => <NavBrowseIcon color={color} /> }}
      />
      <Tab.Screen
        name="ParticipantMessagesTab"
        component={MessagesStack}
        options={{ tabBarLabel: 'Messages', tabBarIcon: ({ color }) => <NavMessagesIcon color={color} /> }}
      />
      <Tab.Screen
        name="ParticipantProfileTab"
        component={ParticipantProfileStack}
        options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color }) => <NavProfileIcon color={color} /> }}
      />
    </Tab.Navigator>
  );
}
