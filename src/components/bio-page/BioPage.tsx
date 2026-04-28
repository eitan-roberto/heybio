'use client';

import { useEffect, useState } from 'react';
import { ProfileSection } from './ProfileSection';
import { LinkCard } from './LinkCard';
import { SocialBar } from './SocialBar';
import { getLayout } from './layouts';
import { getTheme, type Theme } from '@/config/themes';
import { getLanguage, isRtl } from '@/lib/languages';
import type { Page, Link, SocialIcon, SocialPlatform, PageTranslation, LinkTranslation } from '@/types';
import { cn } from '@/lib/utils';

interface BioPageProps {
  page: Pick<Page, 'display_name' | 'bio' | 'avatar_url' | 'theme_id' | 'slug'> & {
    languages?: string[];
  };
  links: Pick<Link, 'title' | 'url' | 'icon' | 'is_active' | 'is_nsfw' | 'order' | 'expires_at' | 'coming_soon_message'>[];
  socialIcons: Pick<SocialIcon, 'platform' | 'url' | 'order' | 'coming_soon_message'>[];
  translations?: PageTranslation[];
  linkTranslations?: LinkTranslation[];
  onLinkClick?: (linkIndex: number) => void;
  coverImageUrl?: string;
  onSocialClick?: (platform: SocialPlatform) => void;
  showBadge?: boolean;
  isPro?: boolean;
  isPreview?: boolean;
}

function ExpiryBadge({ expiresAt, theme }: { expiresAt: string; theme: Theme }) {
  const now = Date.now();
  const exp = new Date(expiresAt).getTime();
  const diff = exp - now;
  const hoursLeft = diff / (1000 * 60 * 60);
  if (hoursLeft < 0) return null;

  let label = '';
  if (hoursLeft < 1) {
    label = `Expires in ${Math.round(diff / (1000 * 60))}m`;
  } else if (hoursLeft < 24) {
    label = `Expires in ${Math.round(hoursLeft)}h`;
  } else {
    label = `Expires in ${Math.floor(hoursLeft / 24)}d`;
  }

  return (
    <div className="flex justify-center mb-1">
      <span
        className="text-xs px-2 py-0.5 rounded-full opacity-70"
        style={{ backgroundColor: `${theme.colors.primary}20`, color: theme.colors.textMuted }}
      >
        ⏳ {label}
      </span>
    </div>
  );
}

