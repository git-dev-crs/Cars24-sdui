import { useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';
import { getPerformanceTracker } from '../utils/performance';

/**
 * Convenience hook that marks `first_paint`, `interactive`, and
 * `full_render` at the right points in a screen's lifecycle and logs
 * the final report once. Screens call `markFullRender()` themselves
 * once every section has mounted (e.g. after the last FlatList's
 * onLayout fires), since only the screen knows when "all sections
 * rendered" is actually true.
 */
export function usePerformanceTracker(screenName: string) {
  const tracker = getPerformanceTracker(screenName);
  const reported = useRef(false);

  useEffect(() => {
    // first_paint: approximate "above the fold rendered" as the first
    // commit of this screen's render tree.
    tracker.mark('first_paint');

    // interactive: RN's InteractionManager fires once the JS thread is
    // free of queued animations/layout work — a reasonable proxy for
    // "scrollable and tappable" without needing native instrumentation.
    const handle = InteractionManager.runAfterInteractions(() => {
      tracker.mark('interactive');
      if (!reported.current) {
        reported.current = true;
        tracker.report();
      }
    });

    return () => handle.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markFullRender = () => {
    tracker.mark('full_render');
    tracker.report();
  };

  const markViewBuildStart = () => tracker.mark('view_build_start');
  const markViewBuildEnd = () => tracker.mark('view_build_end');

  return { markFullRender, markViewBuildStart, markViewBuildEnd };
}
