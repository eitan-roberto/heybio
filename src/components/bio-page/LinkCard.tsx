'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { detectLinkIcon, formatUrl } from '@/lib/icons';
import type { Theme } from '@/config/themes';
import type { Link } from '@/types';
import { cn } from '@/lib/utils';

interface LinkCardProps {
  link: Pick<Link, 'title' | 'url' | 'icon' | 'coming_soon_message' | 'is_nsfw'>;
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
  const [showNsfwWarning, setShowNsfwWarning] = useState(false);

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
      e.currentTarget.style.backgroundColor =
        theme.style === 'outline' || theme.style === 'glass' ? 'transparent' : theme.colors.linkBg;
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

  // NSFW warning overlay content
  const nsfwContent = (
    <div className="flex flex-col items-center gap-2 py-1">
      <span className="text-sm font-medium opacity-80">
        18+ May Contain Sensitive Content
      </span>
      <a
        href={formatUrl(link.url)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className="px-4 py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
        style={{
          backgroundColor: theme.colors.primary,
          color: theme.colors.background,
        }}
      >
        Continue (+18)
      </a>
    </div>
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

  // NSFW link — render as button that reveals warning on click
  if (link.is_nsfw) {
    return (
      <button
        type="button"
        className={cn(sharedClassNames, "relative overflow-hidden")}
        style={{
          ...sharedStyle,
          cursor: showNsfwWarning ? 'default' : 'pointer',
        }}
        {...sharedHover}
        onClick={() => {
          if (!showNsfwWarning) {
            setShowNsfwWarning(true);
          }
        }}
      >
        {/* Original content — fades out */}
        <div
          className={cn(
            "flex items-center gap-3 w-full transition-all duration-300 ease-out",
            showNsfwWarning ? "opacity-0 scale-95 absolute inset-0 pointer-events-none" : "opacity-100 scale-100"
          )}
        >
          {inner}
        </div>

        {/* NSFW warning — fades in */}
        <div
          className={cn(
            "w-full transition-all duration-300 ease-out",
            showNsfwWarning ? "opacity-100 scale-100" : "opacity-0 scale-95 absolute inset-0 pointer-events-none"
          )}
        >
          {nsfwContent}
        </div>
      </button>
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
