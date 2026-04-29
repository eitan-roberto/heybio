'use client';
import { createStandardLayout, createStandardMiniature } from './_standard';
import type { ThemeSpec } from './types';

const spec: ThemeSpec = {
  colors: {
    background: '#fef2f2',
    text: '#450a0a',
    textMuted: '#991b1b',
    primary: '#e11d48',
    linkBg: '#ffffff',
    linkText: '#450a0a',
    linkHover: '#fee2e2',
    linkBorder: '#fecaca',
  },
  fonts: { heading: 'Georgia, serif', body: 'Inter, system-ui, sans-serif' },
  borderRadius: 'full',
  style: 'card',
};

export const meta = { id: 'warm', name: 'Warm', isPro: false, spec };
export const Layout = createStandardLayout(spec);
export const Miniature = createStandardMiniature(spec);
