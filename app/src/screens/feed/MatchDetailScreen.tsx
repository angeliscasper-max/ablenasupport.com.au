import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Tag } from '../../components/Tag';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { BlueprintFrame } from '../../components/BlueprintFrame';
import { feedShifts, participants } from '../../data/mock';
import type { FeedStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<FeedStackParamList, 'MatchDetail'>;

export function MatchDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const shift = feedShifts.find((s) => s.id === route.params.shiftId) ?? feedShifts[0];
  const participant = participants[shift.participantId];

  const messageParticipant = () => {
    navigation.getParent<any>()?.navigate('MessagesTab', {
      screen: 'Conversation',
      params: { conversationId: `conv-${participant.id}` },
    });
  };

  const apply = () => {
    Alert.alert('Application sent', `${participant.name} will be notified you'd like to take this shift.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Job details" centered onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <BlueprintFrame style={styles.photo}>
          <Text style={styles.photoInitial}>{participant.name[0]}</Text>
        </BlueprintFrame>

        <View>
          <View style={styles.nameRow}>
            <Text style={type.h3}>
              {participant.name}, {participant.age} · {participant.suburb}
            </Text>
            <Tag label={`${shift.match}% match`} variant="accent" />
          </View>
          <Text style={[type.bodySm, styles.bio]}>{participant.bio}</Text>
        </View>

        <View>
          <Text style={type.h6}>Support needed</Text>
          <View style={styles.tagRow}>
            {participant.needs.map((n) => (
              <Tag key={n} label={n} variant="outline" />
            ))}
          </View>
        </View>

        <Card>
          <Text style={type.cardKicker}>You meet every requirement</Text>
          <View style={{ gap: 6 }}>
            {participant.matchRequirements.map((r) => (
              <View key={r.label} style={styles.reqRow}>
                <Text style={type.bodySm}>{r.label}</Text>
                <Tag label={r.verified ? 'Verified' : 'Pending'} variant={r.verified ? 'accent' : 'outline'} />
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.rate}>{shift.rate}</Text>
          <Text style={styles.time}>
            {shift.day} · {shift.time}
          </Text>
        </View>
        <Button title="Message" variant="secondary" onPress={messageParticipant} />
        <Button title="Apply" variant="primary" onPress={apply} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: space[4], gap: space[4] },
  photo: { width: '100%', height: 170, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent100 },
  photoInitial: { fontFamily: type.h1.fontFamily, fontSize: 48, color: colors.accent700 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space[2] },
  bio: { opacity: 0.75, marginTop: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  reqRow: { flexDirection: 'row', justifyContent: 'space-between' },
  footer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: space[4],
    paddingTop: space[3],
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.bg,
  },
  rate: { fontFamily: type.h4.fontFamily, fontSize: 18, color: colors.text },
  time: { fontSize: 11, opacity: 0.6, color: colors.text },
});
