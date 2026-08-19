import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, type } from '../theme';
import { BackChevronIcon } from '../icons';

type Props = {
  title?: string;
  brand?: string;
  centered?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  divider?: boolean;
};

// Mirrors the .nav bar used throughout the screens (brand + trailing icon,
// or back-chevron + centered title + spacer).
export function ScreenHeader({ title, brand, centered, onBack, right, divider = true }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 10 }, divider && styles.divider]}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={10} style={styles.side}>
          <BackChevronIcon />
        </Pressable>
      ) : (
        <View style={styles.side} />
      )}

      {brand ? (
        <Text style={[type.navBrand, styles.brand]}>{brand}</Text>
      ) : (
        <Text style={[type.navBrand, centered ? styles.centerTitle : styles.brand, { fontSize: 15 }]}>{title}</Text>
      )}

      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
    paddingHorizontal: space[4],
    paddingBottom: space[3],
    backgroundColor: colors.bg,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  side: { minWidth: 20, alignItems: 'flex-end' },
  brand: { flex: 1, textAlign: 'left' },
  centerTitle: { flex: 1, textAlign: 'center' },
});
