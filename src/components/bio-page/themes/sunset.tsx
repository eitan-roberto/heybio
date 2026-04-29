'use client';
import { createStandardLayout, createStandardMiniature } from './_standard';
import type { ThemeSpec } from './types';

const spec: ThemeSpec = {
  colors: {
    background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
    text: '#ffffff',
    textMuted: 'rgba(255,255,255,0.85)',
    primary: '#ffffff',
    linkBg: 'rgba(255,255,255,0.2)',
    linkText: '#ffffff',
    linkHover: 'rgba(255,255,255,0.3)',
    linkBackdropFilter: 'blur(10px)',
  },
  fonts: { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
  borderRadius: 'full',
  style: 'glass',
};

export const meta = { id: 'sunset', name: 'Sunset', isPro: false, spec };
export const Layout = createStandardLayout(spec);
export const Miniature = createStandardMiniature(spec);
