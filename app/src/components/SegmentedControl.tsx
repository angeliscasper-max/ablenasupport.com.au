import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, type } from '../theme';

type Props<T extends string> = { options: readonly T[]; value: T; onChange: (v: T) => void };

// Mirrors .seg / .seg-opt.
export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.seg}>
      {options.map((opt, i) => {
        const selected = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[styles.opt, i > 0 && styles.optBorder, selected && styles.optSelected]}
          >
            <Text style={[type.bodySm, selected && { color: colors.bg }]}>{opt}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  seg: { flexDirection: 'row', borderWidth: 1, borderColor: colors.divider, borderRadius: 0, overflow: 'hidden' },
  opt: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 7, paddingHorizontal: 12 },
  optBorder: { borderLeftWidth: 1, borderLeftColor: colors.divider },
  optSelected: { backgroundColor: colors.accent },
});
