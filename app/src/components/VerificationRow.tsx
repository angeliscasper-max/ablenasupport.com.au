import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, type } from '../theme';
import { Tag } from './Tag';
import { VerificationStatus } from '../data/queries';

const STATUS_LABEL: Record<VerificationStatus, string> = {
  verified: 'Verified',
  in_review: 'In review',
  upload_needed: 'Upload needed',
  not_started: 'Not started',
};

const STATUS_VARIANT: Record<VerificationStatus, 'accent' | 'neutral' | 'outline'> = {
  verified: 'accent',
  in_review: 'neutral',
  upload_needed: 'outline',
  not_started: 'outline',
};

type Item = { label: string; status: VerificationStatus };

export function VerificationRow({ item, isLast }: { item: Item; isLast?: boolean }) {
  return (
    <View style={[styles.row, !isLast && styles.divider]}>
      <Text style={[type.bodySm, styles.label]}>{item.label}</Text>
      <Tag label={STATUS_LABEL[item.status]} variant={STATUS_VARIANT[item.status]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, gap: 8 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  label: { flex: 1 },
});
