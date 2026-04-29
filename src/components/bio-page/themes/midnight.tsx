'use client';
import { createStandardLayout, createStandardMiniature } from './_standard';
import type { ThemeSpec } from './types';

const spec: ThemeSpec = {
  colors: {
    background: '#020617',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    primary: '#6366f1',
    linkBg: '#0f172a',
    linkText: '#f8fafc',
    linkHover: '#1e293b',
    linkBorder: '#1e293b',
  },
  fonts: { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
  borderRadius: 'md',
  style: 'card',
};

export const meta = { id: 'midnight', name: 'Midnight', isPro: false, spec };
export const Layout = createStandardLayout(spec);
export const Miniature = createStandardMiniature(spec);
