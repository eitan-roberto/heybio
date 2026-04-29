'use client';

import * as clean from './clean';
import * as soft from './soft';
import * as dark from './dark';
import * as warm from './warm';
import * as minimal from './minimal';
import * as gradient from './gradient';
import * as ocean from './ocean';
import * as sunset from './sunset';
import * as forest from './forest';
import * as midnight from './midnight';
import * as superstar from './superstar';
import type { ComponentType } from 'react';
import type { ThemeSpec, ThemeLayoutProps, ThemeMiniatureProps } from './types';

export type { ThemeSpec, ThemeLayoutProps, ThemeMiniatureProps };

const definitions = [
  clean, soft, dark, warm, minimal,
  gradient, ocean, sunset, forest, midnight, superstar,
] as const;

const registry = Object.fromEntries(definitions.map((d) => [d.meta.id, d]));

export interface Theme {
  id: string;
  name: string;
  isPro: boolean;
  hasCustomLayout?: boolean;
  colors: ThemeSpec['colors'];
  fonts: ThemeSpec['fonts'];
  borderRadius: ThemeSpec['borderRadius'];
  style: ThemeSpec['style'];
}

function flatten(d: (typeof definitions)[number]): Theme {
  return {
    id: d.meta.id,
    name: d.meta.name,
    isPro: d.meta.isPro,
    hasCustomLayout: (d.meta as { hasCustomLayout?: boolean }).hasCustomLayout,
    ...d.meta.spec,
  };
}

export function getTheme(id: string): Theme {
  return flatten((registry[id] ?? registry.clean) as (typeof definitions)[number]);
}

export function getLayout(id: string): ComponentType<ThemeLayoutProps> {
  return ((registry[id] ?? registry.clean) as (typeof definitions)[number]).Layout;
}

export function getMiniature(id: string): ComponentType<ThemeMiniatureProps> {
  return ((registry[id] ?? registry.clean) as (typeof definitions)[number]).Miniature;
}

export const allThemes: Theme[] = definitions.map(flatten);
export const freeThemes: Theme[] = allThemes.filter((t) => !t.isPro);
export const proThemes: Theme[] = allThemes.filter((t) => t.isPro);
export const DEFAULT_THEME_ID: string = freeThemes[0].id;
