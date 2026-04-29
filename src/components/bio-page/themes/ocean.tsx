'use client';
import { createStandardLayout, createStandardMiniature } from './_standard';
import type { ThemeSpec } from './types';

const spec: ThemeSpec = {
  colors: {
    background: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 100%)',
    text: '#f0f9ff',
    textMuted: '#7dd3fc',
    primary: '#38bdf8',
    linkBg: 'rgba(56,189,248,0.1)',
    linkText: '#f0f9ff',
    linkHover: 'rgba(56,189,248,0.2)',
    linkBorder: 'rgba(56,189,248,0.3)',
    linkBackdropFilter: 'blur(10px)',
  },
  fonts: { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
  borderRadius: 'md',
  style: 'glass',
};

export const meta = { id: 'ocean', name: 'Ocean', isPro: false, spec };
export const Layout = createStandardLayout(spec);
export const Miniature = createStandardMiniature(spec);
