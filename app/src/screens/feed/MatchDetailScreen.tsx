import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Tag } from '../../components/Tag';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { BlueprintFrame } from '../../components/BlueprintFrame';
import {
  fetchShift,
  applyToShift,
  findOrCreateConversation,
  fetchMyWorkerProfile,
  fetchMyVerifications,
  Shift,
  WorkerVerification,
} from '../../data/queries';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../lib/notify';
import { VerificationRow } from '../../components/VerificationRow';
import type { FeedStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<FeedStackParamList, 'MatchDetail'>;

export function MatchDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { session, profile } = useAuth();
  const [shift, setShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [checklist, setChecklist] = useState<WorkerVerification[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchShift(route.params.shiftId)
      .then((s) => {
        if (!cancelled) setShift(s);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [route.params.shiftId]);

  useEffect(() => {
    if (!profile) return;
    let cancelled = false;
    fetchMyWorkerProfile(profile.id)
      .then((me) => {
        if (cancelled || !me) return;
        return fetchMyVerifications(me.id).then((rows) => {
          if (!cancelled) setChecklist(rows);
        });
      })
      .catch(() => {
        // Non-critical here — the card just stays hidden if this fails.
      });
    return () => {
      cancelled = true;
    };
  }, [profile]);

  if (loading || !shift) {
    return (
      <View style={[styles.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  const participant = shift.participant;

  const messageParticipant = async () => {
    if (!profile) return;
    if (!participant.profile_id) {
      notify('Messaging unavailable', "This is a demo profile without a real account, so it can't be messaged yet.");
      return;
    }
    const convo = await findOrCreateConversation({
      workerProfileId: profile.id,
      workerName: profile.full_name,
      participantProfileId: participant.profile_id,
      participantName: participant.name,
    });
    navigation.getParent<any>()?.navigate('MessagesTab', {
      screen: 'Conversation',
      params: { conversationId: convo.id },
    });
  };

  const apply = async () => {
    if (!session) return;
    setApplying(true);
    const { error } = await applyToShift(shift.id, session.user.id);
    setApplying(false);
    if (error) {
      notify("Couldn't apply", error);
      return;
    }
    notify('Application sent', `${participant.name} will be notified you'd like to take this shift.`, () =>
      navigation.goBack()
    );
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
              {participant.name}
              {participant.age != null ? `, ${participant.age}` : ''} · {participant.suburb}
            </Text>
            {shift.match_score != null && <Tag label={`${shift.match_score}% match`} variant="accent" />}
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

        {checklist.length > 0 && (
          <Card>
            <Text style={type.cardKicker}>Your verification status</Text>
            <View>
              {checklist.map((item, i) => (
                <VerificationRow key={item.id} item={item} isLast={i === checklist.length - 1} />
              ))}
            </View>
          </Card>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.rate}>{shift.rate}</Text>
          <Text style={styles.time}>
            {shift.day_label} · {shift.time_label}
          </Text>
        </View>
        <Button title="Message" variant="secondary" onPress={messageParticipant} />
        <Button title="Apply" variant="primary" loading={applying} onPress={apply} />
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
