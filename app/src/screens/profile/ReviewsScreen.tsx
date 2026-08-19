import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { ratingSummary, reviews } from '../../data/mock';
import { useHideTabBar } from '../../hooks/useHideTabBar';

export function ReviewsScreen() {
  const navigation = useNavigation();
  useHideTabBar();

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Reviews" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.summary}>
          <Text style={styles.average}>{ratingSummary.average.toFixed(2)}</Text>
          <Text style={[type.bodySm, { opacity: 0.65 }]}>
            {ratingSummary.count} reviews · {ratingSummary.wouldRebookPct}% would rebook
          </Text>
        </View>
        {reviews.map((r) => (
          <Card key={r.id}>
            <Text style={type.cardKicker}>
              {r.author} · {'★'.repeat(r.stars)}
            </Text>
            <Text style={type.cardBody}>{r.text}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: space[4], gap: space[4] },
  summary: { alignItems: 'center' },
  average: { fontFamily: type.h2.fontFamily, fontSize: 34, color: colors.text },
});
