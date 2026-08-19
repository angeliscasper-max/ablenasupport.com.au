import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme';

const CORNER_COLOR = 'rgba(29,31,32,0.55)';

function Corner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  return (
    <View style={[styles.corner, cornerPositions[position]]}>
      <View style={styles.cornerV} />
      <View style={styles.cornerH} />
    </View>
  );
}

// Mirrors .blueprint / .blueprint > .corner: a hairline box with four L-shaped
// registration marks floating just outside each corner.
export function BlueprintFrame({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[styles.frame, style]}>
      {children}
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { borderWidth: 1, borderColor: colors.divider, position: 'relative' },
  corner: { position: 'absolute', width: 11, height: 11 },
  cornerV: { position: 'absolute', left: 5, top: 0, width: 1, height: '100%', backgroundColor: CORNER_COLOR },
  cornerH: { position: 'absolute', top: 5, left: 0, height: 1, width: '100%', backgroundColor: CORNER_COLOR },
});

const cornerPositions: Record<string, ViewStyle> = {
  tl: { top: -6, left: -6 },
  tr: { top: -6, right: -6 },
  bl: { bottom: -6, left: -6 },
  br: { bottom: -6, right: -6 },
};
