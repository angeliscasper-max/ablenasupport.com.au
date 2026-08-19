import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, space, type } from '../theme';

type Props = TextInputProps & { label?: string; multiline?: boolean };

// Mirrors .field/label + .input.
export function TextField({ label, style, multiline, ...rest }: Props) {
  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, multiline && styles.multiline, style]}
        placeholderTextColor="rgba(29,31,32,0.45)"
        multiline={multiline}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, marginBottom: 5, color: 'rgba(29,31,32,0.7)', fontFamily: type.body.fontFamily },
  input: {
    width: '100%',
    minHeight: 36,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    fontFamily: type.body.fontFamily,
  },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
});
