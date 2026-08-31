import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { TextField } from '../../components/TextField';
import { MessageBubble } from '../../components/MessageBubble';
import { SendIcon } from '../../icons';
import { fetchConversation, fetchMessages, sendMessage, ConversationRow, ChatMessage } from '../../data/queries';
import { useAuth } from '../../context/AuthContext';
import type { MessagesStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MessagesStackParamList, 'Conversation'>;

export function ConversationScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const [conversation, setConversation] = useState<ConversationRow | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([fetchConversation(route.params.conversationId), fetchMessages(route.params.conversationId)])
      .then(([convo, msgs]) => {
        setConversation(convo);
        setMessages(msgs);
      })
      .finally(() => setLoading(false));
  }, [route.params.conversationId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const send = async () => {
    const text = draft.trim();
    if (!text || !profile) return;
    setSending(true);
    setDraft('');
    await sendMessage(route.params.conversationId, profile.id, text);
    setSending(false);
    load();
  };

  const otherName =
    conversation && profile
      ? profile.id === conversation.worker_profile_id
        ? conversation.participant_name
        : conversation.worker_name
      : '';

  if (loading && !conversation) {
    return (
      <View style={[styles.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <ScreenHeader title={otherName} onBack={() => navigation.goBack()} />
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <MessageBubble text={item.body} fromMe={item.sender_id === profile?.id} />}
      />
      <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TextField
          style={{ flex: 1 }}
          placeholder={`Message ${otherName.split(' ')[0] ?? ''}…`}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={send}
          returnKeyType="send"
          editable={!sending}
        />
        <Pressable style={styles.sendBtn} onPress={send} disabled={sending}>
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
