'use client';

import { useState } from 'react';
import { ProfileSection } from '../ProfileSection';
import { SocialBar } from '../SocialBar';
import { Icon } from '@/components/ui/icon';
import { detectLinkIcon, formatUrl } from '@/lib/icons';
import { getLanguage } from '@/lib/languages';
import { cn } from '@/lib/utils';
import type { ThemeSpec, ThemeLayoutProps, ThemeMiniatureProps, ThemeActiveLink } from './types';

const CYAN = '#00f0ff';
const BG = '#080810';

const colors = {
  background: BG,
  text: '#e2e8f0',
  textMuted: 'rgba(226,232,240,0.5)',
  primary: CYAN,
  linkBg: 'rgba(0,240,255,0.04)',
  linkText: '#e2e8f0',
  linkHover: 'rgba(0,240,255,0.10)',
  linkBorder: 'rgba(0,240,255,0.28)',
  socialBg: 'rgba(0,240,255,0.08)',
};

const spec: ThemeSpec = {
  colors,
  fonts: {
    heading: '"Orbitron", "Share Tech Mono", monospace',
    body: '"Inter", system-ui, sans-serif',
  },
  borderRadius: 'sm',
  style: 'glass',
};

export const meta = {
  id: 'gamer',
  name: 'Gamer',
  isPro: true,
  hasCustomLayout: true,
  spec,
};

const GAMER_CSS = `
  @keyframes gamer-scan {
    0%   { transform: translateX(-200%); opacity: 0; }
    5%   { opacity: 1; }
    45%  { transform: translateX(500%); opacity: 0.9; }
    50%  { opacity: 0; transform: translateX(500%); }
    100% { opacity: 0; transform: translateX(500%); }
  }

  @keyframes gamer-glow {
    0%, 100% {
      box-shadow: 0 0 6px rgba(0,240,255,0.18),
                  0 0 1px rgba(0,240,255,0.4),
                  inset 0 0 6px rgba(0,240,255,0.03);
    }
    50% {
      box-shadow: 0 0 16px rgba(0,240,255,0.42),
                  0 0 2px rgba(0,240,255,0.6),
                  inset 0 0 12px rgba(0,240,255,0.07);
    }
  }

  .gamer-link {
    animation: gamer-glow 3s ease-in-out infinite;
    transition: background-color 0.2s ease, transform 0.15s ease !important;
  }

  .gamer-link:hover  { transform: translateY(-1px) scale(1.015) !important; }
  .gamer-link:active { transform: scale(0.98) !important; }

  .gamer-scan-line {
    position: absolute;
    top: 0; bottom: 0; left: 0;
    width: 45%;
    background: linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.14) 50%, transparent 100%);
    pointer-events: none;
    animation: gamer-scan 5s ease-in-out infinite;
  }
`;

function CornerBrackets() {
  const border = '1.5px solid rgba(0,240,255,0.65)';
  const base: React.CSSProperties = { position: 'absolute', width: 8, height: 8, pointerEvents: 'none' };
  return (
    <>
      <span style={{ ...base, top: 5, left: 5,    borderTop: border,    borderLeft: border    }} />
      <span style={{ ...base, top: 5, right: 5,   borderTop: border,    borderRight: border   }} />
      <span style={{ ...base, bottom: 5, left: 5,  borderBottom: border, borderLeft: border   }} />
      <span style={{ ...base, bottom: 5, right: 5, borderBottom: border, borderRight: border  }} />
    </>
  );
}

interface GamerLinkProps {
  link: ThemeActiveLink;
  index: number;
  onClick?: () => void;
  onComingSoon?: (msg: string) => void;
}

