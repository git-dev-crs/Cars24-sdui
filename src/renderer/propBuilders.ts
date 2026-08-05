import type { SDUIComponent } from '../types/sdui';

/**
 * Per-type prop builders.
 *
 * The registry erases prop types to `any` so the renderer can loop
 * over a heterogeneous tree; this file is where that safety comes
 * back. Each builder takes the raw JSON node (+ resolved screen
 * state + action/press callback) and returns the exact typed props
 * the target component expects, filling in interaction wiring
 * (onPress, activeTabId, selectedChipId, etc.) that doesn't belong
 * in the JSON itself.
 *
 * Falling back to `node.props` unchanged for unrecognised types keeps
 * this forward-compatible: a brand-new component type added to the
 * registry works immediately even before a bespoke builder exists for
 * it, as long as its prop names already match the JSON.
 */
export type ScreenState = Record<string, string | number | boolean>;

export interface PropBuilderContext {
  state: ScreenState;
  onAction: (node: SDUIComponent) => void;
  onChildAction: (child: SDUIComponent) => void;
}

export function buildPropsForNode(node: SDUIComponent, ctx: PropBuilderContext): Record<string, unknown> {
  const baseProps = node.props ?? {};

  switch (node.type) {
    case 'header':
      return {
        ...baseProps,
        onSearchPress: () => ctx.onAction(node),
        onLoginPress: () => ctx.onAction(node),
      };

    case 'navigationTabs':
      return {
        ...baseProps,
        tabs: node.children?.map(child => ({ id: child.id, label: (child.props?.label as string) ?? child.id })) ?? baseProps.tabs,
        activeTabId: ctx.state.activeTab,
        onTabPress: (tabId: string) => {
          const child = node.children?.find(c => c.id === tabId);
          ctx.onChildAction(child ?? { ...node, id: tabId, action: { type: 'changeTab', target: tabId } });
        },
      };

    case 'heroBanner':
      return {
        ...baseProps,
        selectedChipId: ctx.state.selectedChip,
        onCtaPress: () => ctx.onAction(node),
        onChipPress: (chipId: string) => {
          const chips = (baseProps.brandChips as Array<{ id: string }>) ?? [];
          const chip = chips.find(c => c.id === chipId);
          ctx.onChildAction({
            id: chipId,
            type: 'chip',
            action: { type: 'updateSelectedChip', target: chipId },
            props: chip,
          });
        },
      };

    case 'imageBanner':
      return {
        ...baseProps,
        onPress: () => ctx.onAction(node),
      };

    case 'grid':
      return {
        ...baseProps,
        items: node.children?.map(child => ({
          id: child.id,
          title: child.props?.title as string,
          imageUrl: child.props?.imageUrl as string,
        })) ?? (baseProps.items as Array<unknown>) ?? [],
        onItemPress: (itemId: string) => {
          const item = node.children?.find(c => c.id === itemId);
          ctx.onChildAction(item ?? { ...node, id: itemId, action: { type: 'navigate', target: itemId } });
        },
      };

    case 'carousel':
    case 'verticalList':
      return {
        ...baseProps,
        items: node.children?.map(child => ({
          id: child.id,
          title: child.props?.title as string,
          subtitle: child.props?.subtitle as string,
          imageUrl: child.props?.imageUrl as string,
        })) ?? (baseProps.items as Array<unknown>) ?? [],
        onItemPress: (itemId: string) => {
          const item = node.children?.find(c => c.id === itemId);
          ctx.onChildAction(item ?? { ...node, id: itemId, action: { type: 'navigate', target: itemId } });
        },
      };

    case 'chip':
      return {
        ...baseProps,
        selected: ctx.state.selectedChip === node.id,
        onPress: () => ctx.onAction(node),
      };

    case 'button':
      return {
        ...baseProps,
        onPress: () => ctx.onAction(node),
      };

    default:
      return baseProps;
  }
}
