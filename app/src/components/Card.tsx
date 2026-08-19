import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, space } from '../theme';
import { BlueprintFrame } from './BlueprintFrame';

type Props = { children: React.ReactNode; style?: ViewStyle; elevated?: boolean; blueprint?: boolean };

// Mirrors the final cascaded .card rules (base .card + the blueprint-frame
// override at the bottom of styles.css): transparent, hairline border,
// radius 0, gap 6.8px, padding 10.2px.
export function Card({ children, style, elevated, blueprint = true }: Props) {
  if (blueprint) {
    return (
      <BlueprintFrame style={style}>
        <View style={[styles.padded, elevated && styles.elevated]}>{children}</View>
      </BlueprintFrame>
    );
  }
  return <View style={[styles.base, styles.padded, elevated && styles.elevated, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: colors.divider,
  },
  padded: {
    padding: space[3],
    gap: space[2],
  },
  elevated: {
    shadowColor: colors.neutral900,
    shadowOpacity: 0.14,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});
