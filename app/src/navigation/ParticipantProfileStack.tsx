import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ParticipantProfileScreen } from '../screens/participant/ParticipantProfileScreen';
import type { ParticipantProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ParticipantProfileStackParamList>();

export function ParticipantProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ParticipantProfile" component={ParticipantProfileScreen} />
    </Stack.Navigator>
  );
}
