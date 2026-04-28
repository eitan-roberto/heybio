'use client';

import { Icon } from '@/components/ui/icon';
import { formatUrl, getPlatformConfig } from '@/lib/icons';
import type { Theme } from '@/config/themes';
import type { SocialIcon, SocialPlatform } from '@/types';

interface SocialBarProps {
  socialIcons: Pick<SocialIcon, 'platform' | 'url' | 'order' | 'coming_soon_message'>[];
  theme: Theme;
  onIconClick?: (platform: SocialPlatform) => void;
  onComingSoon?: (message: string) => void;
}

const iconNames: Record<SocialPlatform, string> = {
  instagram: 'instagram',
  twitter: 'x-social',
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

export function SocialBar({ socialIcons, theme, onIconClick, onComingSoon }: SocialBarProps) {
  if (!socialIcons.length) return null;

  const circleBg = theme.colors.socialBg ?? theme.colors.linkBg;

  const normalStyle: React.CSSProperties = {
    color: theme.colors.text,
    backgroundColor: circleBg,
    transition: 'all 0.2s',
  };

  const handleEnter = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = theme.colors.primary;
    e.currentTarget.style.color = theme.colors.background.startsWith('linear') ? '#ffffff' : theme.colors.background;
    e.currentTarget.style.transform = 'scale(1.1)';
  };

  const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = circleBg;
    e.currentTarget.style.color = theme.colors.text;
    e.currentTarget.style.transform = 'scale(1)';
  };

  const sharedProps = {
    className: 'w-11 h-11 flex items-center justify-center rounded-full focus:outline-none',
    style: normalStyle,
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {[...socialIcons]
        .sort((a, b) => ((a as SocialIcon).order ?? 0) - ((b as SocialIcon).order ?? 0))
        .map((icon, index) => {
          const iconName = iconNames[icon.platform] || 'globe';
          const config = getPlatformConfig(icon.platform);
          const isComingSoon = !!icon.coming_soon_message;

          if (isComingSoon) {
            return (
              <button
                key={`${icon.platform}-${index}`}
                type="button"
                title={config.name}
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
              title={config.name}
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
