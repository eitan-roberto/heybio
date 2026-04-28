import { CoverBackground, CoverBanner } from '../CoverImage';
import type { BioPageLayoutProps } from './types';

function SuperstarBadge({ theme }: { theme: BioPageLayoutProps['theme'] }) {
  return (
    <footer className="py-6 text-center">
      <a
        href="https://heybio.co"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs opacity-70 hover:opacity-100 transition-opacity font-semibold"
        style={{ color: theme.colors.primary }}
      >
        <span>Made with</span>
        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
        <span>HeyBio</span>
      </a>
    </footer>
  );
}

function getBackgroundStyle(theme: BioPageLayoutProps['theme']): React.CSSProperties {
  if (theme.colors.background.startsWith('linear')) {
    return { background: theme.colors.background };
  }
  return { backgroundColor: theme.colors.background };
}

export function SuperstarLayout({
  theme,
  rtl,
  isPreview,
  coverImageUrl,
  showBadge,
  content,
  comingSoonOverlay,
}: BioPageLayoutProps) {
  if (!coverImageUrl) {
    return (
      <div
        className="min-h-screen w-full flex flex-col"
        style={getBackgroundStyle(theme)}
        dir={rtl ? 'rtl' : 'ltr'}
      >
        <div className="w-full h-40 flex items-center justify-center" style={{ backgroundColor: `${theme.colors.primary}18` }}>
          <p className="text-sm" style={{ color: theme.colors.textMuted }}>Upload a cover photo to complete the Superstar look</p>
        </div>
        <main className="flex-1 w-full max-w-lg mx-auto px-6 py-8 flex flex-col gap-4">
          {content}
        </main>
        {comingSoonOverlay}
        {showBadge && <SuperstarBadge theme={theme} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden" dir={rtl ? 'rtl' : 'ltr'}>
      <CoverBackground imageUrl={coverImageUrl} isPreview={isPreview} />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-4">
        <div
          className="w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          style={{ ...getBackgroundStyle(theme), minHeight: isPreview ? undefined : 'calc(100vh - 2rem)' }}
        >
          <CoverBanner imageUrl={coverImageUrl} fadeColor={theme.colors.background} />
          <div className="px-6 pb-8 flex-1 flex flex-col gap-4 -mt-12 relative z-10">
            {content}
          </div>
          {showBadge && <SuperstarBadge theme={theme} />}
        </div>
      </div>

      {comingSoonOverlay}
    </div>
  );
}
