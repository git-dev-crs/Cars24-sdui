import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface UnknownComponentProps {
  type: string;
}

/** Graceful-degradation fallback for any `type` the registry doesn't
 * recognise. Never throws. In production this would likely render
 * `null` (silently skip) instead of a visible placeholder — it's kept
 * visible here on purpose so the unknown-component behaviour is
 * demoable on camera per the assignment brief. Toggle via
 * `SHOW_UNKNOWN_PLACEHOLDER` if you want the "silent skip" behaviour. */
const SHOW_UNKNOWN_PLACEHOLDER = true;

export default function UnknownComponent({ type }: UnknownComponentProps): React.JSX.Element | null {
  if (!SHOW_UNKNOWN_PLACEHOLDER) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Unsupported component: "{type}" — skipped safely</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    backgroundColor: '#fafafa',
  },
  text: { color: '#999', fontSize: 12, textAlign: 'center' },
});
