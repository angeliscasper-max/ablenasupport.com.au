import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MyShiftsScreen } from '../screens/participant/MyShiftsScreen';
import { PostShiftScreen } from '../screens/participant/PostShiftScreen';
import { ApplicantsScreen } from '../screens/participant/ApplicantsScreen';
import type { RequestsStackParamList } from './types';

const Stack = createNativeStackNavigator<RequestsStackParamList>();

export function RequestsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyShifts" component={MyShiftsScreen} />
      <Stack.Screen name="PostShift" component={PostShiftScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Applicants" component={ApplicantsScreen} />
    </Stack.Navigator>
  );
}
