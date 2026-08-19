import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UnlockScreen } from '../screens/auth/UnlockScreen';
import { PasscodeScreen } from '../screens/auth/PasscodeScreen';
import { GetVerifiedScreen } from '../screens/profile/GetVerifiedScreen';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Unlock" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Unlock" component={UnlockScreen} />
      <Stack.Screen name="Passcode" component={PasscodeScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="OnboardingVerify" component={GetVerifiedScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}
