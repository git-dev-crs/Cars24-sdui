import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SDUIComponent } from '../types/sdui';
import type { RootStackParamList } from '../types/navigation';
import { componentRegistry, isRegisteredComponentType } from '../registry/componentRegistry';
import UnknownComponent from '../components/UnknownComponent';
import { executeAction } from './ActionHandler';
import { isVisible } from './visibilityResolver';
import { resolveStyleOverride } from './styleResolver';
import { buildPropsForNode, ScreenState } from './propBuilders';
import { logger } from '../utils/logger';

export interface RendererProps {
  /** Flat list of top-level components for this screen (from
   * SDUIScreen.components). */
  components: SDUIComponent[];
  /** Current screen-level state bag (active tab, selected chip, etc). */
  state: ScreenState;
  /** Setter for the state bag — passed down so actions triggered deep
   * in the tree (a chip inside heroBanner) can still update it. */
  setState: React.Dispatch<React.SetStateAction<ScreenState>>;
  /** Called for actions the renderer doesn't fully own, e.g. opening
   * a bottom sheet — screens decide how a sheet actually renders. */
  onOpenBottomSheet?: (sheetId: string, payload?: Record<string, unknown>) => void;
}

/**
 * Renderer — walks a flat JSON component tree and mounts the matching
 * registered component for each node.
 *
 * Responsibilities, deliberately kept separate from any one
 * component's concerns:
 *   1. Registry lookup (type -> Component), with a graceful
 *      <UnknownComponent /> fallback instead of throwing.
 *   2. Visibility resolution against screen state — components never
 *      see a `visibility` prop; they either mount or they don't.
 *   3. Style override merging.
 *   4. Action wiring via ActionHandler, so components stay pure
 *      "here are my props, call onPress" — never importing navigation
 *      or Alert themselves.
 *
 * This is intentionally NOT recursive-by-default for its own root
 * call: top-level sections are rendered as a flat vertical stack
 * (that's what "a page" is). Components that need nested SDUI
 * children (carousel items, grid cells, nav tabs) receive those
 * children pre-resolved via `propBuilders`, not by Renderer
 * recursing into arbitrary unknown nesting — this keeps the render
 * loop O(sections) instead of an unbounded tree walk, which matters
 * for the TTI/view-build-time numbers in PERF.md.
 */
export default function Renderer({ components, state, setState, onOpenBottomSheet }: RendererProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleAction = (node: SDUIComponent) => {
    executeAction(node.action, {
      navigate: (routeName, params) => (navigation.navigate as unknown as (name: string, p?: unknown) => void)(routeName, params),
      setState,
      openBottomSheet: (sheetId, payload) => {
        logger.info(`openBottomSheet -> ${sheetId}`, payload);
        onOpenBottomSheet?.(sheetId, payload);
      },
    });
  };

  const visibleComponents = useMemo(
    () => components.filter(node => isVisible(node.visibility, state)),
    [components, state],
  );

  return (
    <>
      {visibleComponents.map(node => {
        const Component = isRegisteredComponentType(node.type) ? componentRegistry[node.type] : null;
        const resolvedStyle = resolveStyleOverride(node.style);

        if (!Component) {
          logger.warn(`Unknown component type "${node.type}" (id: ${node.id}) — rendering fallback`);
          return (
            <View key={node.id} style={resolvedStyle}>
              <UnknownComponent type={node.type} />
            </View>
          );
        }

        const props = buildPropsForNode(node, {
          state,
          onAction: handleAction,
          onChildAction: handleAction,
        });

        return (
          <View key={node.id} style={resolvedStyle}>
            <Component {...props} />
          </View>
        );
      })}
    </>
  );
}
