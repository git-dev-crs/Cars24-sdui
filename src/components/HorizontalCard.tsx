import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export interface HorizontalCardProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
}

/** Card used inside horizontal carousels/rails — e.g. "Sell your car
 * in 4 easy steps" rail, or a future "Recently viewed cars" rail. */
export default function HorizontalCard({ imageUrl, title, subtitle, onPress }: HorizontalCardProps): React.JSX.Element {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" /> : null}
      <View style={styles.body}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 180, marginRight: 12, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F5F5F7' },
  image: { width: '100%', height: 110 },
  body: { padding: 10 },
  title: { fontWeight: '700', color: '#111', fontSize: 13 },
  subtitle: { color: '#777', fontSize: 12, marginTop: 2 },
});
