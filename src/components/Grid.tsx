import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ImageBanner from './ImageBanner';

export interface GridItem {
  id: string;
  title?: string;
  imageUrl?: string;
}

export interface GridProps {
  heading?: string;
  columns?: number;
  items: GridItem[];
  onItemPress?: (itemId: string) => void;
}

/** Wrapping card grid — used for the Sell / Buy / Finance / Scrap
 * card set. Uses flexWrap rather than FlatList's numColumns because
 * this grid is short and lives inside a larger scrolling page (a
 * FlatList can't be nested inside another scroll view without perf
 * issues); the vertical list section below uses FlatList properly
 * since it can be arbitrarily long. */
export default function Grid({ heading, columns = 3, items, onItemPress }: GridProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {heading ? <Text style={styles.heading}>{heading}</Text> : null}
      <View style={styles.grid}>
        {items.map(item => (
          <View key={item.id} style={[styles.cell, { flexBasis: columns === 3 ? '30%' : columns === 2 ? '47%' : '100%' }]}>
            <ImageBanner imageUrl={item.imageUrl} title={item.title} fullWidth onPress={() => onItemPress?.(item.id)} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 12 },
  heading: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  cell: { flexGrow: 1 },
});
