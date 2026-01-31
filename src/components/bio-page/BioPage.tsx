'use client';

import { ProfileSection } from './ProfileSection';
import { LinkCard } from './LinkCard';
import { SocialBar } from './SocialBar';
import { getTheme, type Theme } from '@/config/themes';
import type { Page, Link, SocialIcon, SocialPlatform } from '@/types';
import { cn } from '@/lib/utils';

interface BioPageProps {
  page: Pick<Page, 'display_name' | 'bio' | 'avatar_url' | 'theme_id' | 'slug'>;
  links: Pick<Link, 'title' | 'url' | 'icon' | 'is_active' | 'order'>[];
  socialIcons: Pick<SocialIcon, 'platform' | 'url' | 'order'>[];
  onLinkClick?: (linkIndex: number) => void;
  onSocialClick?: (platform: SocialPlatform) => void;
  showBadge?: boolean;
}

function getBackgroundStyle(theme: Theme): React.CSSProperties {
  if (theme.colors.background.startsWith('linear')) {
    return {
      background: theme.colors.background,
    };
  }
  return {
    backgroundColor: theme.colors.background,
  };
}

export function BioPage({ 
  page, 
  links, 
  socialIcons, 
  onLinkClick, 
  onSocialClick,
  showBadge = true 
}: BioPageProps) {
  const theme = getTheme(page.theme_id);
  
  const activeLinks = links
    .filter(link => link.is_active)
    .sort((a, b) => a.order - b.order);

  return (
    <div 
      className="min-h-screen w-full flex flex-col"
      style={getBackgroundStyle(theme)}
    >
      <main className="flex-1 w-full max-w-lg mx-auto px-6 py-12">
        <ProfileSection
          displayName={page.display_name}
          bio={page.bio}
          avatarUrl={page.avatar_url}
          theme={theme}
        />
        
        <div className="flex flex-col gap-3">
          {activeLinks.map((link, index) => (
            <LinkCard
              key={index}
              link={link}
              theme={theme}
              onClick={() => onLinkClick?.(index)}
            />
          ))}
        </div>
        
        <SocialBar
          socialIcons={socialIcons}
          theme={theme}
          onIconClick={onSocialClick}
        />
      </main>
      
      {showBadge && (
        <footer className="py-6 text-center">
          <a
            href="https://heybio.co"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-1.5 text-xs opacity-60",
              "hover:opacity-100 transition-opacity"
            )}
            style={{ color: theme.colors.textMuted }}
          >
            <span>Made with</span>
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>HeyBio</span>
          </a>
        </footer>
      )}
    </div>
  );
}
