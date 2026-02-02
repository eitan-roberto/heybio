'use client';

import { useEffect } from 'react';
import { ProfileSection } from './ProfileSection';
import { LinkCard } from './LinkCard';
import { SocialBar } from './SocialBar';
import { getTheme, type Theme } from '@/config/themes';
import type { Page, Link, SocialIcon, SocialPlatform } from '@/types';

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
    return { background: theme.colors.background };
  }
  return { backgroundColor: theme.colors.background };
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

  // Track page view
  useEffect(() => {
    fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: page.slug }),
    }).catch(() => {});
  }, [page.slug]);

  const handleLinkClick = async (index: number, url: string) => {
    // Track click
    await fetch('/api/analytics/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: page.slug, url, index }),
    }).catch(() => {});
    
    onLinkClick?.(index);
  };

  return (
    <div className="min-h-screen w-full flex flex-col" style={getBackgroundStyle(theme)}>
      <main className="flex-1 w-full max-w-lg mx-auto px-6 py-12 flex flex-col">
        <div className="mb-8">
          <ProfileSection
            displayName={page.display_name}
            bio={page.bio}
            avatarUrl={page.avatar_url}
            theme={theme}
          />
        </div>

        {activeLinks.length > 0 && (
          <div className="flex-1 flex flex-col gap-4 mb-8">
            {activeLinks.map((link, index) => (
              <LinkCard
                key={index}
                link={link}
                theme={theme}
                onClick={() => handleLinkClick(index, link.url)}
              />
            ))}
          </div>
        )}

        {socialIcons.length > 0 && (
          <div className="mb-8">
            <SocialBar
              socialIcons={socialIcons}
              theme={theme}
              onIconClick={onSocialClick}
            />
          </div>
        )}
      </main>

      {showBadge && (
        <footer className="py-6 text-center">
          <a
            href="https://heybio.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 transition-opacity"
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
