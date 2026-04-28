'use client';
import { createStandardLayout } from './_standard';
import type { ThemeSpec } from './types';

const spec: ThemeSpec = {
  colors: {
    background: '#14532d',
    text: '#dcfce7',
    textMuted: '#86efac',
    primary: '#4ade80',
    linkBg: 'rgba(74,222,128,0.1)',
    linkText: '#dcfce7',
    linkHover: 'rgba(74,222,128,0.2)',
    linkBorder: 'rgba(74,222,128,0.3)',
  },
  fonts: { heading: 'Georgia, serif', body: 'Inter, system-ui, sans-serif' },
  borderRadius: 'lg',
  style: 'card',
};

export const meta = { id: 'forest', name: 'Forest', isPro: true, spec };
export const Layout = createStandardLayout(spec);
