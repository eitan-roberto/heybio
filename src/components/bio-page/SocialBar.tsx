'use client';

import { Icon, IconSize } from '@/components/ui/icon';
import { formatUrl, getPlatformConfig } from '@/lib/icons';
import type { Theme } from '@/config/themes';
import type { SocialIcon, SocialPlatform } from '@/types';
import { cn } from '@/lib/utils';

interface SocialBarProps {
  socialIcons: Pick<SocialIcon, 'platform' | 'url'>[];
  theme: Theme;
  onIconClick?: (platform: SocialPlatform) => void;
}

const iconNames: Record<SocialPlatform, string> = {
  instagram: 'instagram',
  twitter: 'twitter',
  youtube: 'youtube',
  tiktok: 'tiktok',
  spotify: 'music',
  soundcloud: 'music',
  twitch: 'twitch',
  discord: 'message-circle',
  github: 'github',
  linkedin: 'linkedin',
  facebook: 'facebook',
  pinterest: 'globe',
  snapchat: 'message-circle',
  telegram: 'message-circle',
  whatsapp: 'message-circle',
  email: 'mail',
  website: 'globe',
};

export function SocialBar({ socialIcons, theme, onIconClick }: SocialBarProps) {
  if (!socialIcons.length) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8 mb-4">
      {socialIcons
        .sort((a, b) => (a as SocialIcon).order - (b as SocialIcon).order)
        .map((icon, index) => {
          const iconName = iconNames[icon.platform] || 'globe';
          const config = getPlatformConfig(icon.platform);

          return (
            <a
              key={`${icon.platform}-${index}`}
              href={formatUrl(icon.url)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onIconClick?.(icon.platform)}
              title={config.name}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                "hover:scale-110 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-offset-2"
              )}
              style={{
                color: theme.colors.textMuted,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.colors.textMuted;
              }}
            >
              <Icon name={iconName} className="w-5 h-5" />
            </a>
          );
        })}
    </div>
  );
}
