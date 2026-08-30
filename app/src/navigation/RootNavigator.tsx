import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UnlockScreen } from '../screens/auth/UnlockScreen';
import { PasscodeScreen } from '../screens/auth/PasscodeScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { MainTabs } from './MainTabs';
import { ParticipantTabs } from './ParticipantTabs';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
      <ActivityIndicator color={colors.accent} />
    </View>
  );
}

// No session -> sign in / create account.
// Session + worker profile -> Face ID/passcode gate -> Main (unchanged).
// Session + participant profile -> straight into their own tabs; Face ID
// was a worker-specific trust moment in the original brief, so there's no
// Unlock step on this branch at all.
export function RootNavigator() {
  const { session, profile, loading } = useAuth();

  if (loading) return <Loading />;
  if (!session) return <SignInScreen />;
  // Session exists but the profile row hasn't loaded yet (brief window
  // right after sign-in/sign-up) — wait rather than guess a role.
  if (!profile) return <Loading />;

  if (profile.role === 'participant') return <ParticipantTabs />;

  return (
    <Stack.Navigator initialRouteName="Unlock" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Unlock" component={UnlockScreen} />
      <Stack.Screen name="Passcode" component={PasscodeScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}
