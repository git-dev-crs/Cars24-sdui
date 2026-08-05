import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface NavTabItem {
  id: string;
  label: string;
}

export interface NavigationProps {
  tabs: NavTabItem[];
  activeTabId?: string;
  onTabPress?: (tabId: string) => void;
}

/** Horizontally-scrollable nav tab bar. `activeTabId` is driven by the
 * screen-level SDUI state bag (see renderer state.activeTab), NOT
 * local component state — that's what lets the "changeTab" action
 * update this purely from JSON-described intent. */
export default function Navigation({ tabs, activeTabId, onTabPress }: NavigationProps): React.JSX.Element {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {tabs.map(tab => {
        const active = tab.id === activeTabId;
        return (
          <TouchableOpacity key={tab.id} style={styles.tab} onPress={() => onTabPress?.(tab.id)}>
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
            {active ? <View style={styles.underline} /> : null}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: { paddingHorizontal: 12, paddingVertical: 14 },
  tabLabel: { color: '#333', fontSize: 14, fontWeight: '500' },
  tabLabelActive: { color: '#3B2FF2', fontWeight: '700' },
  underline: { height: 2, backgroundColor: '#3B2FF2', marginTop: 4 },
});
