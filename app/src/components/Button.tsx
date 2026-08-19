import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, type } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'icon';

type Props = {
  title?: string;
  onPress?: () => void;
  variant?: Variant;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
};

// Mirrors .btn / .btn-primary / .btn-secondary / .btn-ghost / .btn-icon /
// .btn-block in styles.css, including the blueprint-frame override at the
// bottom of that file (radius 0, hairline border on every variant).
export function Button({ title, onPress, variant = 'secondary', block, disabled, loading, icon, style }: Props) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  const isIcon = variant === 'icon';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary && styles.primary,
        variant === 'secondary' && styles.secondary,
        isGhost && styles.ghost,
        isIcon && styles.icon,
        block && styles.block,
        pressed && !disabled && { opacity: 0.75 },
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={isPrimary ? colors.bg : colors.accent} />
        ) : (
          <>
            {icon}
            {title ? (
              <Text style={[type.btn, isPrimary && { color: colors.bg }, isGhost && { color: colors.accent }]}>
                {title}
              </Text>
            ) : null}
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primary: { backgroundColor: colors.accent, borderColor: colors.accent },
  secondary: { backgroundColor: 'transparent' },
  ghost: { backgroundColor: 'transparent', borderColor: 'transparent', paddingHorizontal: 4 },
  icon: { width: 36, height: 36, paddingHorizontal: 0, paddingVertical: 0 },
  block: { width: '100%' },
  disabled: { opacity: 0.45 },
});
