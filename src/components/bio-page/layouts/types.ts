import type { Theme } from '@/config/themes';
import type { Link, SocialIcon } from '@/types';
import type React from 'react';

export interface BioPageLayoutProps {
  // Theme
  theme: Theme;
  rtl: boolean;
  isPreview: boolean;
  isPro: boolean;
  showBadge: boolean;
  coverImageUrl?: string;

  // Raw data — use these if you want to render differently
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  activeLinks: Pick<Link, 'title' | 'url' | 'icon' | 'is_active' | 'is_nsfw' | 'order' | 'expires_at' | 'coming_soon_message'>[];
  socialIcons: Pick<SocialIcon, 'platform' | 'url' | 'order' | 'coming_soon_message'>[];

  // Pre-built composable pieces — slot these in for standard rendering
  content: React.ReactNode;
  badge: React.ReactNode;
  comingSoonOverlay: React.ReactNode;
}
