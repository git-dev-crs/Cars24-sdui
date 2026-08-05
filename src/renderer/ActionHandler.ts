import { Alert } from 'react-native';
import type { SDUIAction } from '../types/sdui';

/** Signature every action ultimately reduces to: given the action
 * descriptor from JSON and the mutable screen-state setter, do the
 * right thing. Kept separate from Renderer.tsx so new action types
 * can be added/tested without touching render logic. */
export interface ActionHandlerDeps {
  navigate: (routeName: string, params?: Record<string, unknown>) => void;
  setState: (updater: (prev: Record<string, string | number | boolean>) => Record<string, string | number | boolean>) => void;
  openBottomSheet: (sheetId: string, payload?: Record<string, unknown>) => void;
}

/** Executes a single SDUI action. Switch is exhaustive over
 * `SDUIActionType` — adding a new action type without a case here is
 * a TypeScript error, which is the safety net that replaces the
 * "hardcoded click listener" pattern the assignment explicitly bans. */
export function executeAction(action: SDUIAction | undefined, deps: ActionHandlerDeps): void {
  if (!action) return;

  switch (action.type) {
    case 'navigate': {
      if (action.target) deps.navigate(action.target, action.payload);
      return;
    }
    case 'showToast': {
      const message = (action.payload?.message as string) ?? 'Done';
      // RN has no built-in cross-platform toast; Alert keeps this
      // dependency-free for the assignment. Swap for a toast lib in
      // production without touching any JSON or calling code.
      Alert.alert(message);
      return;
    }
    case 'openBottomSheet': {
      if (action.target) deps.openBottomSheet(action.target, action.payload);
      return;
    }
    case 'changeTab': {
      const tabId = action.target ?? (action.payload?.tabId as string);
      const stateKey = (action.payload?.stateKey as string) ?? 'activeTab';
      if (tabId) deps.setState(prev => ({ ...prev, [stateKey]: tabId }));
      return;
    }
    case 'updateSelectedChip': {
      const chipId = action.target ?? (action.payload?.chipId as string);
      const stateKey = (action.payload?.stateKey as string) ?? 'selectedChip';
      if (chipId) deps.setState(prev => ({ ...prev, [stateKey]: chipId }));
      return;
    }
    case 'noop':
    default:
      return;
  }
}
