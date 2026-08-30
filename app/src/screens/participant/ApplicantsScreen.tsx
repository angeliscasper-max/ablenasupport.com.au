import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Tag } from '../../components/Tag';
import { Button } from '../../components/Button';
import { fetchApplicantsForShift, confirmApplicant, Applicant } from '../../data/queries';
import type { RequestsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RequestsStackParamList, 'Applicants'>;

export function ApplicantsScreen({ navigation, route }: Props) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchApplicantsForShift(route.params.shiftId)
      .then(setApplicants)
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
          renderItem={({ item }) => (
            <Card elevated>
              <Text style={type.cardTitle}>{item.worker?.full_name ?? 'A support worker'}</Text>
              <Tag label={item.status === 'confirmed' ? 'Confirmed' : 'Applied'} variant={item.status === 'confirmed' ? 'accent' : 'neutral'} />
              {item.status === 'applied' && (
                <Button title="Confirm" variant="primary" block loading={confirmingId === item.id} onPress={() => confirm(item.id)} />
              )}
            </Card>
          )}
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
