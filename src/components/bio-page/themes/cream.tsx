'use client';
import { createStandardLayout } from './_standard';
import type { ThemeSpec } from './types';

const spec: ThemeSpec = {
  colors: {
    background: '#fffbeb',
    text: '#451a03',
    textMuted: '#92400e',
    primary: '#b45309',
    linkBg: '#ffffff',
    linkText: '#451a03',
    linkHover: '#fef3c7',
    linkBorder: '#fde68a',
  },
  fonts: { heading: 'Playfair Display, Georgia, serif', body: 'Inter, system-ui, sans-serif' },
  borderRadius: 'lg',
  style: 'card',
};

export const meta = { id: 'cream', name: 'Cream', isPro: true, spec };
export const Layout = createStandardLayout(spec);
