import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UnlockScreen } from '../screens/auth/UnlockScreen';
import { PasscodeScreen } from '../screens/auth/PasscodeScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { MainTabs } from './MainTabs';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Session present (e.g. app reopened) -> Face ID/passcode gate -> Main.
// No session -> sign in / create account. There's nothing to navigate to
// from SignIn until auth succeeds, so it isn't part of this stack.
export function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!session) return <SignInScreen />;

  return (
    <Stack.Navigator initialRouteName="Unlock" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Unlock" component={UnlockScreen} />
      <Stack.Screen name="Passcode" component={PasscodeScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}
