'use client';
import { createStandardLayout } from './_standard';
import type { ThemeSpec } from './types';

const spec: ThemeSpec = {
  colors: {
    background: '#faf5f0',
    text: '#44403c',
    textMuted: '#78716c',
    primary: '#d97706',
    linkBg: '#ffffff',
    linkText: '#44403c',
    linkHover: '#f5f5f4',
    linkBorder: '#e7e5e4',
  },
  fonts: { heading: 'Georgia, serif', body: 'Inter, system-ui, sans-serif' },
  borderRadius: 'lg',
  style: 'card',
};

export const meta = { id: 'soft', name: 'Soft', isPro: false, spec };
export const Layout = createStandardLayout(spec);
