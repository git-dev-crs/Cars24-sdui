import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import HorizontalCard, { HorizontalCardProps } from './HorizontalCard';

export interface CarouselItem extends HorizontalCardProps {
  id: string;
}

export interface CarouselProps {
  heading?: string;
  items: CarouselItem[];
  onItemPress?: (itemId: string) => void;
}

/** Horizontal scrolling rail, backed by FlatList (not ScrollView) so
 * it stays performant with larger item counts and windows/recycles
 * off-screen cards — matters for the perf comparison in PERF.md. */
export default function Carousel({ heading, items, onItemPress }: CarouselProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {heading ? <Text style={styles.heading}>{heading}</Text> : null}
      <FlatList
        horizontal
        data={items}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <HorizontalCard
            imageUrl={item.imageUrl}
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => onItemPress?.(item.id)}
          />
        )}
        removeClippedSubviews
        initialNumToRender={4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 12 },
  heading: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 10, paddingHorizontal: 16 },
  listContent: { paddingHorizontal: 16 },
});
