import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { fetchMyBookings, Booking } from '../../data/queries';
import { parseHourlyRate, parseShiftHours, summarizeConfirmedBookings } from '../../lib/shiftEarnings';
import { useAuth } from '../../context/AuthContext';
import { useHideTabBar } from '../../hooks/useHideTabBar';

export function PaymentsScreen() {
  const navigation = useNavigation();
  useHideTabBar();
  const { profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      let cancelled = false;
      setLoading(true);
      fetchMyBookings(profile.id)
        .then((rows) => {
          if (!cancelled) setBookings(rows);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, [profile])
  );

  const confirmed = bookings.filter((b) => b.status === 'confirmed');
  const summary = summarizeConfirmedBookings(bookings);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Payments" onBack={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator style={{ marginTop: space[8] }} color={colors.accent} />
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          <Card>
            <Text style={type.cardKicker}>Earnings</Text>
            <Text style={styles.amount}>${summary.totalAmount.toFixed(2)}</Text>
            <Text style={[type.bodySm, { opacity: 0.65 }]}>
              {summary.totalHours.toFixed(1)} hrs across {summary.shiftCount} confirmed shifts
            </Text>
          </Card>

          <View>
            <Text style={type.h6}>Confirmed shifts</Text>
            {confirmed.length === 0 ? (
              <Text style={[type.bodySm, styles.empty]}>No confirmed shifts yet.</Text>
            ) : (
              confirmed.map((b, i) => {
                const rate = parseHourlyRate(b.shift.rate);
                const hours = parseShiftHours(b.shift.time_label);
                const amount = rate != null && hours != null ? `$${(rate * hours).toFixed(2)}` : 'Rate unavailable';
                return (
                  <View key={b.id} style={[styles.row, i < confirmed.length - 1 && styles.divider]}>
                    <View style={{ flex: 1 }}>
                      <Text style={type.bodySm}>{b.shift.title}</Text>
                      <Text style={[type.bodySm, { opacity: 0.6 }]}>
                        {b.shift.day_label} · {b.shift.time_label} · {b.shift.participant.name}
                      </Text>
                    </View>
                    <Text style={type.bodySm}>{amount}</Text>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: space[4], gap: space[4] },
  amount: { fontFamily: type.h2.fontFamily, fontSize: 30, color: colors.text },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: space[2], paddingVertical: 9 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  empty: { opacity: 0.6, marginTop: space[2] },
});
