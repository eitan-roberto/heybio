'use client';

import { Icon } from '@/components/ui/icon';
import { formatUrl, getPlatformConfig } from '@/lib/icons';
import type { Theme } from '@/config/themes';
import type { SocialIcon, SocialPlatform } from '@/types';
import { cn } from '@/lib/utils';

interface SocialBarProps {
  socialIcons: Pick<SocialIcon, 'platform' | 'url' | 'coming_soon_message'>[];
  theme: Theme;
  onIconClick?: (platform: SocialPlatform) => void;
  onComingSoon?: (message: string) => void;
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

const sharedClassName = cn(
  "w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 bg-bottom",
  "hover:scale-110 active:scale-95",
  "focus:outline-none focus:ring-2 focus:ring-offset-2"
);

export function SocialBar({ socialIcons, theme, onIconClick, onComingSoon }: SocialBarProps) {
  if (!socialIcons.length) return null;

  return (
    <div className="flex items-center justify-center gap-4">
      {[...socialIcons]
        .sort((a, b) => ((a as SocialIcon).order ?? 0) - ((b as SocialIcon).order ?? 0))
        .map((icon, index) => {
          const iconName = iconNames[icon.platform] || 'globe';
          const config = getPlatformConfig(icon.platform);
          const isComingSoon = !!icon.coming_soon_message;

          const sharedProps = {
            title: config.name,
            className: sharedClassName,
            style: { color: theme.colors.textMuted } as React.CSSProperties,
            onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.color = theme.colors.primary;
            },
            onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.color = theme.colors.textMuted;
            },
          };

          if (isComingSoon) {
            return (
              <button
                key={`${icon.platform}-${index}`}
                type="button"
                {...sharedProps}
                onClick={() => {
                  onIconClick?.(icon.platform);
                  onComingSoon?.(icon.coming_soon_message!);
                }}
              >
                <Icon icon={iconName} className="w-6 h-6" />
              </button>
            );
          }

          return (
            <a
              key={`${icon.platform}-${index}`}
              href={formatUrl(icon.url)}
              target="_blank"
              rel="noopener noreferrer"
              {...sharedProps}
              onClick={() => onIconClick?.(icon.platform)}
            >
              <Icon icon={iconName} className="w-6 h-6" />
            </a>
          );
        })}
    </div>
  );
}
