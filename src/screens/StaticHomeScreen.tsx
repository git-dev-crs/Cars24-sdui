import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import HeroBanner from '../components/HeroBanner';
import TextSection from '../components/TextSection';
import Grid from '../components/Grid';
import VerticalList from '../components/VerticalList';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import { usePerformanceTracker } from '../hooks/usePerformanceTracker';

/**
 * Static (hardcoded) rebuild of the exact same Sell Car page, using
 * the SAME shared component primitives as the SDUI version — that's
 * deliberate. The point of Part 2 isn't "compiled React vs JSON
 * interpreter" in the abstract, it's "does the SDUI *indirection*
 * (registry lookup, prop building, visibility/style resolution) cost
 * anything measurable over calling the same components directly."
 * If this screen used different/simpler components, the comparison
 * would be measuring the wrong thing.
 *
 * All copy/data below is inlined instead of loaded from JSON —
 * that's the entire difference from SduiHomeScreen.tsx.
 */
export default function StaticHomeScreen(): React.JSX.Element {
  const { markFullRender, markViewBuildStart, markViewBuildEnd } = usePerformanceTracker('static_sell');
  const [activeTab, setActiveTab] = useState('sell');
  const [selectedChip, setSelectedChip] = useState('');

  markViewBuildStart();

  const content = (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onLayout={() => {
          markViewBuildEnd();
          markFullRender();
        }}
      >
        <Header logoText="Cars24" searchPlaceholder="Search" loginLabel="Login" />

        <Navigation
          tabs={[
            { id: 'home', label: 'Home' },
            { id: 'buy', label: 'Buy used car' },
            { id: 'sell', label: 'Sell car' },
            { id: 'loans', label: 'Loans' },
            { id: 'insurance', label: 'Insurance' },
          ]}
          activeTabId={activeTab}
          onTabPress={setActiveTab}
        />

        <HeroBanner
          title="Sell your car at the BEST PRICE in minutes"
          subtitle="India's no.1 selling platform"
          inputPlaceholder="DL 03 AB XXXX"
          ctaLabel="Get instant car price"
          brandChips={[
            { id: 'maruti', label: 'Maruti Suzuki' },
            { id: 'hyundai', label: 'Hyundai' },
            { id: 'mahindra', label: 'Mahindra' },
            { id: 'tata', label: 'Tata' },
          ]}
          selectedChipId={selectedChip}
          onChipPress={setSelectedChip}
        />

        <TextSection
          heading="Why sell car to Cars24?"
          body="When you decide to sell your car, you shouldn't have to choose between a great price and a seamless experience. Cars24 removes the low-ball offers, endless phone calls, and paperwork anxiety."
        />

        <TextSection heading="What would you like to do?" />
        <Grid
          items={[
            { id: 'check_valuation', title: 'Check car valuation', imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400' },
            { id: 'scrap_earn', title: 'Scrap & earn', imageUrl: 'https://images.unsplash.com/photo-1621977147029-6d1e29b0e6e0?w=400' },
            { id: 'sell_your_car', title: 'Sell your car', imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400' },
          ]}
        />

        <TextSection heading="Why choose Cars24?" />
        <VerticalList
          items={[
            { id: 'best_price', title: 'We give best price guarantee', subtitle: '1500+ dealers will bid on your car', imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200' },
            { id: 'we_take_care', title: 'We take care of everything', subtitle: 'RC transfer + Paperwork', imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200' },
            { id: 'same_day', title: 'Same day payment & pickup', subtitle: 'Instant payout + Zero waiting', imageUrl: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=200' },
          ]}
        />

        <TextSection heading="Sell your car in 4 easy steps" body="It's fast, reliable and hassle free." />
        <Carousel
          items={[
            { id: 'step_1', title: 'Get instant price', subtitle: 'Enter your plate number', imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=300' },
            { id: 'step_2', title: 'Car inspection', subtitle: 'Free doorstep check', imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300' },
            { id: 'step_3', title: 'Get best bid', subtitle: '1500+ dealers bid live', imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=300' },
            { id: 'step_4', title: 'Get paid', subtitle: 'Instant payment & pickup', imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=300' },
          ]}
        />

        <Footer
          groups={[
            { id: 'company', heading: 'Company', links: ['About us', 'Careers', 'Contact'] },
            { id: 'products', heading: 'Products', links: ['Buy car', 'Sell car', 'Car loan', 'Insurance'] },
            { id: 'legal', heading: 'Legal', links: ['Terms', 'Privacy Policy'] },
          ]}
          copyright="© 2026 Cars24. All rights reserved."
        />
      </ScrollView>
    </SafeAreaView>
  );

  return content;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
