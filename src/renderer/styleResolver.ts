import type { SDUIStyleOverride } from '../types/sdui';
import type { ViewStyle } from 'react-native';

/** Maps the whitelisted SDUI style override keys onto a real RN
 * ViewStyle. A thin passthrough today, but centralising it means a
 * future rename (e.g. server sends `bgColor` for legacy app versions)
 * is a one-line change here instead of touching every component. */
export function resolveStyleOverride(style: SDUIStyleOverride | undefined): ViewStyle {
  if (!style) return {};
  return {
    marginTop: style.marginTop,
    marginBottom: style.marginBottom,
    marginHorizontal: style.marginHorizontal,
    paddingHorizontal: style.paddingHorizontal,
    paddingVertical: style.paddingVertical,
    backgroundColor: style.backgroundColor,
    borderRadius: style.borderRadius,
  };
}
