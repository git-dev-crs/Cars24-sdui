import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import InputField from './InputField';
import Button from './Button';
import Chip from './Chip';

export interface HeroBrandChip {
  id: string;
  label: string;
}

export interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  inputPlaceholder?: string;
  ctaLabel?: string;
  brandChips?: HeroBrandChip[];
  selectedChipId?: string;
  onCtaPress?: () => void;
  onChipPress?: (chipId: string) => void;
}

/** Large hero section combining title/subtitle copy with the "Sell
 * Car" form (plate number input, CTA, brand chips). Kept as one
 * component (rather than composing Hero + Form separately) because
 * the assignment's reference screen renders them as a single visual
 * card over the banner image — splitting them would fight the JSON
 * schema's `children` model for no real reuse benefit. */
export default function HeroBanner({
  title = "Sell your car at the BEST PRICE in minutes",
  subtitle = "India's no.1 selling platform",
  imageUrl,
  inputPlaceholder = 'DL 03 AB XXXX',
  ctaLabel = 'Get instant car price',
  brandChips = [],
  selectedChipId,
  onCtaPress,
  onChipPress,
}: HeroBannerProps): React.JSX.Element {
  return (
    <ImageBackground source={imageUrl ? { uri: imageUrl } : undefined} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formLabel}>Enter your car plate number</Text>
          <InputField placeholder={inputPlaceholder} />
          <Button label={ctaLabel} onPress={onCtaPress} variant="primary" fullWidth />
          <Text style={styles.orText}>OR</Text>
          <Text style={styles.formLabel}>Select your brand</Text>
          <View style={styles.chipRow}>
            {brandChips.map(chip => (
              <Chip
                key={chip.id}
                label={chip.label}
                selected={chip.id === selectedChipId}
                onPress={() => onChipPress?.(chip.id)}
              />
            ))}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { backgroundColor: '#3B2FF2', paddingBottom: 24 },
  overlay: { padding: 20 },
  copy: { marginBottom: 20, maxWidth: '70%' },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', lineHeight: 34 },
  subtitle: { color: 'rgba(255,255,255,0.85)', marginTop: 8, fontSize: 14 },
  formCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  formLabel: { color: '#333', fontWeight: '600', marginBottom: 8 },
  orText: { textAlign: 'center', color: '#999', marginVertical: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
