import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export interface VerticalCardProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
}

/** Row-style card for vertical lists — e.g. the "Why choose Cars24?"
 * benefit rows (icon/image + title + subtitle, stacked). */
export default function VerticalCard({ imageUrl, title, subtitle, onPress }: VerticalCardProps): React.JSX.Element {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" /> : null}
      <View style={styles.textCol}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    marginBottom: 10,
  },
  image: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
  textCol: { flex: 1 },
  title: { fontWeight: '700', color: '#111', fontSize: 14 },
  subtitle: { color: '#777', fontSize: 12, marginTop: 2 },
});
