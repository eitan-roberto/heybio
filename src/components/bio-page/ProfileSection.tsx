'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
          <svg className="w-6 h-6" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-label="Verified">
            <path fill={theme.colors.textMuted} d="M7.057 1.4a1.333 1.333 0 0 1 1.8-.077l.086.078L10.21 2.667H12a1.333 1.333 0 0 1 1.329 1.233L13.333 4v1.79l1.267 1.267a1.333 1.333 0 0 1 .077 1.8l-.078.085-1.267 1.267V12a1.333 1.333 0 0 1-1.233 1.33L12 13.333h-1.79l-1.267 1.267a1.333 1.333 0 0 1-1.8.077l-.085-.077-1.267-1.267H4a1.333 1.333 0 0 1-1.33-1.233L2.667 12v-1.79L1.4 8.943a1.333 1.333 0 0 1-.077-1.8l.077-.085L2.667 5.79V4a1.333 1.333 0 0 1 1.233-1.33L4 2.667h1.79L7.058 1.4Zm2.995 4.589-2.829 2.829-1.179-1.179a.667.667 0 0 0-.943.943l1.603 1.603a.733.733 0 0 0 1.037 0l3.254-3.254a.667.667 0 0 0-.943-.942Z" />
          </svg>
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
