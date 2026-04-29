import type { Link, SocialIcon, SocialPlatform } from '@/types';
import type { ComponentType } from 'react';

export interface ThemeColors {
  background: string;
  text: string;
  textMuted: string;
  primary: string;
  linkBg: string;
  linkText: string;
  linkHover: string;
  linkBorder?: string;
  linkBackdropFilter?: string;
  socialBg?: string;
}

export interface ThemeSpec {
  colors: ThemeColors;
  fonts: { heading: string; body: string };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  style: 'minimal' | 'card' | 'outline' | 'filled' | 'glass';
}

export type ThemeActiveLink = Pick<
  Link,
  'title' | 'url' | 'icon' | 'is_active' | 'is_nsfw' | 'order' | 'expires_at' | 'coming_soon_message'
> & { id?: string };

export type ThemeSocialIcon = Pick<SocialIcon, 'platform' | 'url' | 'order' | 'coming_soon_message'>;

export interface ThemeLayoutProps {
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  activeLinks: ThemeActiveLink[];
  socialIcons: ThemeSocialIcon[];
  coverImageUrl?: string;
  languages: string[];
  selectedLang: string;
  onSelectLang: (code: string) => void;
  onLinkClick: (index: number, url: string, linkId?: string) => void;
  onSocialClick?: (platform: SocialPlatform) => void;
  rtl: boolean;
  isPreview: boolean;
  isPro: boolean;
  showBadge: boolean;
}

export interface ThemeMeta {
  id: string;
  name: string;
  isPro: boolean;
  hasCustomLayout?: boolean;
  spec: ThemeSpec;
}

export interface ThemeMiniatureProps {
  coverImageUrl?: string;
}

export interface ThemeDefinition extends ThemeMeta {
  Layout: ComponentType<ThemeLayoutProps>;
  Miniature: ComponentType<ThemeMiniatureProps>;
}
