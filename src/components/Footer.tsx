import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface FooterLinkGroup {
  id: string;
  heading: string;
  links: string[];
}

export interface FooterProps {
  groups?: FooterLinkGroup[];
  copyright?: string;
}

/** Page footer — link columns + copyright line. Purely presentational;
 * link taps could be wired to `navigate` actions per-link in a future
 * iteration, kept flat here since the assignment doesn't require
 * per-link navigation depth. */
export default function Footer({ groups = [], copyright = '© Cars24. All rights reserved.' }: FooterProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.groups}>
        {groups.map(group => (
          <View key={group.id} style={styles.group}>
            <Text style={styles.groupHeading}>{group.heading}</Text>
            {group.links.map(link => (
              <Text key={link} style={styles.link}>
                {link}
              </Text>
            ))}
          </View>
        ))}
      </View>
      <Text style={styles.copyright}>{copyright}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#111', padding: 20, marginTop: 12 },
  groups: { flexDirection: 'row', flexWrap: 'wrap', gap: 24 },
  group: { minWidth: 140 },
  groupHeading: { color: '#fff', fontWeight: '700', marginBottom: 8 },
  link: { color: '#aaa', marginBottom: 6, fontSize: 13 },
  copyright: { color: '#666', marginTop: 16, fontSize: 12 },
});
