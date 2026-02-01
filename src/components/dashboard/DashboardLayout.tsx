'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, IconSize } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    plan: 'free' | 'pro';
  };
  pageSlug?: string;
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: 'layout-dashboard' },
  { href: '/dashboard/edit', label: 'Edit Page', icon: 'link' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: 'bar-chart-2' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'settings' },
];

export function DashboardLayout({ children, user, pageSlug }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Demo user for now
  const currentUser = user || {
    name: 'Demo User',
    email: 'demo@heybio.co',
    plan: 'free' as const,
  };

  const initials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-bottom">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-top/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64border-r border-low z-50",
        "transform transition-transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-4 border-b border-low flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              HeyBio
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-top hover:text-top"
            >
              <Icon icon="x" className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-low text-top"
                          : "text-top hover:bg-bottom hover:text-top"
                      )}
                    >
                      <Icon icon={item.icon} className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Page link */}
          {pageSlug && (
            <div className="px-3 py-4 border-t border-low">
              <a
                href={`/${pageSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm text-top hover:text-top transition-colors"
              >
                <Icon icon="external-link" className="w-4 h-4" />
                View your page
              </a>
            </div>
          )}

          {/* Pro upgrade (for free users) */}
          {currentUser.plan === 'free' && (
            <div className="px-3 py-4 border-t border-low">
              <Link
                href="/dashboard/upgrade"
                className="flex items-center gap-2 px-3 py-2 bg-top text-bottom rounded-lg text-sm font-medium hover:bg-high transition-colors"
              >
                <Icon icon="sparkles" className="w-4 h-4" />
                Upgrade to Pro
              </Link>
            </div>
          )}

          {/* User menu */}
          <div className="px-3 py-4 border-t border-low">
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar className="w-8 h-8">
                {currentUser.avatarUrl && (
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                )}
                <AvatarFallback className="text-xs bg-low text-top">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-top truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-top truncate">
                  {currentUser.email}
                </p>
              </div>
              <button className="p-1 text-top hover:text-top">
                <Icon icon="log-out" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-30border-b border-low lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-top hover:text-top"
            >
              <Icon icon="menu" className="w-5 h-5" />
            </button>
            <span className="text-lg font-semibold">HeyBio</span>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs bg-low text-top">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
