/**
 * Platform icon detection and URL parsing
 */

import type { SocialPlatform } from '@/types';

interface PlatformConfig {
  name: string;
  patterns: RegExp[];
  color: string;
}

export const platformConfigs: Record<SocialPlatform, PlatformConfig> = {
  instagram: {
    name: 'Instagram',
    patterns: [/instagram\.com/, /instagr\.am/],
    color: '#E4405F',
  },
  twitter: {
    name: 'Twitter',
    patterns: [/twitter\.com/, /x\.com/],
    color: '#1DA1F2',
  },
  youtube: {
    name: 'YouTube',
    patterns: [/youtube\.com/, /youtu\.be/],
    color: '#FF0000',
  },
  tiktok: {
    name: 'TikTok',
    patterns: [/tiktok\.com/],
    color: '#000000',
  },
  spotify: {
    name: 'Spotify',
    patterns: [/spotify\.com/, /open\.spotify\.com/],
    color: '#1DB954',
  },
  soundcloud: {
    name: 'SoundCloud',
    patterns: [/soundcloud\.com/],
    color: '#FF5500',
  },
  twitch: {
    name: 'Twitch',
    patterns: [/twitch\.tv/],
    color: '#9146FF',
  },
  discord: {
    name: 'Discord',
    patterns: [/discord\.gg/, /discord\.com/],
    color: '#5865F2',
  },
  github: {
    name: 'GitHub',
    patterns: [/github\.com/],
    color: '#181717',
  },
  linkedin: {
    name: 'LinkedIn',
    patterns: [/linkedin\.com/],
    color: '#0A66C2',
  },
  facebook: {
    name: 'Facebook',
    patterns: [/facebook\.com/, /fb\.com/],
    color: '#1877F2',
  },
  pinterest: {
    name: 'Pinterest',
    patterns: [/pinterest\.com/],
    color: '#BD081C',
  },
  snapchat: {
    name: 'Snapchat',
    patterns: [/snapchat\.com/],
    color: '#FFFC00',
  },
  telegram: {
    name: 'Telegram',
    patterns: [/t\.me/, /telegram\.me/],
    color: '#26A5E4',
  },
  whatsapp: {
    name: 'WhatsApp',
    patterns: [/wa\.me/, /whatsapp\.com/],
    color: '#25D366',
  },
  email: {
    name: 'Email',
    patterns: [/^mailto:/],
    color: '#EA4335',
  },
  website: {
    name: 'Website',
    patterns: [],
    color: '#6B7280',
  },
};

/**
 * Detect platform from URL
 */
export function detectPlatform(url: string): SocialPlatform | null {
  const urlLower = url.toLowerCase();
  
  for (const [platform, config] of Object.entries(platformConfigs)) {
    for (const pattern of config.patterns) {
      if (pattern.test(urlLower)) {
        return platform as SocialPlatform;
      }
    }
  }
  
  return null;
}

/**
 * Get platform config by platform ID
 */
export function getPlatformConfig(platform: SocialPlatform): PlatformConfig {
  return platformConfigs[platform];
}

/**
 * Detect icon for a generic link (returns icon name)
 */
export function detectLinkIcon(url: string): string {
  const platform = detectPlatform(url);
  if (platform) return platform;
  
  const urlLower = url.toLowerCase();
  
  // Common link types
  if (urlLower.includes('paypal') || urlLower.includes('venmo') || urlLower.includes('cash.app')) {
    return 'dollar-sign';
  }
  if (urlLower.includes('amazon') || urlLower.includes('shop') || urlLower.includes('store')) {
    return 'shopping-bag';
  }
  if (urlLower.includes('calendly') || urlLower.includes('cal.com') || urlLower.includes('booking')) {
    return 'calendar';
  }
  if (urlLower.includes('podcast') || urlLower.includes('anchor.fm') || urlLower.includes('apple.co/podcast')) {
    return 'mic';
  }
  if (urlLower.includes('substack') || urlLower.includes('newsletter') || urlLower.includes('buttondown')) {
    return 'mail';
  }
  if (urlLower.includes('gumroad') || urlLower.includes('ko-fi') || urlLower.includes('patreon')) {
    return 'heart';
  }
  if (urlLower.includes('notion') || urlLower.includes('docs')) {
    return 'file-text';
  }
  
  return 'link';
}

/**
 * Format URL to ensure it has protocol
 */
export function formatUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('mailto:')) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

/**
 * Extract domain from URL for display
 */
export function extractDomain(url: string): string {
  try {
    const formatted = formatUrl(url);
    if (formatted.startsWith('mailto:')) {
      return formatted.replace('mailto:', '');
    }
    const urlObj = new URL(formatted);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}
