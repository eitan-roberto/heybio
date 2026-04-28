import type { BioPageLayoutProps } from './types';

function getBackgroundStyle(theme: BioPageLayoutProps['theme']): React.CSSProperties {
  if (theme.colors.background.startsWith('linear')) {
    return { background: theme.colors.background };
  }
  return { backgroundColor: theme.colors.background };
}

export function StandardLayout({ theme, rtl, content, badge, comingSoonOverlay }: BioPageLayoutProps) {
  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={getBackgroundStyle(theme)}
      dir={rtl ? 'rtl' : 'ltr'}
    >
      <main className="flex-1 w-full max-w-lg mx-auto px-6 py-12 flex flex-col gap-4">
        {content}
      </main>
      {comingSoonOverlay}
      {badge}
    </div>
  );
}
