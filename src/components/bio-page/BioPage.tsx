'use client';

import { useEffect, useState } from 'react';
import { getLayout } from './themes';
import { isRtl } from '@/lib/languages';
import type { Page, Link, SocialIcon, SocialPlatform, PageTranslation, LinkTranslation } from '@/types';

interface BioPageProps {
  page: Pick<Page, 'display_name' | 'bio' | 'avatar_url' | 'theme_id' | 'slug'> & {
    languages?: string[];
  };
  links: (Pick<Link, 'title' | 'url' | 'icon' | 'is_active' | 'is_nsfw' | 'order' | 'expires_at' | 'coming_soon_message'> & { id?: string })[];
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
  const languages = page.languages ?? ['en'];
  const [selectedLang, setSelectedLang] = useState(languages[0] ?? 'en');

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
    .sort((a, b) => a.order - b.order)
    .map((link) => {
      const lt = link.id ? linkTranslations.find((t) => t.link_id === link.id) : null;
      const title = selectedLang !== 'en' && lt?.title ? lt.title : link.title;
      return { ...link, title };
    });

  const Layout = getLayout(page.theme_id);
  const rtl = isRtl(selectedLang);

  return (
    <Layout
      displayName={displayName}
      bio={bio}
      avatarUrl={page.avatar_url}
      activeLinks={activeLinks}
      socialIcons={socialIcons}
      coverImageUrl={coverImageUrl}
      languages={languages}
      selectedLang={selectedLang}
      onSelectLang={setSelectedLang}
      onLinkClick={handleLinkClick}
      onSocialClick={onSocialClick}
      rtl={rtl}
      isPreview={isPreview}
      isPro={isPro}
      showBadge={showBadge}
    />
  );
}
