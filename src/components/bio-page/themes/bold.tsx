'use client';
import { createStandardLayout } from './_standard';
import type { ThemeSpec } from './types';

const spec: ThemeSpec = {
  colors: {
    background: '#fef3c7',
    text: '#1a1a1a',
    textMuted: '#525252',
    primary: '#dc2626',
    linkBg: '#1a1a1a',
    linkText: '#ffffff',
    linkHover: '#262626',
  },
  fonts: { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
  borderRadius: 'none',
  style: 'filled',
};

export const meta = { id: 'bold', name: 'Bold', isPro: false, spec };
export const Layout = createStandardLayout(spec);
