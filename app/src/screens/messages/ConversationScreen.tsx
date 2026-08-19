import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Tag } from '../../components/Tag';
import { TextField } from '../../components/TextField';
import { MessageBubble } from '../../components/MessageBubble';
import { SendIcon } from '../../icons';
import { conversations, Message } from '../../data/mock';
import type { MessagesStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MessagesStackParamList, 'Conversation'>;

export function ConversationScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const base = conversations.find((c) => c.id === route.params.conversationId) ?? conversations[0];
  const [messages, setMessages] = useState<Message[]>(base.messages);
  const [draft, setDraft] = useState('');

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: `local-${prev.length}`, fromMe: true, text }]);
    setDraft('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <ScreenHeader title={base.name} onBack={() => navigation.goBack()} right={<Tag label="Verified" variant="accent" />} />
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <MessageBubble text={item.text} fromMe={item.fromMe} />}
      />
      <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TextField
          style={{ flex: 1 }}
          placeholder={`Message ${base.name.split(' ')[0]}…`}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <Pressable style={styles.sendBtn} onPress={send}>
          <SendIcon size={16} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { padding: space[4], gap: 10 },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 0,
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
