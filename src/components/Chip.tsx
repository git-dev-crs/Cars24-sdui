import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

/** Selectable pill used for brand filters, tags, etc. Selection state
 * is fully controlled from outside (via SDUI "updateSelectedChip"
 * action + screen state) so the same JSON works whether one chip or
 * many can be active at once — that logic lives in the renderer. */
export default function Chip({ label, selected = false, onPress }: ChipProps): React.JSX.Element {
  return (
    <Pressable style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  chipSelected: { borderColor: '#3B2FF2', backgroundColor: '#EEF0FF' },
  label: { color: '#333', fontSize: 13, fontWeight: '600' },
  labelSelected: { color: '#3B2FF2' },
});
