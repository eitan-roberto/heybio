'use client';

import { usePageId } from '@/hooks/usePageId';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { Skeleton } from '@/components/ui/Skeleton';
import { Icon } from '@/components/ui/icon';

interface OverviewStats {
  pageViews: number;
  linkClicks: number;
  clickRate: number;
}

async function fetchOverview(pageId: string): Promise<OverviewStats> {
  const res = await fetch(`/api/analytics/overview?pageId=${pageId}`);
  if (!res.ok) throw new Error('analytics_overview_failed');
  return res.json();
}

export function DashboardStats() {
  const pageId = usePageId();
  const { data: stats, loading } = useAnalyticsData(
    () => (pageId ? fetchOverview(pageId) : Promise.resolve(null)),
    [pageId]
  );

  if (!pageId || loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-3xl p-6 bg-green">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-top">Page Views</span>
          <Icon icon="eye" className="w-5 h-5 text-top" />
        </div>
        <div className="text-3xl font-bold text-top">{stats.pageViews.toLocaleString()}</div>
      </div>

      <div className="rounded-3xl p-6 bg-pink">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-top">Link Clicks</span>
          <Icon icon="mouse-pointer-click" className="w-5 h-5 text-top" />
        </div>
        <div className="text-3xl font-bold text-top">{stats.linkClicks.toLocaleString()}</div>
      </div>

      <div className="rounded-3xl p-6 bg-blue">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-top">Click Rate</span>
          <Icon icon="bar-chart-2" className="w-5 h-5 text-top" />
        </div>
        <div className="text-3xl font-bold text-top">{stats.clickRate}%</div>
      </div>
    </div>
  );
}
