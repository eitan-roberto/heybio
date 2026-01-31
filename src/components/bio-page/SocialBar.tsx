'use client';

import { Instagram, Twitter, Youtube, Music, Github, Linkedin, Facebook, 
  Twitch, MessageCircle, Mail, Globe } from 'lucide-react';
import { formatUrl, getPlatformConfig } from '@/lib/icons';
import type { Theme } from '@/config/themes';
import type { SocialIcon, SocialPlatform } from '@/types';
import { cn } from '@/lib/utils';

interface SocialBarProps {
  socialIcons: Pick<SocialIcon, 'platform' | 'url'>[];
  theme: Theme;
  onIconClick?: (platform: SocialPlatform) => void;
}

const iconComponents: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: Music,
  spotify: Music,
  soundcloud: Music,
  twitch: Twitch,
  discord: MessageCircle,
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  pinterest: Globe,
  snapchat: MessageCircle,
  telegram: MessageCircle,
  whatsapp: MessageCircle,
  email: Mail,
  website: Globe,
};

export function SocialBar({ socialIcons, theme, onIconClick }: SocialBarProps) {
  if (!socialIcons.length) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8 mb-4">
      {socialIcons
        .sort((a, b) => (a as SocialIcon).order - (b as SocialIcon).order)
        .map((icon, index) => {
          const IconComponent = iconComponents[icon.platform] || Globe;
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
              <IconComponent className="w-5 h-5" />
            </a>
          );
        })}
    </div>
  );
}
