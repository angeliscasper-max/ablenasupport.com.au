import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { nextPayout, thisWeekPayouts } from '../../data/mock';
import { useHideTabBar } from '../../hooks/useHideTabBar';

export function PaymentsScreen() {
  const navigation = useNavigation();
  useHideTabBar();

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Payments" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <Card>
          <Text style={type.cardKicker}>Next payout · {nextPayout.dayLabel}</Text>
          <Text style={styles.amount}>{nextPayout.amount}</Text>
          <Text style={[type.bodySm, { opacity: 0.65 }]}>Rate breakdown shown per shift — no hidden platform cut</Text>
        </Card>

        <View>
          <Text style={type.h6}>This week's shifts</Text>
          {thisWeekPayouts.map((p, i) => (
            <View key={p.id} style={[styles.row, i < thisWeekPayouts.length - 1 && styles.divider]}>
              <Text style={type.bodySm}>{p.label}</Text>
              <Text style={type.bodySm}>{p.amount}</Text>
            </View>
          ))}
        </View>

        <Button title="Download tax invoice" variant="secondary" block />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: space[4], gap: space[4] },
  amount: { fontFamily: type.h2.fontFamily, fontSize: 30, color: colors.text },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
});
