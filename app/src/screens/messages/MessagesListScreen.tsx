import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Tag } from '../../components/Tag';
import { conversations } from '../../data/mock';
import type { MessagesStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MessagesStackParamList, 'MessagesList'>;

export function MessagesListScreen({ navigation }: Props) {
  return (
    <View style={styles.screen}>
      <ScreenHeader brand="Messages" />
      <FlatList
        data={conversations}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => {
          const last = item.messages[item.messages.length - 1];
          return (
            <Pressable
              style={styles.row}
              onPress={() => navigation.navigate('Conversation', { conversationId: item.id })}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={type.cardTitle}>{item.name}</Text>
                  {item.verified ? <Tag label="Verified" variant="accent" /> : null}
                </View>
                <Text style={[type.bodySm, styles.preview]} numberOfLines={1}>
                  {last.fromMe ? 'You: ' : ''}
                  {last.text}
                </Text>
              </View>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  row: { paddingHorizontal: space[4], paddingVertical: space[3] },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  preview: { opacity: 0.65, marginTop: 3 },
  sep: { height: 1, backgroundColor: colors.divider, marginLeft: space[4] },
});
