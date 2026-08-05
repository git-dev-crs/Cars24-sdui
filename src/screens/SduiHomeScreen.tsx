import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Renderer from '../renderer/Renderer';
import { useSduiScreen } from '../hooks/useSduiScreen';
import { usePerformanceTracker } from '../hooks/usePerformanceTracker';
import sellCarScreenJson from '../json/sellCarScreen.json';
import type { ScreenState } from '../renderer/propBuilders';

/**
 * SDUI screen — the "real" implementation. This component contains
 * ZERO layout/business logic for the Cars24 page itself; it only:
 *   1. Loads the JSON payload (useSduiScreen).
 *   2. Owns the screen-level state bag (active tab, selected chip).
 *   3. Hands both to <Renderer />.
 *
 * Compare to StaticHomeScreen.tsx, which hardcodes the identical page
 * — that pairing is what PERF.md's overhead-% comparison measures.
 */
export default function SduiHomeScreen(): React.JSX.Element {
  const { screen, error } = useSduiScreen(() => sellCarScreenJson, 'sdui_sell');
  const { markFullRender, markViewBuildStart, markViewBuildEnd } = usePerformanceTracker('sdui_sell');
  const [state, setState] = useState<ScreenState>({});

  useEffect(() => {
    if (screen?.initialState) setState(screen.initialState);
  }, [screen]);

  useEffect(() => {
    if (screen) {
      markViewBuildStart();
      // view-build is synchronous React reconciliation triggered by
      // this state update; end-mark on next tick once committed.
      const id = setTimeout(() => {
        markViewBuildEnd();
        markFullRender();
      }, 0);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <View />
      </SafeAreaView>
    );
  }

  if (!screen) {
    // Intentionally blank rather than a spinner: TTR is measured from
    // mount_start, and a spinner frame would itself be a paint event
    // worth excluding from "above the fold content rendered".
    return <SafeAreaView style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Renderer components={screen.components} state={state} setState={setState} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
