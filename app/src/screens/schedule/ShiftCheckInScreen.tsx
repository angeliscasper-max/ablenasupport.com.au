import React, { useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, type } from '../../theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { Tag } from '../../components/Tag';
import { FaceIdIcon } from '../../icons';
import { thisWeek, todayShift } from '../../data/mock';
import type { ScheduleStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ScheduleStackParamList, 'ShiftCheckIn'>;

export function ShiftCheckInScreen(_props: Props) {
  const insets = useSafeAreaInsets();
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [notes, setNotes] = useState('');
  const pulse = useRef(new Animated.Value(1)).current;

  const checkIn = () => {
    if (checkingIn || checkedIn) return;
    setCheckingIn(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.35, duration: 350, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 350, useNativeDriver: true }),
      ])
    ).start();
    setTimeout(() => {
      setCheckingIn(false);
      setCheckedIn(true);
    }, 900);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.body, { paddingTop: insets.top + 24 }]}
    >
      <Text style={type.h3}>Today</Text>

      <Card elevated>
        <Text style={type.cardKicker}>{todayShift.timeLabel}</Text>
        <Text style={type.cardTitle}>{todayShift.title}</Text>
        <Text style={type.cardMeta}>{todayShift.address}</Text>
        {checkedIn ? (
          <Tag label="Checked in" variant="accent" style={{ marginTop: 6 }} />
        ) : (
          <Button
            variant="primary"
            block
            loading={checkingIn}
            style={{ marginTop: 6 }}
            onPress={checkIn}
            icon={
              <Animated.View style={{ opacity: checkingIn ? pulse : 1 }}>
                <FaceIdIcon size={16} color="#fff" />
              </Animated.View>
            }
            title={checkingIn ? 'Scanning…' : 'Check in with Face ID'}
          />
        )}
      </Card>

      <TextField
        label="Shift notes"
        placeholder="Priya had a good morning, ate full breakfast..."
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <View>
        <Text style={type.h6}>This week</Text>
        <View>
          {thisWeek.map((w, i) => (
            <View key={w.label} style={[styles.weekRow, i < thisWeek.length - 1 && styles.weekDivider]}>
              <Text style={type.bodySm}>{w.label}</Text>
              <Tag label={w.status} variant={w.status === 'Completed' ? 'accent' : 'neutral'} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: space[4], gap: space[4] },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  weekDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
});
