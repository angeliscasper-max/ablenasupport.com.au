import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScheduleScreen } from '../screens/schedule/ScheduleScreen';
import { ShiftCheckInScreen } from '../screens/schedule/ShiftCheckInScreen';
import type { ScheduleStackParamList } from './types';

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export function ScheduleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="ShiftCheckIn" component={ShiftCheckInScreen} />
    </Stack.Navigator>
  );
}
