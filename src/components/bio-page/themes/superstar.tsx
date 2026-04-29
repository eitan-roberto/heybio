'use client';

import { useState } from 'react';
import { ProfileSection } from '../ProfileSection';
import { LinkCard } from '../LinkCard';
import { SocialBar } from '../SocialBar';
import { CoverBackground, CoverBanner } from '../CoverImage';
import { getLanguage } from '@/lib/languages';
import { cn } from '@/lib/utils';
import type { ThemeSpec, ThemeLayoutProps, ThemeMiniatureProps } from './types';

const colors = {
  background: '#0c0c14',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.55)',
  primary: '#f5c518',
  linkBg: '#f5c518',
  linkText: '#0c0c14',
  linkHover: '#e6b800',
  socialBg: 'rgba(255,255,255,0.10)',
};

const spec: ThemeSpec = {
  colors,
  fonts: { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
  borderRadius: 'lg',
  style: 'filled',
};

export const meta = {
  id: 'superstar',
  name: 'Superstar',
  isPro: true,
  hasCustomLayout: true,
  spec,
};

export function Miniature({ coverImageUrl }: ThemeMiniatureProps) {
  return (
    <div className="w-full flex flex-col" style={{ backgroundColor: colors.background }}>
      {/* cover */}
      <div className="w-full h-12 overflow-hidden relative">
        {coverImageUrl ? (
          <>
            <img src={coverImageUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-6" style={{ background: `linear-gradient(to bottom, transparent, ${colors.background})` }} />
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${colors.primary}50 0%, ${colors.primary}20 100%)` }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: colors.primary, opacity: 0.7 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>
      {/* content */}
      <div className="flex flex-col items-center px-3 py-3 gap-2">
        <div className="w-14 h-1.5 rounded-full" style={{ backgroundColor: colors.text, opacity: 0.9 }} />
        <div className="w-full h-4 rounded-lg shrink-0" style={{ backgroundColor: colors.linkBg }} />
      </div>
    </div>
  );
}

function ExpiryBadge({ expiresAt }: { expiresAt: string }) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  const h = diff / 3_600_000;
  if (h < 0) return null;
  const label = h < 1
    ? `Expires in ${Math.round(diff / 60_000)}m`
    : h < 24
    ? `Expires in ${Math.round(h)}h`
    : `Expires in ${Math.floor(h / 24)}d`;
  return (
    <div className="flex justify-center mb-1">
      <span className="text-xs px-2 py-0.5 rounded-full opacity-70"
        style={{ backgroundColor: `${colors.primary}30`, color: colors.textMuted }}>
        ⏳ {label}
      </span>
    </div>
  );
}

export function Layout({
  displayName, bio, avatarUrl,
  activeLinks, socialIcons, coverImageUrl,
  languages, selectedLang, onSelectLang,
  onLinkClick, onSocialClick,
  rtl, isPreview, isPro, showBadge,
}: ThemeLayoutProps) {
  const [comingSoon, setComingSoon] = useState<string | null>(null);

  const langSwitcher = languages.length > 1 && (
    <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
      {languages.map((code) => {
        const lang = getLanguage(code);
        const isSelected = code === selectedLang;
        return (
          <button
            key={code}
            onClick={() => onSelectLang(code)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              isSelected ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-80'
            )}
            style={{
              backgroundColor: isSelected ? colors.primary : `${colors.primary}20`,
              color: isSelected ? colors.background : colors.text,
            }}
          >
            <span>{lang?.flag ?? '🌐'}</span>
            <span>{lang?.nativeName ?? code.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );

  const badge = showBadge && (
    <footer className="py-6 text-center">
      <a
        href="https://heybio.co"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
        style={{ color: colors.primary, fontFamily: spec.fonts.body }}
      >
        <span>Made with</span>
        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
        <span>HeyBio</span>
      </a>
    </footer>
  );

  const overlay = comingSoon && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={() => setComingSoon(null)}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl"
        style={{ backgroundColor: colors.background, fontFamily: spec.fonts.body }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${colors.primary}20` }}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            style={{ color: colors.primary }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-base font-medium mb-5" style={{ color: colors.text }}>{comingSoon}</p>
        <button
          onClick={() => setComingSoon(null)}
          className="w-full py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ backgroundColor: colors.primary, color: colors.linkText }}
        >
          Got it
        </button>
      </div>
    </div>
  );

  const linkList = activeLinks.length > 0 && (
    <div className="flex-1 flex flex-col gap-4">
      {activeLinks.map((link, index) => {
        const showsExpiry = link.expires_at &&
          new Date(link.expires_at).getTime() - Date.now() < 72 * 3_600_000;
        return (
          <div key={index}>
            {showsExpiry && link.expires_at && <ExpiryBadge expiresAt={link.expires_at} />}
            <LinkCard
              link={link}
              theme={spec}
              onClick={() => onLinkClick(index, link.url, link.id)}
              onComingSoon={setComingSoon}
            />
          </div>
        );
      })}
    </div>
  );

  if (!coverImageUrl) {
    return (
      <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: colors.background }} dir={rtl ? 'rtl' : 'ltr'}>
        <div className="w-full h-40 flex items-center justify-center"
          style={{ backgroundColor: `${colors.primary}18` }}>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            Upload a cover photo to complete the Superstar look
          </p>
        </div>
        <main className="flex-1 w-full max-w-lg mx-auto px-6 py-8 flex flex-col gap-4">
          {langSwitcher}
          <ProfileSection displayName={displayName} bio={bio ?? undefined} avatarUrl={avatarUrl ?? undefined} theme={spec} />
          {socialIcons.length > 0 && (
            <SocialBar socialIcons={socialIcons} theme={spec} onIconClick={onSocialClick} onComingSoon={setComingSoon} />
          )}
          {linkList}
        </main>
        {badge}
        {overlay}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden" dir={rtl ? 'rtl' : 'ltr'}>
      <CoverBackground imageUrl={coverImageUrl} isPreview={isPreview} />
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-4">
        <div
          className="w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          style={{
            backgroundColor: colors.background,
            minHeight: isPreview ? undefined : 'calc(100vh - 2rem)',
          }}
        >
          <CoverBanner imageUrl={coverImageUrl} fadeColor={colors.background} />
          <div className="px-6 pb-8 flex-1 flex flex-col gap-4 -mt-12 relative z-10">
            {langSwitcher}
            <ProfileSection
              displayName={displayName}
              bio={bio ?? undefined}
              avatarUrl={avatarUrl ?? undefined}
              theme={spec}
              hasCoverImage
              showVerified={isPro}
            />
            {socialIcons.length > 0 && (
              <SocialBar socialIcons={socialIcons} theme={spec} onIconClick={onSocialClick} onComingSoon={setComingSoon} />
            )}
            {linkList}
          </div>
          {badge}
        </div>
      </div>
      {overlay}
    </div>
  );
}
