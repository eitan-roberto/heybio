'use client';

import { ExternalLink, Link as LinkIcon, Instagram, Twitter, Youtube, Music, 
  ShoppingBag, Calendar, Mic, Mail, Heart, FileText, DollarSign,
  MessageCircle, Github, Linkedin, Facebook, Twitch } from 'lucide-react';
import { detectLinkIcon, formatUrl } from '@/lib/icons';
import type { Theme } from '@/config/themes';
import type { Link } from '@/types';
import { cn } from '@/lib/utils';

interface LinkCardProps {
  link: Pick<Link, 'title' | 'url' | 'icon'>;
  theme: Theme;
  onClick?: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  spotify: Music,
  soundcloud: Music,
  tiktok: Music,
  twitch: Twitch,
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  telegram: MessageCircle,
  whatsapp: MessageCircle,
  discord: MessageCircle,
  'dollar-sign': DollarSign,
  'shopping-bag': ShoppingBag,
  calendar: Calendar,
  mic: Mic,
  mail: Mail,
  heart: Heart,
  'file-text': FileText,
  link: LinkIcon,
};

function getBorderRadius(radius: Theme['borderRadius']): string {
  switch (radius) {
    case 'none': return '0';
    case 'sm': return '0.375rem';
    case 'md': return '0.5rem';
    case 'lg': return '0.75rem';
    case 'full': return '9999px';
    default: return '0.5rem';
  }
}

export function LinkCard({ link, theme, onClick }: LinkCardProps) {
  const iconName = link.icon || detectLinkIcon(link.url);
  const IconComponent = iconMap[iconName] || LinkIcon;
  
  const handleClick = () => {
    onClick?.();
    // Actual navigation happens via the anchor tag
  };

  const cardStyles: React.CSSProperties = {
    backgroundColor: theme.style === 'outline' || theme.style === 'glass' 
      ? 'transparent' 
      : theme.colors.linkBg,
    color: theme.colors.linkText,
    borderRadius: getBorderRadius(theme.borderRadius),
    border: theme.colors.linkBorder 
      ? `1px solid ${theme.colors.linkBorder}` 
      : theme.style === 'outline' 
        ? `1px solid ${theme.colors.linkText}` 
        : 'none',
    backdropFilter: theme.style === 'glass' ? 'blur(10px)' : undefined,
    fontFamily: theme.fonts.body,
  };

  const hoverBg = theme.colors.linkHover;

  return (
    <a
      href={formatUrl(link.url)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        "group w-full flex items-center gap-3 px-5 py-4",
        "transition-all duration-200 ease-out",
        "hover:scale-[1.02] active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-offset-2"
      )}
      style={{
        ...cardStyles,
        // @ts-expect-error CSS custom property
        '--hover-bg': hoverBg,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverBg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = theme.style === 'outline' || theme.style === 'glass' 
          ? 'transparent' 
          : theme.colors.linkBg;
      }}
    >
      <IconComponent className="w-5 h-5 flex-shrink-0 opacity-70" />
      <span className="flex-1 font-medium text-center">{link.title}</span>
      <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" />
    </a>
  );
}
