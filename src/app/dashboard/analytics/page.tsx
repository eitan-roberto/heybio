'use client';

import { useState } from 'react';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { PieChart } from '@/components/dashboard/PieChart';
import { Skeleton } from '@/components/ui/Skeleton';
import { Icon } from '@/components/ui/icon';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { usePageId } from '@/hooks/usePageId';
import { pageAnalyticsService, dateRangeForDays, type DateRange } from '@/services/pageAnalyticsService';
import { formatCount } from '@/lib/utils';
import { cn } from '@/lib/utils';

const PRESET_DAYS = [7, 30] as const;
type PresetDays = (typeof PRESET_DAYS)[number];

// ── Summary cards ──────────────────────────────────────────────────────────

function SummaryCards({ pageId, range }: { pageId: string; range: DateRange }) {
  const { data, loading } = useAnalyticsData(
    () => pageAnalyticsService.getSummary(pageId, range),
    [pageId, range.start, range.end]
  );

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  const cards = [
    { label: 'Views',    value: data?.totalViews ?? 0,      icon: 'eye',                 color: 'bg-green' },
    { label: 'Visitors', value: data?.uniqueVisitors ?? 0,   icon: 'users',               color: 'bg-blue'  },
    { label: 'Clicks',   value: data?.totalClicks ?? 0,      icon: 'mouse-pointer-click', color: 'bg-pink'  },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((c) => (
        <div key={c.label} className={cn('rounded-3xl p-4 md:p-5', c.color)}>
          <Icon icon={c.icon} className="w-4 h-4 text-top mb-2 opacity-70" />
          <div className="text-2xl md:text-3xl font-bold text-top leading-none">{formatCount(c.value)}</div>
          <div className="text-xs font-medium text-top/70 mt-1">{c.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Daily chart ────────────────────────────────────────────────────────────

function DailyChart({ pageId, range }: { pageId: string; range: DateRange }) {
  const { data, loading } = useAnalyticsData(
    () => pageAnalyticsService.getDaily(pageId, range),
    [pageId, range.start, range.end]
  );

  if (loading) return <Skeleton className="h-[260px]" />;

  const chartData = (data ?? []).map((d) => ({
    date: new Date(d.date + 'T12:00:00Z').toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }),
    views: d.views,
    uniqueVisitors: d.uniqueVisitors,
    clicks: d.clicks,
  }));

  return (
    <div>
      <p className="text-sm font-semibold text-top mb-3">Daily activity</p>
      <ActivityChart data={chartData} />
    </div>
  );
}

// ── Pie charts ─────────────────────────────────────────────────────────────

function SourcesPie({ pageId, range }: { pageId: string; range: DateRange }) {
  const { data, loading } = useAnalyticsData(() => pageAnalyticsService.getSources(pageId, range), [pageId, range.start, range.end]);
  return (
    <div>
      <p className="text-sm font-semibold text-top mb-2">Sources</p>
      {loading ? <Skeleton className="h-52" /> : <PieChart title="Sources" data={(data ?? []).map((s) => ({ name: s.source, y: s.count }))} />}
    </div>
  );
}

function CountriesPie({ pageId, range }: { pageId: string; range: DateRange }) {
  const { data, loading } = useAnalyticsData(() => pageAnalyticsService.getCountries(pageId, range), [pageId, range.start, range.end]);
  return (
    <div>
      <p className="text-sm font-semibold text-top mb-2">Countries</p>
      {loading ? <Skeleton className="h-52" /> : <PieChart title="Countries" data={(data ?? []).map((c) => ({ name: c.country, y: c.count }))} />}
    </div>
  );
}

function DevicesPie({ pageId, range }: { pageId: string; range: DateRange }) {
  const { data, loading } = useAnalyticsData(() => pageAnalyticsService.getDevices(pageId, range), [pageId, range.start, range.end]);
  return (
    <div>
      <p className="text-sm font-semibold text-top mb-2">Devices</p>
      {loading ? <Skeleton className="h-52" /> : <PieChart title="Devices" data={(data ?? []).map((d) => ({ name: d.device, y: d.count }))} />}
    </div>
  );
}

function FirstClickPie({ pageId, range }: { pageId: string; range: DateRange }) {
  const { data, loading } = useAnalyticsData(() => pageAnalyticsService.getFirstClicks(pageId, range), [pageId, range.start, range.end]);
  return (
    <div className="md:col-span-3">
      <p className="text-sm font-semibold text-top mb-1">First click</p>
      <p className="text-xs text-mid mb-2">First link each visitor tapped</p>
      {loading ? <Skeleton className="h-52" /> : <PieChart title="First Click" data={(data ?? []).map((d) => ({ name: d.title, y: d.count }))} />}
    </div>
  );
}

// ── Link performance ───────────────────────────────────────────────────────

function LinkPerformance({ pageId, range }: { pageId: string; range: DateRange }) {
  const { data: links, loading } = useAnalyticsData(() => pageAnalyticsService.getLinks(pageId, range), [pageId, range.start, range.end]);
  const now = new Date().toISOString();

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-36" />
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 rounded-2xl" />)}
      </div>
    );
  }

  if (!links?.length) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-top">Link performance</p>
      {links.map((link, i) => (
        <div key={link.id} className="flex items-center gap-3 p-3 bg-bottom border border-low rounded-2xl">
          <span className="text-sm font-bold text-mid w-5 text-center shrink-0">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-top truncate">{link.title}</p>
            <p className="text-xs text-mid truncate">{link.url}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-top">{formatCount(link.clicks)}</p>
            <p className="text-xs text-mid">{link.ctr}% CTR</p>
            {link.is_nsfw && link.nsfw_entered !== undefined && (
              <p className="text-xs text-mid mt-0.5">
                {link.nsfw_entry_rate}% entered final link
              </p>
            )}
          </div>
          <div className="hidden sm:block w-16">
            <div className="h-1.5 bg-low rounded-full overflow-hidden">
              <div className="h-full bg-green rounded-full" style={{ width: `${Math.min(link.ctr * 5, 100)}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const pageId = usePageId();
  const [activeDays, setActiveDays] = useState<PresetDays>(7);
  const range = dateRangeForDays(activeDays);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-top">Stats</h1>
        <div className="flex bg-low/50 rounded-full p-1 gap-1">
          {PRESET_DAYS.map((days) => (
            <button
              key={days}
              onClick={() => setActiveDays(days)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                activeDays === days ? 'bg-top text-bottom' : 'text-high hover:text-top'
              )}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {!pageId ? (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
          <Skeleton className="h-[260px]" />
        </div>
      ) : (
        <>
          <SummaryCards pageId={pageId} range={range} />
          <DailyChart pageId={pageId} range={range} />
          <div className="grid gap-5 md:grid-cols-3">
            <SourcesPie pageId={pageId} range={range} />
            <CountriesPie pageId={pageId} range={range} />
            <DevicesPie pageId={pageId} range={range} />
            <FirstClickPie pageId={pageId} range={range} />
          </div>
          <LinkPerformance pageId={pageId} range={range} />
        </>
      )}
    </div>
  );
}
