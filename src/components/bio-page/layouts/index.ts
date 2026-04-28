import type { BioPageLayoutProps } from './types';
import { StandardLayout } from './StandardLayout';
import { SuperstarLayout } from './SuperstarLayout';

export type LayoutComponent = React.ComponentType<BioPageLayoutProps>;

const registry: Record<string, LayoutComponent> = {
  standard: StandardLayout,
  superstar: SuperstarLayout,
};

export function getLayout(id?: string): LayoutComponent {
  return registry[id ?? 'standard'] ?? StandardLayout;
}

export type { BioPageLayoutProps };
