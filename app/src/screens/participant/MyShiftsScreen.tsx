import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Tag } from '../../components/Tag';
import { PlusIcon } from '../../icons';
import { fetchMyParticipant, fetchMyPostedShifts, Shift } from '../../data/queries';
import { useAuth } from '../../context/AuthContext';
import type { RequestsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RequestsStackParamList, 'MyShifts'>;

export function MyShiftsScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      let cancelled = false;
      setLoading(true);
      fetchMyParticipant(profile.id)
        .then((me) => (me ? fetchMyPostedShifts(me.id) : Promise.resolve([])))
        .then((rows) => {
          if (!cancelled) setShifts(rows);
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
      <ScreenHeader
        brand="My requests"
        right={
          <Pressable onPress={() => navigation.navigate('PostShift')} hitSlop={10}>
            <PlusIcon />
          </Pressable>
        }
      />
      {loading ? (
        <ActivityIndicator style={{ marginTop: space[8] }} color={colors.accent} />
      ) : (
        <FlatList
          data={shifts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={[type.bodySm, styles.empty]}>
              No requests posted yet — tap + to post your first shift.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('Applicants', { shiftId: item.id })}>
              <Card elevated>
                <Text style={type.cardKicker}>
                  {item.day_label} · {item.time_label}
                </Text>
                <Text style={type.cardTitle}>{item.title}</Text>
                <Text style={type.cardBody}>{item.description}</Text>
                <Tag label={item.status === 'filled' ? 'Filled' : 'Open'} variant={item.status === 'filled' ? 'accent' : 'neutral'} />
              </Card>
            </Pressable>
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
