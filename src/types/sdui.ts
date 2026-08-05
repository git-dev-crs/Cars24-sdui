/**
 * Core SDUI schema types.
 *
 * Design goals:
 *  - A single flat `SDUIComponent` shape covers every component type.
 *    The renderer never needs to know the specific component to loop
 *    over the tree — only the registry does.
 *  - `props` is intentionally `Record<string, unknown>` at the schema
 *    level; each component narrows it to its own typed props interface
 *    (see component files) and is responsible for defensive parsing.
 *    This keeps the schema forward-compatible: the server can add new
 *    prop keys for a component without the renderer changing at all.
 *  - `children` allows recursive layout (Grid/Carousel/VerticalList
 *    containers) without inventing a second tree format.
 *  - `visibility` and `style` are resolved by the renderer BEFORE a
 *    component ever sees its props, so components stay dumb.
 */

/** Every action the client currently knows how to execute. New action
 * types can be added by extending this union + registering a handler
 * in `renderer/ActionHandler.ts` — no component code changes needed. */
export type SDUIActionType =
  | 'navigate'
  | 'showToast'
  | 'openBottomSheet'
  | 'changeTab'
  | 'updateSelectedChip'
  | 'noop';

export interface SDUIAction {
  type: SDUIActionType;
  /** navigate: route name. changeTab: tab id. openBottomSheet: sheet id. */
  target?: string;
  /** Free-form payload passed through to the handler (toast message,
   * bottom sheet content id, chip group id, etc). Kept loose on purpose
   * — actions evolve faster than the renderer should need redeploying. */
  payload?: Record<string, unknown>;
}

/** Conditional visibility rule. Kept intentionally tiny (equality only)
 * — this is NOT meant to become a general expression language. If a
 * screen needs real conditional logic, that's a signal for a new
 * component, not a bigger visibility DSL. */
export interface SDUIVisibility {
  /** A key into the screen-level `state` bag (e.g. selected tab id). */
  whenStateKey?: string;
  /** The value `whenStateKey` must equal for this component to render. */
  equals?: string | number | boolean;
  /** Simple flag for "always hide" without deleting the JSON node —
   * useful for staged rollouts / soft-launching a section. */
  hidden?: boolean;
}

/** Style overrides the server can push per-component. Deliberately a
 * whitelist of RN-safe, JSON-serialisable style keys rather than
 * `ViewStyle` directly — arbitrary style injection from a server
 * response is a footgun (typos silently no-op instead of crashing,
 * and it keeps the surface area auditable). */
export interface SDUIStyleOverride {
  marginTop?: number;
  marginBottom?: number;
  marginHorizontal?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  backgroundColor?: string;
  borderRadius?: number;
}

export interface SDUIComponent {
  /** Stable unique id — used as the React key and as the addressable
   * target for actions/state updates (e.g. which chip is selected). */
  id: string;
  /** Registry lookup key. Unrecognised types render <UnknownComponent>
   * instead of throwing — see registry/componentRegistry.tsx. */
  type: string;
  /** Component-specific, loosely-typed payload. */
  props?: Record<string, unknown>;
  /** Optional tap/press action, interpreted by ActionHandler. */
  action?: SDUIAction;
  /** Optional conditional-rendering rule. */
  visibility?: SDUIVisibility;
  /** Optional per-component style overrides. */
  style?: SDUIStyleOverride;
  /** Nested components — used by container-like types (grid, carousel,
   * verticalList, navigationTabs). Leaf components omit this. */
  children?: SDUIComponent[];
}

/** Top-level screen payload — this is the literal JSON the "server"
 * (a local file in this assignment) returns for a screen. */
export interface SDUIScreen {
  /** Schema version. See README "Versioning Strategy" — old clients
   * ignore fields/component types they don't understand rather than
   * gating on this, but it's kept for telemetry + future breaking
   * changes to the envelope itself. */
  version: string;
  /** Screen identifier, also used as an analytics/perf tag. */
  screen: string;
  /** Optional initial values for the screen-level state bag that
   * `visibility.whenStateKey` and tab/chip actions read and write
   * (e.g. { "activeTab": "sell" }). */
  initialState?: Record<string, string | number | boolean>;
  components: SDUIComponent[];
}
