'use client';

import { useState } from 'react';
import { ProfileSection } from '../ProfileSection';
import { LinkCard } from '../LinkCard';
import { SocialBar } from '../SocialBar';
import { getLanguage } from '@/lib/languages';
import { cn } from '@/lib/utils';
import type { ComponentType } from 'react';
import type { ThemeSpec, ThemeLayoutProps } from './types';

function bgStyle(colors: ThemeSpec['colors']): React.CSSProperties {
  return colors.background.startsWith('linear')
    ? { background: colors.background }
    : { backgroundColor: colors.background };
}

function contrastOnPrimary(colors: ThemeSpec['colors']): string {
  const hex = colors.primary;
  if (!hex.startsWith('#')) return colors.linkText;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.5 ? '#000000' : '#ffffff';
}

function ExpiryBadge({ expiresAt, colors }: { expiresAt: string; colors: ThemeSpec['colors'] }) {
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
        style={{ backgroundColor: `${colors.primary}20`, color: colors.textMuted }}>
        ⏳ {label}
      </span>
    </div>
  );
}

export function createStandardLayout(spec: ThemeSpec): ComponentType<ThemeLayoutProps> {
  const { colors, fonts } = spec;
  const selectedTextColor = contrastOnPrimary(colors);

  function Layout({
    displayName, bio, avatarUrl,
    activeLinks, socialIcons,
    languages, selectedLang, onSelectLang,
    onLinkClick, onSocialClick,
    rtl, showBadge,
  }: ThemeLayoutProps) {
    const [comingSoon, setComingSoon] = useState<string | null>(null);

    return (
      <div className="min-h-screen w-full flex flex-col" style={bgStyle(colors)} dir={rtl ? 'rtl' : 'ltr'}>
        <main className="flex-1 w-full max-w-lg mx-auto px-6 py-12 flex flex-col gap-4">
          {languages.length > 1 && (
            <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
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
                      color: isSelected ? selectedTextColor : colors.text,
                    }}
                  >
                    <span>{lang?.flag ?? '🌐'}</span>
                    <span>{lang?.nativeName ?? code.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div>
            <ProfileSection
              displayName={displayName}
              bio={bio ?? undefined}
              avatarUrl={avatarUrl ?? undefined}
              theme={spec}
            />
          </div>

          {socialIcons.length > 0 && (
            <div>
              <SocialBar
                socialIcons={socialIcons}
                theme={spec}
                onIconClick={onSocialClick}
                onComingSoon={setComingSoon}
              />
            </div>
          )}

          {activeLinks.length > 0 && (
            <div className="flex-1 flex flex-col gap-4">
              {activeLinks.map((link, index) => {
                const showsExpiry = link.expires_at &&
                  new Date(link.expires_at).getTime() - Date.now() < 72 * 3_600_000;
                return (
                  <div key={index}>
                    {showsExpiry && link.expires_at && (
                      <ExpiryBadge expiresAt={link.expires_at} colors={colors} />
                    )}
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
          )}
        </main>

        {showBadge && (
          <footer className="py-6 text-center">
            <a
              href="https://heybio.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
              style={{ color: colors.primary, fontFamily: fonts.body }}
            >
              <span>Made with</span>
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>HeyBio</span>
            </a>
          </footer>
        )}

        {comingSoon && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setComingSoon(null)}
          >
            <div
              className="w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl"
              style={{
                backgroundColor: colors.background.startsWith('linear') ? '#ffffff' : colors.background,
                fontFamily: fonts.body,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: colors.linkBg }}>
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
                style={{ backgroundColor: colors.linkBg, color: colors.linkText }}
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return Layout;
}
