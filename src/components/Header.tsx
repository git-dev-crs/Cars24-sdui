import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export interface HeaderProps {
  logoText?: string;
  logoImageUrl?: string;
  searchPlaceholder?: string;
  loginLabel?: string;
  onSearchPress?: () => void;
  onLoginPress?: () => void;
}

/** Top app bar: logo, search field, login CTA. Pure presentational —
 * all interaction is delegated via props so it stays action-agnostic
 * (SDUI actions are wired in by the renderer, not hardcoded here). */
export default function Header({
  logoText = 'Cars24',
  logoImageUrl,
  searchPlaceholder = 'Search',
  loginLabel = 'Login',
  onSearchPress,
  onLoginPress,
}: HeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        {logoImageUrl ? (
          <Image source={{ uri: logoImageUrl }} style={styles.logoImage} resizeMode="contain" />
        ) : null}
        <Text style={styles.logoText}>{logoText}</Text>
      </View>

      <Pressable style={styles.searchBar} onPress={onSearchPress}>
        <Text style={styles.searchPlaceholder}>{searchPlaceholder}</Text>
      </Pressable>

      <Pressable style={styles.loginButton} onPress={onLoginPress}>
        <Text style={styles.loginText}>{loginLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3B2FF2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 24, height: 24, marginRight: 6 },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  searchBar: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  searchPlaceholder: { color: 'rgba(255,255,255,0.8)' },
  loginButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  loginText: { color: '#3B2FF2', fontWeight: '700' },
});
