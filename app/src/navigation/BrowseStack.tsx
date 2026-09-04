import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BrowseWorkersScreen } from '../screens/participant/BrowseWorkersScreen';
import { WorkerDetailScreen } from '../screens/participant/WorkerDetailScreen';
import { ReviewsScreen } from '../screens/profile/ReviewsScreen';
import type { BrowseStackParamList } from './types';

const Stack = createNativeStackNavigator<BrowseStackParamList>();

export function BrowseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Browse" component={BrowseWorkersScreen} />
      <Stack.Screen name="WorkerDetail" component={WorkerDetailScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
    </Stack.Navigator>
  );
}
