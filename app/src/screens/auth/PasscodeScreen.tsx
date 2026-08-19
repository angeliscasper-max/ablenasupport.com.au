import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Passcode'>;

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

export function PasscodeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [digits, setDigits] = useState('');

  const press = (key: string) => {
    if (key === '') return;
    if (key === '⌫') return setDigits((d) => d.slice(0, -1));
    setDigits((d) => {
      const next = (d + key).slice(0, 4);
      if (next.length === 4) {
        setTimeout(() => {
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] }));
        }, 200);
      }
      return next;
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Enter passcode" centered onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={styles.dots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, i < digits.length && styles.dotFilled]} />
          ))}
        </View>
        <View style={styles.keypad}>
          {KEYS.map((k, i) => (
            <Pressable key={i} style={styles.key} disabled={k === ''} onPress={() => press(k)}>
              <Text style={type.h4}>{k}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={{ height: insets.bottom }} />
    </View>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[8] },
  dots: { flexDirection: 'row', gap: 18 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: colors.divider },
  dotFilled: { backgroundColor: colors.accent, borderColor: colors.accent },
  keypad: { width: 260, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: space[6] },
  key: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
});
