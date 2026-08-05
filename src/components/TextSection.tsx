import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface TextSectionProps {
  heading?: string;
  body?: string;
  align?: 'left' | 'center';
}

/** Generic heading + body text block. Covers "Why sell to Cars24?",
 * section titles like "Sell your car in 4 easy steps", etc. — any
 * copy-only block the server wants to insert without a new component. */
export default function TextSection({ heading, body, align = 'left' }: TextSectionProps): React.JSX.Element {
  return (
    <View style={[styles.container, align === 'center' && styles.center]}>
      {heading ? <Text style={[styles.heading, align === 'center' && styles.center]}>{heading}</Text> : null}
      {body ? <Text style={[styles.body, align === 'center' && styles.center]}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 12 },
  center: { alignItems: 'center', textAlign: 'center' },
  heading: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 6 },
  body: { fontSize: 14, color: '#555', lineHeight: 20 },
});
