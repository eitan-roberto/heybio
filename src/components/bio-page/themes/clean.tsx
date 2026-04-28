'use client';
import { createStandardLayout } from './_standard';
import type { ThemeSpec } from './types';

const spec: ThemeSpec = {
  colors: {
    background: '#ffffff',
    text: '#1a1a1a',
    textMuted: '#6b7280',
    primary: '#3b82f6',
    linkBg: '#f3f4f6',
    linkText: '#1a1a1a',
    linkHover: '#e5e7eb',
  },
  fonts: { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
  borderRadius: 'lg',
  style: 'filled',
};

export const meta = { id: 'clean', name: 'Clean', isPro: false, spec };
export const Layout = createStandardLayout(spec);