function LanguageSwitcher({ languages, selected, onSelect, theme }: {
  languages: string[];
  selected: string;
  onSelect: (code: string) => void;
  theme: Theme;
}) {
  if (languages.length <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
      {languages.map((code) => {
        const lang = getLanguage(code);
        const isSelected = code === selected;
        return (
          <button
            key={code}
            onClick={() => onSelect(code)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              isSelected ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-80'
            )}
            style={{
              backgroundColor: isSelected ? theme.colors.primary : `${theme.colors.primary}20`,
              color: isSelected ? theme.colors.background : theme.colors.text,
            }}
          >
            <span>{lang?.flag ?? '🌐'}</span>
            <span>{lang?.nativeName ?? code.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}

function getOrCreateVisitorId(): string {
  const key = 'hb_vid';
  try {
    let id = localStorage.getItem(key);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id); }
    return id;
  } catch { return 'anonymous'; }
}

export function BioPage({
  page,
  links,
  socialIcons,
  translations = [],
  linkTranslations = [],
  coverImageUrl,
  onLinkClick,
  onSocialClick,
  showBadge = true,
  isPro = false,
  isPreview = false,
}: BioPageProps) {
  const theme = getTheme(page.theme_id);
  const Layout = getLayout(theme.layout);
  const languages = page.languages ?? ['en'];
  const [selectedLang, setSelectedLang] = useState(languages[0] ?? 'en');
  const [comingSoonPopup, setComingSoonPopup] = useState<string | null>(null);

  useEffect(() => {
    if (!languages.includes(selectedLang)) setSelectedLang(languages[0] ?? 'en');
  }, [languages, selectedLang]);

  useEffect(() => {
    if (isPreview) return;
    const visitorId = getOrCreateVisitorId();
    fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: page.slug, visitorId }),
    }).catch(() => {});
  }, [page.slug, isPreview]);

  const handleLinkClick = async (index: number, url: string, linkId?: string) => {
    if (!isPreview) {
      const visitorId = getOrCreateVisitorId();
      await fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: page.slug, url, index, linkId, visitorId }),
      }).catch(() => {});
    }
    onLinkClick?.(index);
  };

  const translationForLang = translations.find((t) => t.language_code === selectedLang);
  const displayName =
    selectedLang !== 'en' && translationForLang?.display_name
      ? translationForLang.display_name
      : page.display_name;
  const bio =
    selectedLang !== 'en' && translationForLang?.bio ? translationForLang.bio : page.bio;

  const now = new Date().toISOString();
  const activeLinks = links
    .filter((link) => link.is_active && (!link.expires_at || link.expires_at > now))
    .sort((a, b) => a.order - b.order);

  const rtl = isRtl(selectedLang);
  const hasCoverLayout = !!theme.layout && theme.layout !== 'standard';

  // Pre-built content piece — layouts can use this or render raw data themselves
  const content = (
    <>
      {languages.length > 1 && (
        <LanguageSwitcher languages={languages} selected={selectedLang} onSelect={setSelectedLang} theme={theme} />
      )}
      <div>
        <ProfileSection
          displayName={displayName}
          bio={bio}
          avatarUrl={page.avatar_url}
          theme={theme}
          hasCoverImage={hasCoverLayout && !!coverImageUrl}
          showVerified={hasCoverLayout && !!coverImageUrl && isPro}
        />
      </div>
      {socialIcons.length > 0 && (
        <div>
          <SocialBar
            socialIcons={socialIcons}
            theme={theme}
            onIconClick={onSocialClick}
            onComingSoon={(msg) => setComingSoonPopup(msg)}
          />
        </div>
      )}
      {activeLinks.length > 0 && (
        <div className="flex-1 flex flex-col gap-4">
          {activeLinks.map((link, index) => {
            const linkIdForTrans = (link as Link).id;
            const ltForLink = linkIdForTrans
              ? linkTranslations.find((lt) => lt.link_id === linkIdForTrans)
              : null;
            const translatedTitle =
              selectedLang !== 'en' && ltForLink?.title ? ltForLink.title : link.title;
            const showsExpiry =
              link.expires_at &&
              new Date(link.expires_at).getTime() - Date.now() < 24 * 60 * 60 * 1000 * 3;
            return (
              <div key={index}>
                {showsExpiry && link.expires_at && <ExpiryBadge expiresAt={link.expires_at} theme={theme} />}
                <LinkCard
                  link={{ ...link, title: translatedTitle }}
                  theme={theme}
                  onClick={() => handleLinkClick(index, link.url, linkIdForTrans)}
                  onComingSoon={(msg) => setComingSoonPopup(msg)}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  const comingSoonOverlay = comingSoonPopup && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={() => setComingSoonPopup(null)}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl"
        style={{ backgroundColor: theme.colors.background, fontFamily: theme.fonts.body }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: theme.colors.linkBg }}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: theme.colors.primary }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-base font-medium mb-5" style={{ color: theme.colors.text }}>{comingSoonPopup}</p>
        <button
          onClick={() => setComingSoonPopup(null)}
          className="w-full py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ backgroundColor: theme.colors.linkBg, color: theme.colors.linkText }}
        >
          Got it
        </button>
      </div>
    </div>
  );

  const badge = showBadge && (
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
  );

  return (
    <Layout
      theme={theme}
      rtl={rtl}
      isPreview={isPreview}
      isPro={isPro}
      showBadge={showBadge}
      coverImageUrl={coverImageUrl}
      displayName={displayName}
      bio={bio}
      avatarUrl={page.avatar_url}
      activeLinks={activeLinks}
      socialIcons={socialIcons}
      content={content}
      badge={badge}
      comingSoonOverlay={comingSoonOverlay}
    />
  );
}
