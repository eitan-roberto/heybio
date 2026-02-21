'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SvgIcon } from '@/components/ui/svg-icon';
import type { Theme } from '@/config/themes';

interface ProfileSectionProps {
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  theme: Theme;
  hasCoverImage?: boolean;
  showVerified?: boolean;
}

export function ProfileSection({ displayName, bio, avatarUrl, theme, hasCoverImage = false, showVerified = false }: ProfileSectionProps) {
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center text-center">
      {!hasCoverImage && (
        <Avatar className="w-24 h-24 mb-4 ring-4 ring-bottom/20 shadow-lg">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
          <AvatarFallback
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.background.startsWith('linear') ? '#ffffff' : theme.colors.background,
              fontFamily: theme.fonts.heading,
            }}
            className="text-2xl font-semibold"
          >
            {initials}
          </AvatarFallback>
        </Avatar>
      )}

      <h1
        className="text-4xl font-bold mb-2 inline-flex items-center gap-2"
        style={{
          color: theme.colors.text,
          fontFamily: theme.fonts.heading,
        }}
      >
        {displayName}
        {showVerified && (
          <SvgIcon icon="verified" className="w-6 h-6" style={{ color: theme.colors.textMuted }} />
        )}
      </h1>
      
      {bio && (
        <p 
          className="text-base max-w-sm opacity-90"
          style={{ 
            color: theme.colors.textMuted,
            fontFamily: theme.fonts.body,
          }}
        >
          {bio}
        </p>
      )}
    </div>
  );
}
