import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import VerticalCard, { VerticalCardProps } from './VerticalCard';

export interface VerticalListItem extends VerticalCardProps {
  id: string;
}

export interface VerticalListProps {
  heading?: string;
  items: VerticalListItem[];
  onItemPress?: (itemId: string) => void;
}

/** True vertical FlatList (windowed, recycled) — used for the "Why
 * choose Cars24?" benefits list. Distinct from Grid: Grid wraps a
 * short, fixed set of cards; VerticalList is for a column that could
 * grow arbitrarily long and needs FlatList's virtualization. Nested
 * inside the outer page ScrollView with `scrollEnabled={false}` +
 * `nestedScrollEnabled` so it participates in the page scroll rather
 * than fighting it. */
export default function VerticalList({ heading, items, onItemPress }: VerticalListProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {heading ? <Text style={styles.heading}>{heading}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <VerticalCard
            imageUrl={item.imageUrl}
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => onItemPress?.(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 12 },
  heading: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 10 },
});
