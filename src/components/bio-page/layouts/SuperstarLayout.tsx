import { CoverBackground, CoverBanner } from '../CoverImage';
import type { BioPageLayoutProps } from './types';

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
  content,
  badge,
  comingSoonOverlay,
}: BioPageLayoutProps) {
  if (!coverImageUrl) {
    // No cover uploaded yet — show placeholder
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
        {badge}
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
          {badge}
        </div>
      </div>

      {comingSoonOverlay}
    </div>
  );
}
