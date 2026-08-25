import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, type } from '../theme';
import { Card } from './Card';
import { Tag } from './Tag';
import { Button } from './Button';
import type { Shift } from '../data/queries';

export function ShiftCard({ shift, onPress }: { shift: Shift; onPress: () => void }) {
  return (
    <Card elevated>
      <View style={styles.topRow}>
        <Text style={type.cardKicker}>
          {shift.category.toUpperCase()} · {shift.distance_km}KM
        </Text>
        <Tag label={`${shift.match_score}% match`} variant="accent" />
      </View>
      <Text style={type.cardTitle}>{shift.title}</Text>
      <Text style={type.cardBody}>{shift.description}</Text>
      <View style={styles.tagRow}>
        {shift.tags.map((t) => (
          <Tag key={t} label={t} variant="neutral" />
        ))}
      </View>
      <Text style={type.cardMeta}>
        {shift.day_label} · {shift.time_label} · {shift.rate}
      </Text>
      <Button title="View & apply" variant="secondary" block onPress={onPress} />
    </Card>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});
