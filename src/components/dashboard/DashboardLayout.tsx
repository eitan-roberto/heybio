'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { createClient } from '@/lib/supabase/client';
import { useDashboardStore, type DashboardPage } from '@/stores/dashboardStore';
import { cn } from '@/lib/utils';
import { analyticsService } from '@/services/analyticsService';
import { logService } from '@/services/logService';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: 'layout-dashboard' },
  { href: '/dashboard/edit', label: 'Edit Page', icon: 'pencil' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: 'bar-chart-2' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'settings' },
];

function PageSelector({
  pages,
  selectedPage,
  onSelect,
}: {
  pages: DashboardPage[];
  selectedPage: DashboardPage | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!selectedPage) return null;

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-low hover:bg-low/80 transition-colors text-sm font-medium text-top"
      >
        <span className="w-2 h-2 rounded-full bg-green flex-shrink-0" />
        <span className="flex-1 truncate text-left">{selectedPage.slug}</span>
        {pages.length > 1 && (
          <Icon icon="chevron-down" className={cn('w-3.5 h-3.5 text-high transition-transform flex-shrink-0', open && 'rotate-180')} />
        )}
      </button>

      {open && pages.length > 1 && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-bottom rounded-2xl shadow-lg border border-low p-1">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => {
                onSelect(page.id);
                setOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors',
                selectedPage.id === page.id ? 'bg-green text-top' : 'text-top hover:bg-low'
              )}
            >
              <span className="flex-1 truncate">{page.slug}</span>
              {selectedPage.id === page.id && <Icon icon="check" className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPro, setIsPro] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const { pages, setPages, selectPage, getSelectedPage } = useDashboardStore();
  const selectedPage = getSelectedPage();

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoadingUser(false);
          return;
        }

        const [{ data: profile }, { data: userPages }] = await Promise.all([
          supabase.from('profiles').select('plan').eq('id', user.id).single(),
          supabase
            .from('pages')
            .select('id, slug, display_name, bio, theme_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
        ]);

        setIsPro(profile?.plan === 'pro');

        if (userPages && userPages.length > 0) {
          setPages(
            userPages.map((p) => ({
              id: p.id,
              slug: p.slug,
              displayName: p.display_name,
              bio: p.bio ?? undefined,
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
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      analyticsService.track('logout_completed', {});
      router.push('/login');
    } catch (err) {
      logService.error('logout_error', { error: err });
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-1">
      <Header>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-full md:w-auto"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </Header>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row gap-1 px-1">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-bottom h-full rounded-4xl p-4 md:sticky md:top-4 flex flex-col gap-3">

            {/* Plan badge + view link */}
            <div className="flex items-center justify-between">
              {loadingUser ? (
                <div className="h-6 w-12 rounded-full bg-low animate-pulse" />
              ) : (
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold',
                  isPro ? 'bg-pink text-top' : 'bg-low text-high'
                )}>
                  {isPro ? 'PRO' : 'Free'}
                </span>
              )}

              {!loadingUser && selectedPage && (
                <Link
                  href={`/${selectedPage.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-high hover:text-top transition-colors"
                >
                  View page
                  <Icon icon="external-link" className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* Page selector */}
            {!loadingUser && (
              <PageSelector
                pages={pages}
                selectedPage={selectedPage}
                onSelect={selectPage}
              />
            )}
            {loadingUser && (
              <div className="h-10 rounded-2xl bg-low animate-pulse" />
            )}

            {/* Divider */}
            <div className="h-px bg-low" />

            {/* Nav */}
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-2xl whitespace-nowrap transition-colors font-medium',
                      isActive ? 'bg-green text-top' : 'text-top hover:bg-low/20'
                    )}
                  >
                    <Icon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 bg-bottom rounded-4xl p-4 md:p-8 min-h-[calc(100vh-200px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
