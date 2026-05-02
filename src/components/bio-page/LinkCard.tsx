'use client';

import { Icon } from '@/components/ui/icon';
import { detectLinkIcon, formatUrl } from '@/lib/icons';
import type { ThemeSpec as Theme } from './themes/types';
import type { Link } from '@/types';
import { cn } from '@/lib/utils';

interface LinkCardProps {
  link: Pick<Link, 'title' | 'url' | 'icon' | 'coming_soon_message' | 'is_nsfw'> & { id?: string };
  theme: Theme;
  onClick?: () => void;
  onComingSoon?: (message: string) => void;
}

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

export function LinkCard({ link, theme, onClick, onComingSoon }: LinkCardProps) {
  const iconName = link.icon || detectLinkIcon(link.url);
  const isComingSoon = !!link.coming_soon_message;

  const cardStyles: React.CSSProperties = {
    backgroundColor: theme.colors.linkBg,
    color: theme.colors.linkText,
    borderRadius: getBorderRadius(theme.borderRadius),
    border: theme.colors.linkBorder ? `1px solid ${theme.colors.linkBorder}` : 'none',
    backdropFilter: theme.colors.linkBackdropFilter,
    fontFamily: theme.fonts.body,
  };

  const hoverBg = theme.colors.linkHover;

  const sharedClassNames = cn(
    "group w-full flex items-center gap-3 px-5 py-4",
    "transition-all duration-200 ease-out",
    "hover:scale-[1.02] active:scale-[0.98]",
    "focus:outline-none focus:ring-2 focus:ring-offset-2"
  );

  const sharedStyle = {
    ...cardStyles,
    '--hover-bg': hoverBg,
  } as React.CSSProperties;

  const sharedHover = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.backgroundColor = hoverBg;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.backgroundColor = theme.colors.linkBg;
    },
  };

  const inner = (
    <>
      <Icon icon={iconName} className="w-5 h-5 flex-shrink-0 opacity-70" />
      <span className="flex-1 font-medium text-center">{link.title}</span>
      {!isComingSoon && (
        <Icon icon="external-link" className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" />
      )}
    </>
  );

  if (isComingSoon) {
    return (
      <button
        type="button"
        className={sharedClassNames}
        style={sharedStyle}
        {...sharedHover}
        onClick={() => {
          onClick?.();
          onComingSoon?.(link.coming_soon_message!);
        }}
      >
        {inner}
      </button>
    );
  }

  if (link.is_nsfw && link.id) {
    return (
      <a
        href={`/link/${link.id}`}
        className={sharedClassNames}
        style={sharedStyle}
        {...sharedHover}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <a
      href={formatUrl(link.url)}
      target="_blank"
      rel="noopener noreferrer"
      className={sharedClassNames}
      style={sharedStyle}
      {...sharedHover}
      onClick={onClick}
    >
      {inner}
    </a>
  );
}
