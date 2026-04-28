'use client';
import { createStandardLayout } from './_standard';
import type { ThemeSpec } from './types';

const spec: ThemeSpec = {
  colors: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    text: '#ffffff',
    textMuted: 'rgba(255,255,255,0.8)',
    primary: '#ffffff',
    linkBg: 'rgba(255,255,255,0.15)',
    linkText: '#ffffff',
    linkHover: 'rgba(255,255,255,0.25)',
  },
  fonts: { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
  borderRadius: 'lg',
  style: 'glass',
};

export const meta = { id: 'gradient', name: 'Gradient', isPro: true, spec };
export const Layout = createStandardLayout(spec);
