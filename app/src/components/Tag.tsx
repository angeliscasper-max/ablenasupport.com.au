import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, type } from '../theme';

type Variant = 'accent' | 'neutral' | 'outline';

export function Tag({ label, variant = 'neutral', style }: { label: string; variant?: Variant; style?: ViewStyle }) {
  return (
    <View style={[styles.base, styles[variant], style]}>
      <Text style={[type.tag, textStyles[variant]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 0, paddingVertical: 3, paddingHorizontal: 10, alignSelf: 'flex-start' },
  accent: { backgroundColor: colors.accent100 },
  neutral: { backgroundColor: colors.neutral100 },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.accent },
});

const textStyles = StyleSheet.create({
  accent: { color: colors.accent800 },
  neutral: { color: colors.neutral800 },
  outline: { color: colors.accent },
});
