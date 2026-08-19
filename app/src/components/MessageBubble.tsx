import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, type } from '../theme';

export function MessageBubble({ text, fromMe }: { text: string; fromMe: boolean }) {
  return <Text style={[styles.base, fromMe ? styles.out : styles.in]}>{text}</Text>;
}

const styles = StyleSheet.create({
  base: { maxWidth: '78%', paddingVertical: 8, paddingHorizontal: 12, fontSize: 13, fontFamily: type.body.fontFamily },
  in: { alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.divider, color: colors.text },
  out: { alignSelf: 'flex-end', backgroundColor: colors.accent100, color: colors.accent900 },
});
