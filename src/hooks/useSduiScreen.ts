import { useEffect, useMemo, useState } from 'react';
import type { SDUIScreen } from '../types/sdui';
import { getPerformanceTracker } from '../utils/performance';
import { logger } from '../utils/logger';

/**
 * Loads and parses an SDUI screen payload, timing the fetch + parse
 * phases separately so PERF.md can report "JSON fetch/parse time vs
 * view-build time" as required.
 *
 * `source` is a thunk returning the raw JSON string rather than an
 * already-parsed object — that's what lets us honestly measure
 * JSON.parse() time. In this assignment the "server" is a bundled
 * JSON file (require'd as a module, so it's pre-parsed by Metro); to
 * still get a meaningful parse-time measurement we re-stringify +
 * re-parse it once, simulating a real network response. Swapping in
 * `fetch('https://.../sell.json').then(r => r.text())` here is the
 * only change needed to point this at a real server — nothing else
 * in the SDUI pipeline changes.
 */
export function useSduiScreen(source: () => object, screenName: string) {
  const [screen, setScreen] = useState<SDUIScreen | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const tracker = useMemo(() => getPerformanceTracker(screenName), [screenName]);

  useEffect(() => {
    let cancelled = false;
    tracker.mark('mount_start');
    tracker.mark('json_fetch_start');

    try {
      const raw = JSON.stringify(source());
      // Yield to simulate the async boundary a real fetch() would have,
      // without adding artificial latency to the measurement.
      Promise.resolve().then(() => {
        if (cancelled) return;
        const parsed = JSON.parse(raw) as SDUIScreen;
        tracker.mark('json_parse_end');
        setScreen(parsed);
      });
    } catch (e) {
      setError(e as Error);
      logger.warn('Failed to load SDUI screen', e);
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenName]);

  return { screen, error, tracker };
}
