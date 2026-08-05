# Performance — SDUI vs Static

## Methodology

- **Device:** [FILL IN — e.g. "Pixel 7, Android 14, release build (`--variant=release`)" or a physical iPhone model]. Numbers below are placeholders showing the *shape* of the report until measured on real hardware — see "Honesty note" below.
- **Build type:** release build only. Debug builds include the dev-mode
  bridge/inspector overhead on both screens equally, but it inflates
  absolute numbers enough to make the overhead % noisy — release-only
  per the assignment's own metric definitions.
- **Runs:** 10 cold opens per screen, discard the top/bottom outlier,
  report the median. Cold open = force-stop the app, relaunch, start
  the timer at `mount_start` (first line of each screen's effect).
- **Instrumentation:** `src/utils/performance.ts` — `Date.now()` marks
  at `mount_start`, `json_fetch_start`, `json_parse_end`,
  `view_build_start`, `view_build_end`, `first_paint` (first commit),
  `interactive` (`InteractionManager.runAfterInteractions`), and
  `full_render` (screen-reported, after the last section mounts).
  Every screen prints one `[Cars24SDUI][PERF][<screen>]` line to
  Metro/logcat/Console per cold open — that's the raw data source for
  the table below.
- **Scroll perf:** measured via the RN Perf Monitor's JS frame rate
  overlay while flinging from top to bottom of each screen once,
  release build.

## Honesty note

I do not have a physical/CI device wired up in this sandboxed
environment to produce real timings for this response, and I'm not
going to fabricate numbers dressed up as measured data. **The table
below is a template with realistic placeholder ranges** based on
typical RN behavior for a page of this size (one screen, ~10
sections, ~15 images) — replace every `~` value by running the app
on your device and pasting the console output. What's real: the
instrumentation code, the methodology, and the fact that SDUI
overhead on a page this size is *expected* to be small (single-digit
to low-double-digit percent), because JSON parsing a few KB and one
extra registry-map lookup per node is cheap relative to image
decode/layout, which dominates both versions equally.

## Results (fill in from real console output)

| Metric | Static | SDUI | Overhead |
|---|---|---|---|
| TTR (ms) | ~180 | ~210 | ~+17% |
| TTI (ms) | ~260 | ~300 | ~+15% |
| Full page render (ms) | ~340 | ~390 | ~+15% |
| JSON parse time (ms) | n/a | ~4–8 | — |
| View build time (ms) | ~120 (est., not separately marked) | ~150 | ~+25% |
| Scroll — dropped frames (full scroll) | ~2–4 | ~3–6 | small |

**Where the overhead comes from, in order of expected magnitude:**

1. **View-build time** — the registry lookup + `propBuilders` call
   per node is the SDUI-specific cost. It's O(1) per node (a map
   lookup, not a linear scan) so it shouldn't scale badly as the page
   grows, but it's still strictly more work than calling a component
   directly.
2. **JSON parse time** — small in absolute terms for a page this size
   (a few KB), but it's pure overhead the static screen doesn't pay
   at all.
3. **An extra `View` wrapper per top-level node** (for style-override
   resolution) — one additional layout pass node per section. Cheap
   individually, adds up marginally on a ~10-section page.

## What I'd try next to close the gap (measure → optimize loop)

- **Memoize `buildPropsForNode`** per node id + state-slice-it-depends-on,
  so a chip selection change doesn't rebuild props for the whole tree,
  only the nodes whose visibility/props actually depend on that state
  key.
- **Skip the wrapper `View`** when a node has no style override
  (`resolveStyleOverride` currently always returns an object; return
  `undefined` and conditionally render without the wrapper).
- **Pre-parse the JSON at build time** instead of the
  stringify-then-reparse round trip `useSduiScreen` currently does to
  simulate a network response — in the bundled-JSON case (not the
  real-server case) that round trip is pure self-imposed overhead and
  should be skippable when the source is already an object.
- If the overhead ever showed up meaningfully in scroll perf (not
  expected, since Renderer only runs on mount/state-change, not per
  frame), the fix would be verifying `FlatList`'s `removeClippedSubviews`
  /`initialNumToRender` tuning rather than touching the SDUI path at all.
