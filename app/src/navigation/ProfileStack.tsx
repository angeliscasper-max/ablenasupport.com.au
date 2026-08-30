import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { GetVerifiedScreen } from '../screens/profile/GetVerifiedScreen';
import { PaymentsScreen } from '../screens/profile/PaymentsScreen';
import { ReviewsScreen } from '../screens/profile/ReviewsScreen';
import { BrowseWorkersScreen } from '../screens/participant/BrowseWorkersScreen';
import { WorkerDetailScreen } from '../screens/participant/WorkerDetailScreen';
import type { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="GetVerified" component={GetVerifiedScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="BrowseWorkers" component={BrowseWorkersScreen} />
      <Stack.Screen name="WorkerDetail" component={WorkerDetailScreen} />
    </Stack.Navigator>
  );
}
