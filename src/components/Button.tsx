import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

export interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

/** Single button primitive for every CTA on the page. Variant is a
 * closed set on purpose — arbitrary style props aren't accepted here
 * (use the SDUI `style` override on the node for one-off tweaks) so
 * buttons stay visually consistent across a JSON-authored screen. */
export default function Button({
  label,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  onPress,
}: ButtonProps): React.JSX.Element {
  const variantStyle: ViewStyle =
    variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : styles.outline;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.base, variantStyle, fullWidth && styles.fullWidth, disabled && styles.disabled]}
    >
      <Text style={[styles.label, variant === 'outline' && styles.outlineLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginTop: 12 },
  fullWidth: { width: '100%' },
  primary: { backgroundColor: '#3B2FF2' },
  secondary: { backgroundColor: '#111' },
  outline: { borderWidth: 1.5, borderColor: '#3B2FF2', backgroundColor: 'transparent' },
  disabled: { opacity: 0.5 },
  label: { color: '#fff', fontWeight: '700', fontSize: 15 },
  outlineLabel: { color: '#3B2FF2' },
});
