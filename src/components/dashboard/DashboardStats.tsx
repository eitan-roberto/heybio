'use client';

import { usePageId } from '@/hooks/usePageId';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { Skeleton } from '@/components/ui/Skeleton';
import { Icon } from '@/components/ui/icon';
import { formatCount } from '@/lib/utils';

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

const STAT_CARDS = [
  { key: 'pageViews',  label: 'Page views',  icon: 'eye',                  color: 'bg-green' },
  { key: 'linkClicks', label: 'Link clicks',  icon: 'mouse-pointer-click',  color: 'bg-pink'  },
  { key: 'clickRate',  label: 'Click rate',   icon: 'bar-chart-2',          color: 'bg-blue'  },
] as const;

export function DashboardStats() {
  const pageId = usePageId();
  const { data: stats, loading } = useAnalyticsData(
    () => (pageId ? fetchOverview(pageId) : Promise.resolve(null)),
    [pageId]
  );

  if (!pageId || loading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      {STAT_CARDS.map(({ key, label, icon, color }) => {
        const raw = stats[key];
        const display = key === 'clickRate' ? `${raw}%` : formatCount(raw);
        return (
          <div key={key} className={`${color} rounded-3xl p-4 md:p-5`}>
            <Icon icon={icon} className="w-4 h-4 text-top mb-2 opacity-70" />
            <div className="text-2xl md:text-3xl font-bold text-top leading-none">{display}</div>
            <div className="text-xs font-medium text-top/70 mt-1">{label}</div>
          </div>
        );
      })}
    </div>
  );
}
