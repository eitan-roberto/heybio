'use client';
import { createStandardLayout, createStandardMiniature } from './_standard';
import type { ThemeSpec } from './types';

const spec: ThemeSpec = {
  colors: {
    background: '#0a0a0a',
    text: '#fafafa',
    textMuted: '#a1a1aa',
    primary: '#8b5cf6',
    linkBg: '#18181b',
    linkText: '#fafafa',
    linkHover: '#27272a',
    linkBorder: '#27272a',
  },
  fonts: { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
  borderRadius: 'md',
  style: 'card',
};

export const meta = { id: 'dark', name: 'Dark', isPro: false, spec };
export const Layout = createStandardLayout(spec);
export const Miniature = createStandardMiniature(spec);
