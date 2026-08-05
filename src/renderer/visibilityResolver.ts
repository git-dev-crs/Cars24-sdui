import type { SDUIVisibility } from '../types/sdui';

/** Resolves whether a component should render, given the current
 * screen-level state bag. Isolated as a pure function so it's trivial
 * to unit test independent of React. */
export function isVisible(
  visibility: SDUIVisibility | undefined,
  state: Record<string, string | number | boolean>,
): boolean {
  if (!visibility) return true;
  if (visibility.hidden) return false;
  if (visibility.whenStateKey === undefined) return true;
  return state[visibility.whenStateKey] === visibility.equals;
}
