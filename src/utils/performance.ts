/**
 * Performance measurement utilities.
 *
 * These are intentionally dependency-free (no third-party perf lib)
 * so the SDUI vs Static comparison in PERF.md is measuring the app,
 * not a profiling library's own overhead.
 *
 * Metrics captured, matching the assignment's definitions:
 *  - TTR   (Time To Render)      : mount start -> first above-the-fold paint
 *  - TTI   (Time To Interactive) : mount start -> screen scrollable/tappable
 *  - Full page time              : mount start -> all sections rendered
 *  - JSON parse time             : JSON.parse() duration (SDUI only)
 *  - View build time             : component-tree construction duration
 */

export type PerfMarkName =
  | 'mount_start'
  | 'json_fetch_start'
  | 'json_fetch_end'
  | 'json_parse_end'
  | 'view_build_start'
  | 'view_build_end'
  | 'first_paint' // above-the-fold, TTR
  | 'interactive' // TTI
  | 'full_render'; // all sections mounted

export interface PerfSummary {
  screen: string;
  jsonParseTimeMs: number | null;
  viewBuildTimeMs: number | null;
  ttrMs: number | null;
  ttiMs: number | null;
  fullPageTimeMs: number | null;
}

class PerformanceTracker {
  private marks = new Map<string, number>();
  private screenName: string;

  constructor(screenName: string) {
    this.screenName = screenName;
  }

  mark(name: PerfMarkName): void {
    this.marks.set(name, Date.now());
  }

  private diff(from: PerfMarkName, to: PerfMarkName): number | null {
    const a = this.marks.get(from);
    const b = this.marks.get(to);
    if (a === undefined || b === undefined) return null;
    return b - a;
  }

  /** Prints a full summary table to the console once the screen is
   * considered fully rendered. Safe to call multiple times — later
   * marks (e.g. `interactive` firing after first log) simply reprint. */
  report(): PerfSummary {
    const summary: PerfSummary = {
      screen: this.screenName,
      jsonParseTimeMs: this.diff('json_fetch_start', 'json_parse_end'),
      viewBuildTimeMs: this.diff('view_build_start', 'view_build_end'),
      ttrMs: this.diff('mount_start', 'first_paint'),
      ttiMs: this.diff('mount_start', 'interactive'),
      fullPageTimeMs: this.diff('mount_start', 'full_render'),
    };
    // eslint-disable-next-line no-console
    console.log(`[Cars24SDUI][PERF][${this.screenName}]`, summary);
    return summary;
  }
}

const trackers = new Map<string, PerformanceTracker>();

/** Returns a per-screen singleton tracker so multiple hooks/components
 * on the same screen (header perf hook, list perf hook, etc.) all
 * write into one timeline instead of racing separate trackers. */
export function getPerformanceTracker(screenName: string): PerformanceTracker {
  let tracker = trackers.get(screenName);
  if (!tracker) {
    tracker = new PerformanceTracker(screenName);
    trackers.set(screenName, tracker);
  }
  return tracker;
}
