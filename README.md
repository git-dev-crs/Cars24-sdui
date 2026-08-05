# Cars24 SDUI Assignment — Sell Car Landing Page

React Native (TypeScript, no Expo) implementation of a Server-Driven
UI system, demonstrated on the Cars24 **"Sell your car"** landing
page (`cars24.com/sell-used-cars`).

## Why this screen

The Sell Car page was chosen over the plain home page because it
clears the complexity bar with headroom and forces harder schema
decisions than a pure content page would:

- **Form + input state** (plate number field) living inside a
  server-described component, not just static content.
- **Multi-select-adjacent interaction** (brand chips) that needs
  screen-level state, not local component state — this is what
  actually stress-tests the `action` + `visibility` design.
- A genuine mix of section shapes in one page: hero-with-embedded-form,
  a wrapping card grid, a virtualized vertical list, and a horizontal
  carousel — all present on this one screen (see screenshots in the
  assignment upload), so the registry has to earn its generality on
  one screen instead of hand-waving "it'll generalize."

## Architecture

```
App.tsx
└── RootNavigator (React Navigation stack)
    └── SduiHomeScreen              — loads JSON, owns screen state
        └── Renderer                — walks the JSON tree
            ├── componentRegistry   — type string -> React component
            ├── propBuilders        — JSON node -> typed component props
            ├── ActionHandler       — executes `action` payloads
            ├── visibilityResolver  — evaluates `visibility` rules
            └── styleResolver       — merges `style` overrides
    └── StaticHomeScreen            — same page, fully hardcoded (Part 2 baseline)
```

**Data flow for one component:** JSON node → `Renderer` checks
`visibility` against screen state → looks up `type` in
`componentRegistry` (or falls back to `UnknownComponent`) →
`propBuilders` turns the raw JSON `props` + node `action` into the
exact typed props that component expects, wiring `onPress` etc. to
`ActionHandler` → component mounts as a dumb, JSON-agnostic React
component.

### Why components never see the JSON directly

Every component in `src/components/` takes ordinary, fully-typed
props (`HeaderProps`, `HeroBannerProps`, ...) and has **zero
knowledge that SDUI exists**. `Header` doesn't know what `action` or
`visibility` mean. This is the load-bearing decision in this
codebase: it's what makes `StaticHomeScreen.tsx` possible as a
one-file hardcoded screen that reuses the exact same components as
the SDUI path, which in turn is what makes the Part 2 performance
comparison actually measure the SDUI *indirection* rather than two
unrelated implementations.

### Component registry

`src/registry/componentRegistry.tsx` is a flat `Record<string,
ComponentType>`. Adding a component to the system is: build it (props
only), add one line to the registry. Nothing else changes — not the
renderer, not the screens, not the JSON schema.

### Renderer

`src/renderer/Renderer.tsx` renders the **top-level** `components`
array as a flat vertical stack (that's what a page is). Container
types (`carousel`, `grid`, `verticalList`, `navigationTabs`) receive
their `children` pre-resolved into typed item props via
`propBuilders`, rather than the Renderer recursively re-entering
itself for arbitrary nesting depth. This was a deliberate trade-off
— see "Trade-offs" below.

### Unknown component handling

`sellCarScreen.json` includes a node with `"type": "MusicPlayer"` on
purpose. `Renderer` checks `isRegisteredComponentType()`; on a miss it
logs a warning and renders `<UnknownComponent />` instead of
throwing. The page keeps rendering everything below and above it
normally — this is demoed in the screen recording.

## Schema design

See `src/types/sdui.ts` for the full annotated schema. Key choices:

- **Flat node shape for every component** (`id`, `type`, `props`,
  `action`, `visibility`, `style`, `children`) — one schema for
  header, hero, grid, chip, everything. A second screen is a second
  JSON file with the same shape, not a new schema.
- **`props: Record<string, unknown>`** at the schema level, narrowed
  per-component in `propBuilders.ts`. New prop keys for an existing
  component type never require a renderer change.
- **`style` is a whitelist**, not a raw `ViewStyle` passthrough.
  Arbitrary style injection from a server payload is a real
  footgun (a typo'd key should be inert, not silently accepted as
  some other DOM/RN behavior); the whitelist keeps the surface
  auditable.
- **`visibility` is equality-only**, deliberately not a full
  expression language. If a screen needs real branching logic,
  that's a signal to add a new component type, not grow this into a
  server-side scripting DSL.

## Actions

Supported today: `navigate`, `showToast`, `openBottomSheet`,
`changeTab`, `updateSelectedChip`. All live in
`src/renderer/ActionHandler.ts` behind an exhaustive `switch` over
`SDUIActionType` — adding a new action type without a handler case is
a **TypeScript compile error**, which is the actual enforcement
mechanism behind "do not hardcode click listeners."

## Versioning strategy

No app-side gating on `version` is implemented (out of scope for the
timebox), but the design already tolerates version skew for free:

- **Old app, new server JSON with a new component type** → renders as
  `UnknownComponent`, page stays intact. This is the common case and
  it's handled today, not just documented.
- **Old app, new server JSON with new prop keys on a known
  component** → ignored by that component's destructuring, no crash.
- **New app, old server JSON missing a newer prop** → component
  default props apply (every component ships sane defaults).
- **Breaking schema change** (e.g. `children` becomes required where
  it wasn't) → this is the one case that needs real gating. The
  `version` field exists for exactly this: the server can branch
  the payload it sends by client-reported app version/schema version,
  the same way most SDUI systems at scale (Airbnb, Lyft) do it. Not
  implemented here — a bonus item, not a baseline one.

## Trade-offs (given the 8–10 hour target)

- **No native bottom sheet** — `openBottomSheet` action is wired
  through to a screen-level callback and logs/no-ops rather than
  mounting a real sheet component. Swapping in
  `@gorhom/bottom-sheet` is additive, not a redesign.
- **Renderer doesn't recurse arbitrarily** — container components
  resolve their own children via `propBuilders` rather than the
  Renderer walking an unbounded tree. This caps how deeply "custom"
  a container's internal layout can get from JSON alone; a
  genuinely novel nested-container shape needs a new component, not
  just new JSON. Documented honestly in `COVERAGE.md`.
- **Chip selection is single-select, screen-scoped** (`state.selectedChip`).
  Multi-select would need an array in state — small change, not built,
  since the reference screen only ever shows one selected brand.
- **No real network layer** — JSON is bundled as a local module
  (`src/json/sellCarScreen.json`) rather than fetched. `useSduiScreen`
  is written so the only change needed for a real server is replacing
  the `source()` thunk with a `fetch(...).then(r => r.text())` call —
  see the comment in that file.

## How to run

```bash
npm install
# iOS
npx pod-install ios
npm run ios
# Android
npm run android
```

Toggle between the SDUI screen and the static benchmark screen by
navigating to the `StaticHome` route (wired in `RootNavigator.tsx`)
— e.g. temporarily set `initialRouteName="StaticHome"`, or add a dev
button; kept as a manual navigator edit rather than a persistent UI
toggle to avoid shipping a "mode switch" as if it were a real product
surface.

See `PERF.md`, `COVERAGE.md`, and `AI_WORKFLOW.md` for the remaining
required documentation.
