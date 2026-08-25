import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SegmentedControl } from '../../components/SegmentedControl';
import { Card } from '../../components/Card';
import { Tag } from '../../components/Tag';
import { CalendarIcon } from '../../icons';
import { fetchMyBookings, Booking } from '../../data/queries';
import { useAuth } from '../../context/AuthContext';
import type { ScheduleStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ScheduleStackParamList, 'Schedule'>;

const TABS = ['Week', 'Month'] as const;

export function ScheduleScreen({ navigation }: Props) {
  const { session } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Week');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!session) return;
      let cancelled = false;
      setLoading(true);
      fetchMyBookings(session.user.id)
        .then((rows) => {
          if (!cancelled) setBookings(rows);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, [session])
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader brand="Schedule" right={<CalendarIcon />} />
      {loading ? (
        <ActivityIndicator style={{ marginTop: space[8] }} color={colors.accent} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.segWrap}>
              <SegmentedControl options={TABS} value={tab} onChange={setTab} />
            </View>
          }
          ListEmptyComponent={
            <Text style={[type.bodySm, styles.empty]}>No shifts applied for yet — check the Feed tab.</Text>
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('ShiftCheckIn', { bookingId: item.id })}>
              <Card elevated>
                <Text style={type.cardKicker}>
                  {item.shift.day_label} · {item.shift.time_label}
                </Text>
                <Text style={type.cardTitle}>{item.shift.title}</Text>
                <Tag
                  label={item.status === 'confirmed' ? 'Confirmed' : 'Awaiting response'}
                  variant={item.status === 'confirmed' ? 'accent' : 'neutral'}
                />
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
  segWrap: { paddingBottom: space[2] },
  list: { padding: space[4], gap: space[4] },
  empty: { textAlign: 'center', opacity: 0.6, marginTop: space[8] },
});