function GamerLink({ link, index, onClick, onComingSoon }: GamerLinkProps) {
  const [showNsfw, setShowNsfw] = useState(false);
  const iconName = link.icon || detectLinkIcon(link.url);
  const delay = `${(index * 1.1).toFixed(1)}s`;

  const btnStyle: React.CSSProperties = {
    backgroundColor: colors.linkBg,
    color: colors.linkText,
    border: `1px solid ${colors.linkBorder}`,
    borderRadius: 4,
    fontFamily: spec.fonts.body,
  };

  const inner = (
    <>
      <span className="gamer-scan-line" style={{ animationDelay: delay }} />
      <CornerBrackets />
      <Icon icon={iconName} className="w-5 h-5 flex-shrink-0 relative z-10 opacity-80" />
      <span className="flex-1 font-medium text-center relative z-10" style={{ letterSpacing: '0.04em' }}>
        {link.title}
      </span>
      <Icon icon="external-link" className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-40 transition-opacity relative z-10" />
    </>
  );

  const shared = cn('group gamer-link w-full relative flex items-center gap-3 px-5 py-4 overflow-hidden focus:outline-none');

  if (link.coming_soon_message) {
    return (
      <button type="button" className={shared} style={btnStyle}
        onClick={() => { onClick?.(); onComingSoon?.(link.coming_soon_message!); }}>
        {inner}
      </button>
    );
  }

  if (link.is_nsfw) {
    return (
      <button type="button" className={shared} style={btnStyle}
        onClick={() => !showNsfw && setShowNsfw(true)}>
        <div className={cn('flex items-center gap-3 w-full transition-all duration-300',
          showNsfw ? 'opacity-0 scale-95 absolute inset-0 pointer-events-none' : 'opacity-100')}>
          {inner}
        </div>
        <div className={cn('w-full transition-all duration-300 flex flex-col items-center gap-2 py-1',
          showNsfw ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none')}>
          <span className="text-sm font-medium" style={{ color: colors.textMuted }}>18+ Sensitive Content</span>
          <a href={formatUrl(link.url)} target="_blank" rel="noopener noreferrer"
            className="px-4 py-1.5 rounded text-xs font-semibold"
            style={{ backgroundColor: `${CYAN}20`, color: CYAN, border: `1px solid ${CYAN}50` }}
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
            Continue (+18)
          </a>
        </div>
      </button>
    );
  }

  return (
    <a href={formatUrl(link.url)} target="_blank" rel="noopener noreferrer"
      className={shared} style={btnStyle} onClick={onClick}>
      {inner}
    </a>
  );
}

const GRID_BG = {
  backgroundColor: BG,
  backgroundImage:
    'linear-gradient(rgba(0,240,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.04) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
} satisfies React.CSSProperties;

export function Miniature(_props: ThemeMiniatureProps) {
  return (
    <div className="w-full flex flex-col items-center py-4 px-3 gap-2" style={GRID_BG}>
      <div className="w-8 h-8 rounded-full shrink-0"
        style={{ backgroundColor: '#12122a', border: `1.5px solid rgba(0,240,255,0.45)`,
          boxShadow: '0 0 8px rgba(0,240,255,0.25)' }} />
      <div className="w-16 h-1.5 rounded-sm" style={{ backgroundColor: CYAN, opacity: 0.7 }} />
      {[0, 1].map(i => (
        <div key={i} className="w-full h-5 relative rounded-sm shrink-0"
          style={{ backgroundColor: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.28)',
            boxShadow: '0 0 4px rgba(0,240,255,0.12)' }}>
          {(['tl','tr','bl','br'] as const).map(c => (
            <span key={c} style={{
              position: 'absolute',
              width: 3, height: 3,
              top:    c[0] === 't' ? 2 : undefined,
              bottom: c[0] === 'b' ? 2 : undefined,
              left:   c[1] === 'l' ? 2 : undefined,
              right:  c[1] === 'r' ? 2 : undefined,
              borderTop:    c[0] === 't' ? `1px solid ${CYAN}` : undefined,
              borderBottom: c[0] === 'b' ? `1px solid ${CYAN}` : undefined,
              borderLeft:   c[1] === 'l' ? `1px solid ${CYAN}` : undefined,
              borderRight:  c[1] === 'r' ? `1px solid ${CYAN}` : undefined,
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Layout({
  displayName, bio, avatarUrl,
  activeLinks, socialIcons,
  languages, selectedLang, onSelectLang,
  onLinkClick, onSocialClick,
  rtl, showBadge,
}: ThemeLayoutProps) {
  const [comingSoon, setComingSoon] = useState<string | null>(null);

  const langSwitcher = languages.length > 1 && (
    <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
      {languages.map((code) => {
        const lang = getLanguage(code);
        const active = code === selectedLang;
        return (
          <button key={code} onClick={() => onSelectLang(code)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all"
            style={{
              backgroundColor: active ? `${CYAN}18` : 'transparent',
              color: active ? CYAN : colors.textMuted,
              border: `1px solid ${active ? CYAN + '50' : 'rgba(0,240,255,0.12)'}`,
              opacity: active ? 1 : 0.7,
              fontFamily: spec.fonts.body,
            }}>
            <span>{lang?.flag ?? '🌐'}</span>
            <span>{lang?.nativeName ?? code.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );

  const badge = showBadge && (
    <footer className="py-6 text-center">
      <a href="https://heybio.co" target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
        style={{ color: CYAN, fontFamily: spec.fonts.body }}>
        <span>Made with</span>
        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
        <span>HeyBio</span>
      </a>
    </footer>
  );

  const overlay = comingSoon && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={() => setComingSoon(null)}>
      <div className="w-full max-w-sm rounded p-6 text-center relative overflow-hidden"
        style={{ backgroundColor: '#0d0d1a', border: `1px solid rgba(0,240,255,0.35)`,
          boxShadow: '0 0 32px rgba(0,240,255,0.15)', fontFamily: spec.fonts.body }}
        onClick={(e) => e.stopPropagation()}>
        <CornerBrackets />
        <div className="w-12 h-12 rounded flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${CYAN}12`, border: `1px solid ${CYAN}30` }}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: CYAN }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-base font-medium mb-5" style={{ color: colors.text }}>{comingSoon}</p>
        <button onClick={() => setComingSoon(null)}
          className="w-full py-2.5 rounded text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ backgroundColor: `${CYAN}15`, color: CYAN, border: `1px solid ${CYAN}45` }}>
          Got it
        </button>
      </div>
    </div>
  );

  const linkList = activeLinks.length > 0 && (
    <div className="flex flex-col gap-3">
      {activeLinks.map((link, i) => (
        <GamerLink key={i} link={link} index={i}
          onClick={() => onLinkClick(i, link.url, link.id)}
          onComingSoon={setComingSoon} />
      ))}
    </div>
  );

  return (
    <>
      <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: GAMER_CSS }} />

      <div className="min-h-screen w-full flex flex-col" style={{ ...GRID_BG }} dir={rtl ? 'rtl' : 'ltr'}>
        <main className="flex-1 w-full max-w-lg mx-auto px-6 py-12 flex flex-col gap-5">
          {langSwitcher}
          <ProfileSection
            displayName={displayName}
            bio={bio ?? undefined}
            avatarUrl={avatarUrl ?? undefined}
            theme={spec}
          />
          {socialIcons.length > 0 && (
            <SocialBar socialIcons={socialIcons} theme={spec} onIconClick={onSocialClick} onComingSoon={setComingSoon} />
          )}
          {linkList}
        </main>
        {badge}
        {overlay}
      </div>
    </>
  );
}
