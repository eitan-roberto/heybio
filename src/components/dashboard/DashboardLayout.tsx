'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { SvgAsset } from '@/components/ui/svgasset';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageSlug?: string;
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: 'layout-dashboard' },
  { href: '/dashboard/edit', label: 'Edit Page', icon: 'link' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: 'bar-chart-2' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'settings' },
];

export function DashboardLayout({ children, pageSlug }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPlan = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('plan')
          .eq('id', user.id)
          .single();
        
        setIsPro(data?.plan === 'pro');
      }
      setLoading(false);
    };
    
    checkPlan();
  }, []);

  return (
    <div className="min-h-screen flex flex-col gap-1">
      {/* Header */}
      <header className="bg-bottom px-4 md:px-6 py-3 rounded-bl-4xl rounded-br-4xl flex items-center justify-between">
        <Link href="/" className="text-pink">
          <SvgAsset src="/logos/logo-full.svg" height={32} />
        </Link>
        
        <div className="flex items-center gap-2">
          {!loading && isPro && (
            <span className="px-3 py-1 rounded-full bg-pink text-top text-xs font-bold">
              PRO
            </span>
          )}
          {pageSlug && (
            <Link href={`/${pageSlug}`} className="hidden md:flex items-center gap-1 text-sm text-high hover:text-top">
              View page
              <Icon icon="external-link" className="w-4 h-4" />
            </Link>
          )}
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <Link href="/login">Log out</Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row gap-1 px-1">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-low rounded-4xl p-4 md:sticky md:top-4">
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl whitespace-nowrap transition-colors font-medium",
                      isActive 
                        ? "bg-green text-top" 
                        : "text-top hover:bg-mid/30"
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
        <main className="flex-1 bg-low rounded-4xl p-4 md:p-8 min-h-[calc(100vh-200px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
