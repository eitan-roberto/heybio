/**
 * Theme Configuration
 * 6 free themes + 6 pro themes
 */

export interface Theme {
  id: string;
  name: string;
  isPro: boolean;
  colors: {
    background: string;
    text: string;
    textMuted: string;
    primary: string;
    linkBg: string;
    linkText: string;
    linkHover: string;
    linkBorder?: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  style: 'minimal' | 'card' | 'outline' | 'filled' | 'glass';
}

export const themes: Record<string, Theme> = {
  // Free themes
  clean: {
    id: 'clean',
    name: 'Clean',
    isPro: false,
    colors: {
      background: '#ffffff',
      text: '#1a1a1a',
      textMuted: '#6b7280',
      primary: '#3b82f6',
      linkBg: '#f3f4f6',
      linkText: '#1a1a1a',
      linkHover: '#e5e7eb',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: 'lg',
    style: 'filled',
  },
  
  soft: {
    id: 'soft',
    name: 'Soft',
    isPro: false,
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
    fonts: {
      heading: 'Georgia, serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: 'lg',
    style: 'card',
  },
  
  bold: {
    id: 'bold',
    name: 'Bold',
    isPro: false,
    colors: {
      background: '#fef3c7',
      text: '#1a1a1a',
      textMuted: '#525252',
      primary: '#dc2626',
      linkBg: '#1a1a1a',
      linkText: '#ffffff',
      linkHover: '#262626',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: 'none',
    style: 'filled',
  },
  
  dark: {
    id: 'dark',
    name: 'Dark',
    isPro: false,
    colors: {
      background: '#0a0a0a',
      text: '#fafafa',
      textMuted: '#a1a1aa',
      primary: '#8b5cf6',
      linkBg: '#18181b',
      linkText: '#fafafa',
      linkHover: '#27272a',
      linkBorder: '#27272a',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: 'md',
    style: 'card',
  },
  
  warm: {
    id: 'warm',
    name: 'Warm',
    isPro: false,
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
    fonts: {
      heading: 'Georgia, serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: 'full',
    style: 'card',
  },
  
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    isPro: false,
    colors: {
      background: '#ffffff',
      text: '#171717',
      textMuted: '#737373',
      primary: '#171717',
      linkBg: 'transparent',
      linkText: '#171717',
      linkHover: '#f5f5f5',
      linkBorder: '#e5e5e5',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: 'sm',
    style: 'outline',
  },
  
  // Pro themes
  gradient: {
    id: 'gradient',
    name: 'Gradient',
    isPro: true,
    colors: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.8)',
      primary: '#ffffff',
      linkBg: 'rgba(255,255,255,0.15)',
      linkText: '#ffffff',
      linkHover: 'rgba(255,255,255,0.25)',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: 'lg',
    style: 'glass',
  },
  
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    isPro: true,
    colors: {
      background: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 100%)',
      text: '#f0f9ff',
      textMuted: '#7dd3fc',
      primary: '#38bdf8',
      linkBg: 'rgba(56, 189, 248, 0.1)',
      linkText: '#f0f9ff',
      linkHover: 'rgba(56, 189, 248, 0.2)',
      linkBorder: 'rgba(56, 189, 248, 0.3)',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: 'md',
    style: 'glass',
  },
  
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    isPro: true,
    colors: {
      background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.85)',
      primary: '#ffffff',
      linkBg: 'rgba(255,255,255,0.2)',
      linkText: '#ffffff',
      linkHover: 'rgba(255,255,255,0.3)',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: 'full',
    style: 'glass',
  },
  
  forest: {
    id: 'forest',
    name: 'Forest',
    isPro: true,
    colors: {
      background: '#14532d',
      text: '#dcfce7',
      textMuted: '#86efac',
      primary: '#4ade80',
      linkBg: 'rgba(74, 222, 128, 0.1)',
      linkText: '#dcfce7',
      linkHover: 'rgba(74, 222, 128, 0.2)',
      linkBorder: 'rgba(74, 222, 128, 0.3)',
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: 'lg',
    style: 'card',
  },
  
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    isPro: true,
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
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: 'md',
    style: 'card',
  },
  
  cream: {
    id: 'cream',
    name: 'Cream',
    isPro: true,
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
    fonts: {
      heading: 'Playfair Display, Georgia, serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: 'lg',
    style: 'card',
  },
};

export const freeThemes = Object.values(themes).filter(t => !t.isPro);
export const proThemes = Object.values(themes).filter(t => t.isPro);
export const allThemes = Object.values(themes);

export function getTheme(id: string): Theme {
  return themes[id] || themes.clean;
}
