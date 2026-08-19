import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MessagesListScreen } from '../screens/messages/MessagesListScreen';
import { ConversationScreen } from '../screens/messages/ConversationScreen';
import type { MessagesStackParamList } from './types';

const Stack = createNativeStackNavigator<MessagesStackParamList>();

export function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagesList" component={MessagesListScreen} />
      <Stack.Screen name="Conversation" component={ConversationScreen} />
    </Stack.Navigator>
  );
}
