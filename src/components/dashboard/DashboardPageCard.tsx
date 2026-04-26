'use client';

import NextLink from 'next/link';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/Skeleton';

export function DashboardPageCard() {
  const page = useDashboardStore((state) => state.getSelectedPage());
  const pages = useDashboardStore((state) => state.pages);

  // Store not hydrated yet (SSR / first paint)
  if (pages.length === 0) {
    return (
      <div className="bg-bottom border border-low rounded-3xl p-4 flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-32 rounded-xl" />
          <Skeleton className="h-3 w-24 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-14 rounded-xl" />
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="bg-bottom border border-low rounded-3xl p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-top flex items-center justify-center text-bottom font-bold text-lg shrink-0 overflow-hidden">
        {page.avatarUrl ? (
          <img src={page.avatarUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          page.displayName.charAt(0).toUpperCase()
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-top truncate">{page.displayName}</p>
        <NextLink
          href={`/${page.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-mid hover:text-top flex items-center gap-1 transition-colors"
        >
          heybio.co/{page.slug}
          <Icon icon="external-link" className="w-3 h-3" />
        </NextLink>
      </div>
      <Button variant="outline" size="sm" asChild>
        <NextLink href="/dashboard/edit">Edit</NextLink>
      </Button>
    </div>
  );
}
