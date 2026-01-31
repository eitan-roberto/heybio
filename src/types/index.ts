/**
 * Core Types
 */

export type Plan = 'free' | 'pro';

export interface User {
  id: string;
  email: string;
  created_at: string;
  plan: Plan;
  lemonsqueezy_customer_id?: string;
}

export interface Page {
  id: string;
  user_id: string;
  slug: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  theme_id: string;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  page_id: string;
  title: string;
  url: string;
  icon?: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

export type SocialPlatform = 
  | 'instagram'
  | 'twitter'
  | 'youtube'
  | 'tiktok'
  | 'spotify'
  | 'soundcloud'
  | 'twitch'
  | 'discord'
  | 'github'
  | 'linkedin'
  | 'facebook'
  | 'pinterest'
  | 'snapchat'
  | 'telegram'
  | 'whatsapp'
  | 'email'
  | 'website';

export interface SocialIcon {
  id: string;
  page_id: string;
  platform: SocialPlatform;
  url: string;
  order: number;
}

export interface PageView {
  id: string;
  page_id: string;
  timestamp: string;
  referrer?: string;
  country?: string;
  device?: 'mobile' | 'desktop' | 'tablet';
}

export interface LinkClick {
  id: string;
  link_id: string;
  page_id: string;
  timestamp: string;
  referrer?: string;
}

// Onboarding state (stored in localStorage until signup)
export interface OnboardingDraft {
  slug: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  theme_id: string;
  links: Omit<Link, 'id' | 'page_id' | 'created_at'>[];
  social_icons: Omit<SocialIcon, 'id' | 'page_id'>[];
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}
