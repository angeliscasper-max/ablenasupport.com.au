import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Tag } from '../../components/Tag';
import { Button } from '../../components/Button';
import {
  fetchApplicantsForShift,
  confirmApplicant,
  fetchReviewForApplication,
  fetchMyWorkerProfile,
  Applicant,
} from '../../data/queries';
import type { RequestsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RequestsStackParamList, 'Applicants'>;

type ReviewState = { workerProfileId: string; reviewed: boolean };

export function ApplicantsScreen({ navigation, route }: Props) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [reviewState, setReviewState] = useState<Record<string, ReviewState>>({});
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchApplicantsForShift(route.params.shiftId)
      .then(async (rows) => {
        setApplicants(rows);
        const confirmed = rows.filter((r) => r.status === 'confirmed' && r.worker);
        const entries = await Promise.all(
          confirmed.map(async (r) => {
            const [workerProfile, review] = await Promise.all([
              fetchMyWorkerProfile(r.worker!.id),
              fetchReviewForApplication(r.id),
            ]);
            return workerProfile ? ([r.id, { workerProfileId: workerProfile.id, reviewed: !!review }] as const) : null;
          })
        );
        setReviewState(Object.fromEntries(entries.filter((e): e is NonNullable<typeof e> => e !== null)));
      })
      .finally(() => setLoading(false));
  }, [route.params.shiftId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const confirm = async (applicationId: string) => {
    setConfirmingId(applicationId);
    await confirmApplicant(applicationId);
    setConfirmingId(null);
    load();
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Applicants" centered onBack={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator style={{ marginTop: space[8] }} color={colors.accent} />
      ) : (
        <FlatList
          data={applicants}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={[type.bodySm, styles.empty]}>No one has applied to this shift yet.</Text>
          }
          renderItem={({ item }) => {
            const review = reviewState[item.id];
            return (
              <Card elevated>
                <Text style={type.cardTitle}>{item.worker?.full_name ?? 'A support worker'}</Text>
                <Tag label={item.status === 'confirmed' ? 'Confirmed' : 'Applied'} variant={item.status === 'confirmed' ? 'accent' : 'neutral'} />
                {item.status === 'applied' && (
                  <Button title="Confirm" variant="primary" block loading={confirmingId === item.id} onPress={() => confirm(item.id)} />
                )}
                {item.status === 'confirmed' && review && !review.reviewed && (
                  <Button
                    title="Leave a review"
                    variant="secondary"
                    block
                    onPress={() =>
                      navigation.navigate('LeaveReview', {
                        applicationId: item.id,
                        workerProfileId: review.workerProfileId,
                        workerName: item.worker?.full_name ?? 'this worker',
                      })
                    }
                  />
                )}
                {item.status === 'confirmed' && review?.reviewed && <Tag label="Reviewed" variant="neutral" />}
              </Card>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { padding: space[4], gap: space[3] },
  empty: { textAlign: 'center', opacity: 0.6, marginTop: space[8] },
});
