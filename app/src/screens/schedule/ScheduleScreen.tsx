import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SegmentedControl } from '../../components/SegmentedControl';
import { Card } from '../../components/Card';
import { Tag } from '../../components/Tag';
import { CalendarIcon } from '../../icons';
import { upcomingBookings } from '../../data/mock';
import type { ScheduleStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ScheduleStackParamList, 'Schedule'>;

const TABS = ['Week', 'Month'] as const;

export function ScheduleScreen({ navigation }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Week');

  return (
    <View style={styles.screen}>
      <ScreenHeader brand="Schedule" right={<CalendarIcon />} />
      <FlatList
        data={upcomingBookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.segWrap}>
            <SegmentedControl options={TABS} value={tab} onChange={setTab} />
          </View>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('ShiftCheckIn', { bookingId: item.id })}>
            <Card elevated>
              <Text style={type.cardKicker}>
                {item.dateLabel} · {item.timeLabel}
              </Text>
              <Text style={type.cardTitle}>{item.title}</Text>
              <Tag
                label={item.status === 'confirmed' ? 'Confirmed' : 'Awaiting response'}
                variant={item.status === 'confirmed' ? 'accent' : 'neutral'}
              />
            </Card>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  segWrap: { paddingBottom: space[2] },
  list: { padding: space[4], gap: space[4] },
});
