'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SvgAsset } from '@/components/ui/svgasset';
import { createClient } from '@/lib/supabase/client';
import { useDashboardStore, type DashboardPage } from '@/stores/dashboardStore';
import { cn } from '@/lib/utils';
import { analyticsService } from '@/services/analyticsService';
import { logService } from '@/services/logService';
import { useSubscription } from '@/hooks/useSubscription';

const NAV_ITEMS = [
  { href: '/dashboard',            label: 'Overview', icon: 'layout-dashboard' },
  { href: '/dashboard/edit',       label: 'Edit',     icon: 'pencil'           },
  { href: '/dashboard/analytics',  label: 'Stats',    icon: 'bar-chart-2'      },
  { href: '/dashboard/settings',   label: 'Settings', icon: 'settings'         },
];

// ── Page Selector ─────────────────────────────────────────────────────────────

function PageSelector({
  pages,
  selectedPage,
  onSelect,
  twoLine = false,
}: {
  pages: DashboardPage[];
  selectedPage: DashboardPage | null;
  onSelect: (id: string) => void;
  twoLine?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!selectedPage) return null;

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <button
        onClick={() => pages.length > 1 && setOpen((v) => !v)}
        className={cn(
          'w-full flex items-center gap-2 px-3 rounded-xl text-sm font-medium text-top transition-colors',
          twoLine ? 'py-2.5' : 'py-2',
          'bg-low/50 hover:bg-low',
          pages.length <= 1 && 'cursor-default'
        )}
      >
        <span className="w-2 h-2 rounded-full bg-green shrink-0" />
        {twoLine ? (
          <span className="flex-1 text-left min-w-0">
            <span className="block text-xs text-mid font-normal">heybio.co/</span>
            <span className="block truncate">{selectedPage.slug}</span>
          </span>
        ) : (
          <span className="flex-1 truncate text-left">heybio.co/{selectedPage.slug}</span>
        )}
        {pages.length > 1 && (
          <Icon
            icon="chevron-down"
            className={cn('w-3.5 h-3.5 text-mid transition-transform shrink-0', open && 'rotate-180')}
          />
        )}
      </button>

      {open && pages.length > 1 && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-bottom rounded-2xl shadow-xl border border-low p-1">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => { onSelect(page.id); setOpen(false); }}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-colors',
                selectedPage.id === page.id
                  ? 'bg-top text-bottom font-semibold'
                  : 'text-top hover:bg-low'
              )}
            >
              <span className="flex-1 truncate">/{page.slug}</span>
              {selectedPage.id === page.id && (
                <Icon icon="check" className="w-3.5 h-3.5 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [isPro, setIsPro]             = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const subscription = useSubscription();

  const { pages, setPages, selectPage, getSelectedPage } = useDashboardStore();
  const selectedPage = getSelectedPage();

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoadingUser(false); return; }

        const [{ data: profile }, { data: userPages }] = await Promise.all([
          supabase.from('profiles').select('plan').eq('id', user.id).single(),
          supabase
            .from('pages')
            .select('id, slug, display_name, bio, avatar_url, theme_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
        ]);

        setIsPro(profile?.plan === 'pro');

        if (userPages?.length) {
          setPages(
            userPages.map((p) => ({
              id: p.id,
              slug: p.slug,
              displayName: p.display_name,
              bio: p.bio ?? undefined,
              avatarUrl: p.avatar_url ?? undefined,
              themeId: p.theme_id,
            }))
          );
        }
      } catch (err) {
        logService.error('dashboard_init_error', { error: err });
      } finally {
        setLoadingUser(false);
      }
    };
    init();
  }, [setPages]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    analyticsService.track('logout_completed', {});
    router.push('/login');
  };

  return (
    <div className="min-h-[100dvh]">

      {/* ── Mobile top bar ─────────────────────────────── */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-bottom border-b border-low flex items-center gap-3 px-4">
        <Link href="/" className="shrink-0 text-pink">
          <SvgAsset src="/logos/logo-full.svg" height={26} />
        </Link>

        {loadingUser ? (
          <div className="flex-1 h-8 rounded-xl bg-low animate-pulse" />
        ) : (
          <PageSelector pages={pages} selectedPage={selectedPage} onSelect={selectPage} />
        )}

        {selectedPage && !loadingUser && (
          <Link
            href={`/${selectedPage.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-9 h-9 rounded-xl bg-low/50 flex items-center justify-center hover:bg-low transition-colors"
            aria-label="View live page"
          >
            <Icon icon="external-link" className="w-4 h-4 text-high" />
          </Link>
        )}
      </header>

      {/* ── Desktop: centered sidebar + content ────────── */}
      <div className="hidden md:flex max-w-[1200px] mx-auto min-h-[100dvh]">

        {/* Sidebar — sticky so it travels with the centered container */}
        <aside className="w-56 shrink-0 sticky top-0 h-screen flex flex-col bg-bottom border-l border-r border-low overflow-y-auto z-40">
          <div className="flex flex-col h-full p-4 gap-4">

            {/* Logo + plan badge */}
            <div className="flex items-center justify-between pt-1 pb-1">
              <Link href="/" className="text-pink">
                <SvgAsset src="/logos/logo-full.svg" height={28} />
              </Link>
              {!loadingUser && (
                <Badge variant={isPro ? 'pro' : 'free'}>
                  {isPro ? 'PRO' : 'Free'}
                </Badge>
              )}
            </div>

            {/* Page selector */}
            {loadingUser ? (
              <div className="h-10 rounded-xl bg-low animate-pulse" />
            ) : selectedPage ? (
              <div className="flex flex-col gap-2">
                <PageSelector pages={pages} selectedPage={selectedPage} onSelect={selectPage} twoLine />
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link
                    href={`/${selectedPage.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon icon="external-link" className="w-3.5 h-3.5" />
                    View live page
                  </Link>
                </Button>
              </div>
            ) : null}

            <div className="h-px bg-low" />

            {/* Nav links */}
            <nav className="flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-sm',
                      isActive
                        ? 'bg-top text-bottom'
                        : 'text-high hover:bg-low hover:text-top'
                    )}
                  >
                    <Icon icon={item.icon} className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex-1" />

            {subscription.isTrialing && subscription.trialDaysLeft !== null && (
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-pink/20 hover:bg-pink/30 transition-colors text-sm"
              >
                <Icon icon="clock" className="w-4 h-4 text-pink shrink-0" />
                <span className="text-top font-medium">{subscription.trialDaysLeft}d trial left</span>
              </Link>
            )}

            {!isPro && !loadingUser && !subscription.isTrialing && (
              <Link
                href="/checkout/start"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-pink/10 hover:bg-pink/20 transition-colors text-sm border border-pink/20"
              >
                <Icon icon="sparkles" className="w-4 h-4 text-pink shrink-0" />
                <span className="text-top font-medium">Try Pro free</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-high hover:bg-low hover:text-top transition-colors font-medium text-sm"
            >
              <Icon icon="log-out" className="w-4 h-4 shrink-0" />
              Log out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 border-r border-low">
          <div className="p-8 max-w-4xl">
            {children}
          </div>
        </main>
      </div>

      {/* ── Trial banner (mobile) ──────────────────────── */}
      {subscription.isTrialing && subscription.trialDaysLeft !== null && (
        <div className="md:hidden fixed top-14 inset-x-0 z-30 bg-pink px-4 py-1.5 flex items-center justify-between">
          <p className="text-xs font-medium text-top">
            Trial ends in {subscription.trialDaysLeft} day{subscription.trialDaysLeft !== 1 ? 's' : ''}
          </p>
          <Link href="/dashboard/settings" className="text-xs font-bold text-top underline">Manage</Link>
        </div>
      )}

      {/* ── Mobile: main content ───────────────────────── */}
      <main className={cn('md:hidden pb-24 min-h-[100dvh]', subscription.isTrialing ? 'pt-[calc(3.5rem+32px)]' : 'pt-14')}>
        <div className="p-4">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom nav ──────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-bottom border-t border-low flex"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors',
                isActive ? 'text-top' : 'text-mid'
              )}
            >
              <Icon icon={item.icon} className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
