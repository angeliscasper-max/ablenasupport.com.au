import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { fetchMyConversations, ConversationRow } from '../../data/queries';
import { useAuth } from '../../context/AuthContext';
import type { MessagesStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MessagesStackParamList, 'MessagesList'>;

export function MessagesListScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      let cancelled = false;
      setLoading(true);
      fetchMyConversations(profile.id)
        .then((rows) => {
          if (!cancelled) setConversations(rows);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, [profile])
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader brand="Messages" />
      {loading ? (
        <ActivityIndicator style={{ marginTop: space[8] }} color={colors.accent} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(c) => c.id}
          contentContainerStyle={conversations.length === 0 ? styles.emptyList : undefined}
          ListEmptyComponent={
            <Text style={[type.bodySm, styles.empty]}>
              No conversations yet — message someone from Browse or a shift to start one.
            </Text>
          }
          renderItem={({ item }) => {
            const otherName = profile?.id === item.worker_profile_id ? item.participant_name : item.worker_name;
            return (
              <Pressable
                style={styles.row}
                onPress={() => navigation.navigate('Conversation', { conversationId: item.id })}
              >
                <View style={{ flex: 1 }}>
                  <Text style={type.cardTitle}>{otherName}</Text>
                  <Text style={[type.bodySm, styles.preview]} numberOfLines={1}>
                    {item.last_message_body ?? 'Say hello 👋'}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  row: { paddingHorizontal: space[4], paddingVertical: space[3] },
  preview: { opacity: 0.65, marginTop: 3 },
  sep: { height: 1, backgroundColor: colors.divider, marginLeft: space[4] },
  emptyList: { flexGrow: 1 },
  empty: { textAlign: 'center', opacity: 0.6, marginTop: space[8], paddingHorizontal: space[4] },
});
