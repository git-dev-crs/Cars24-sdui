import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export interface ImageBannerProps {
  imageUrl?: string;
  title?: string;
  fullWidth?: boolean;
  onPress?: () => void;
}

/** Small promo/CTA tile used in the "What would you like to do?"
 * row (Check valuation / Scrap & earn / Sell your car) and similar
 * single-image-plus-label cards elsewhere on the page. */
export default function ImageBanner({ imageUrl, title, fullWidth = false, onPress }: ImageBannerProps): React.JSX.Element {
  const hasImage = Boolean(imageUrl && imageUrl.trim().length > 0);
  return (
    <Pressable style={[styles.card, fullWidth && styles.fullWidth]} onPress={onPress}>
      {hasImage && <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />}
      <View style={styles.labelRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.arrow}>{'\u2192'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F7',
    marginRight: 12,
  },
  fullWidth: {
    width: '100%',
    marginRight: 0,
  },
  image: { width: '100%', height: 120 },
  labelRow: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontWeight: '700', color: '#111', flex: 1 },
  arrow: { color: '#3B2FF2', fontWeight: '700' },
});
