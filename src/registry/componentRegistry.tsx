import React from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import HeroBanner from '../components/HeroBanner';
import ImageBanner from '../components/ImageBanner';
import TextSection from '../components/TextSection';
import Carousel from '../components/Carousel';
import Grid from '../components/Grid';
import VerticalList from '../components/VerticalList';
import Chip from '../components/Chip';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Footer from '../components/Footer';

/**
 * Component registry — the single map from a JSON `type` string to
 * the React component that renders it.
 *
 * This is the ONLY file the Renderer imports components through.
 * Adding a new component to the SDUI system means:
 *   1. Build the component (props-only, no screen-specific logic).
 *   2. Add one line here.
 * The renderer, screens, and JSON schema never need to change.
 *
 * `React.ComponentType<any>` is intentional: every component has its
 * own distinct props interface, and the registry's whole job is to
 * erase that at the boundary so Renderer.tsx can loop over
 * heterogeneous component types with one code path. Renderer.tsx is
 * the single place that re-establishes safety, via the per-type prop
 * builders in `renderer/propBuilders.ts`.
 */
export const componentRegistry: Record<string, React.ComponentType<any>> = {
  header: Header,
  navigationTabs: Navigation,
  heroBanner: HeroBanner,
  imageBanner: ImageBanner,
  textSection: TextSection,
  carousel: Carousel,
  grid: Grid,
  verticalList: VerticalList,
  chip: Chip,
  button: Button,
  input: InputField,
  footer: Footer,
};

export type RegisteredComponentType = keyof typeof componentRegistry;

export function isRegisteredComponentType(type: string): type is RegisteredComponentType {
  return Object.prototype.hasOwnProperty.call(componentRegistry, type);
}
