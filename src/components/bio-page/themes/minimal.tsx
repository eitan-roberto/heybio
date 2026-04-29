'use client';
import { createStandardLayout, createStandardMiniature } from './_standard';
import type { ThemeSpec } from './types';

const spec: ThemeSpec = {
  colors: {
    background: '#ffffff',
    text: '#171717',
    textMuted: '#737373',
    primary: '#171717',
    linkBg: 'transparent',
    linkText: '#171717',
    linkHover: '#f5f5f5',
    linkBorder: '#e5e5e5',
  },
  fonts: { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
  borderRadius: 'sm',
  style: 'outline',
};

export const meta = { id: 'minimal', name: 'Minimal', isPro: false, spec };
export const Layout = createStandardLayout(spec);
export const Miniature = createStandardMiniature(spec);
