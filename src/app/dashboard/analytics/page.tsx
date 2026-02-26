'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { PieChart } from '@/components/dashboard/PieChart';
import { Skeleton } from '@/components/ui/Skeleton';
import { Icon } from '@/components/ui/icon';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { usePageId } from '@/hooks/usePageId';
import {
  pageAnalyticsService,
  dateRangeForDays,
  type DateRange,
} from '@/services/pageAnalyticsService';
import { cn } from '@/lib/utils';

// ─── Time range selector ─────────────────────────────────────────────────────

const PRESET_DAYS = [7, 30] as const;
type PresetDays = (typeof PRESET_DAYS)[number];

function TimeRangeSelector({
  activeDays,
  onChange,
}: {
  activeDays: PresetDays;
  onChange: (days: PresetDays) => void;
}) {
  return (
    <div className="flex gap-2 bg-bottom rounded-full p-1">
      {PRESET_DAYS.map((days) => (
        <button
          key={days}
          onClick={() => onChange(days)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeDays === days ? 'bg-green text-top' : 'text-high hover:bg-low'
          )}
        >
          {days} days
        </button>
      ))}
    </div>
  );
}

// ─── Summary cards ───────────────────────────────────────────────────────────

function SummaryCards({ pageId, range }: { pageId: string; range: DateRange }) {
  const { data, loading } = useAnalyticsData(
    () => pageAnalyticsService.getSummary(pageId, range),
    [pageId, range.start, range.end]
  );

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    );
  }

  const cards = [
    { label: 'Page Views', value: data?.totalViews ?? 0, icon: 'eye', color: 'bg-green' },
    { label: 'Unique Visitors', value: data?.uniqueVisitors ?? 0, icon: 'users', color: 'bg-blue' },
    { label: 'Link Clicks', value: data?.totalClicks ?? 0, icon: 'mouse-pointer-click', color: 'bg-pink' },
  ] as const;

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className={cn('rounded-4xl p-6', c.color)}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-top">{c.label}</span>
            <Icon icon={c.icon} className="w-5 h-5 text-top" />
          </div>
          <div className="text-3xl font-bold text-top">{c.value.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Daily activity chart ────────────────────────────────────────────────────

function DailyChart({ pageId, range }: { pageId: string; range: DateRange }) {
  const { data, loading } = useAnalyticsData(
    () => pageAnalyticsService.getDaily(pageId, range),
    [pageId, range.start, range.end]
  );

  if (loading) return <Skeleton className="h-[320px]" />;

  const chartData = (data ?? []).map((d) => ({
    // Append T12:00:00Z so Date parsing is UTC-noon — avoids off-by-one from locale timezone
    date: new Date(d.date + 'T12:00:00Z').toLocaleDateString('en', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
    views: d.views,
    uniqueVisitors: d.uniqueVisitors,
    clicks: d.clicks,
  }));

  return (
    <div className="rounded-4xl py-6">
      <h3 className="font-semibold text-top mb-4">Daily Activity</h3>
      <ActivityChart data={chartData} />
    </div>
  );
}

// ─── Pie charts ──────────────────────────────────────────────────────────────

function SourcesPie({ pageId, range }: { pageId: string; range: DateRange }) {
  const { data, loading } = useAnalyticsData(
    () => pageAnalyticsService.getSources(pageId, range),
    [pageId, range.start, range.end]
  );
  return (
    <div className="rounded-4xl bg-bottom">
      <h3 className="font-semibold text-top mb-2">Traffic Sources</h3>
      {loading ? (
        <Skeleton className="h-[220px] mt-2" />
      ) : (
        <PieChart title="Sources" data={(data ?? []).map((s) => ({ name: s.source, y: s.count }))} />
      )}
    </div>
  );
}

function CountriesPie({ pageId, range }: { pageId: string; range: DateRange }) {
  const { data, loading } = useAnalyticsData(
    () => pageAnalyticsService.getCountries(pageId, range),
    [pageId, range.start, range.end]
  );
  return (
    <div className="rounded-4xl bg-bottom">
      <h3 className="font-semibold text-top mb-2">Countries</h3>
      {loading ? (
        <Skeleton className="h-[220px] mt-2" />
      ) : (
        <PieChart title="Countries" data={(data ?? []).map((c) => ({ name: c.country, y: c.count }))} />
      )}
    </div>
  );
}

function DevicesPie({ pageId, range }: { pageId: string; range: DateRange }) {
  const { data, loading } = useAnalyticsData(
    () => pageAnalyticsService.getDevices(pageId, range),
    [pageId, range.start, range.end]
  );
  return (
    <div className="rounded-4xl bg-bottom">
      <h3 className="font-semibold text-top mb-2">Devices</h3>
      {loading ? (
        <Skeleton className="h-[220px] mt-2" />
      ) : (
        <PieChart title="Devices" data={(data ?? []).map((d) => ({ name: d.device, y: d.count }))} />
      )}
    </div>
  );
}

// ─── Link performance ────────────────────────────────────────────────────────

function LinkPerformance({ pageId, range }: { pageId: string; range: DateRange }) {
  const { data: links, loading } = useAnalyticsData(
    () => pageAnalyticsService.getLinks(pageId, range),
    [pageId, range.start, range.end]
  );

  const now = new Date().toISOString();

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (!links?.length) return null;

  const temporaryLinks = links.filter((l) => l.expires_at);

  return (
    <div className="space-y-6">
      {temporaryLinks.length > 0 && (
        <div className="rounded-4xl py-6">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon="clock" className="w-5 h-5 text-high" />
            <h3 className="font-semibold text-top">Temporary Links</h3>
          </div>
          <div className="space-y-3">
            {temporaryLinks.map((link) => {
              const isExpired = !!link.expires_at && link.expires_at < now;
              return (
                <div key={link.id} className="flex items-center gap-4 p-3 rounded-3xl border-2 border-top">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-top truncate">{link.title}</p>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs', isExpired ? 'bg-orange/20 text-orange' : 'bg-yellow/20 text-yellow-700')}>
                        {isExpired ? 'Expired' : 'Active'}
                      </span>
                    </div>
                    <p className="text-xs text-high">
                      {isExpired ? 'Expired' : 'Expires'}{' '}
                      {new Date(link.expires_at!).toLocaleString('en', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-top">{link.clicks.toLocaleString()}</p>
                    <p className="text-xs text-high">clicks</p>
                  </div>
                  <div className="text-right min-w-[50px]">
                    <p className="font-bold text-top">{link.ctr}%</p>
                    <p className="text-xs text-high">CTR</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-4xl py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-top">Link Performance</h3>
          <span className="text-sm text-high">{links.length} links</span>
        </div>
        <div className="space-y-3">
          {links.map((link, i) => (
            <div key={link.id} className="flex items-center gap-4 p-3 rounded-3xl border-2 border-top">
              <span className="text-lg font-bold text-high w-8 text-center">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-top truncate">{link.title}</p>
                  {!link.is_active && (
                    <span className="px-2 py-0.5 rounded-full bg-orange/20 text-orange text-xs">Hidden</span>
                  )}
                  {link.expires_at && (
                    <span className="px-2 py-0.5 rounded-full bg-yellow/20 text-yellow-700 text-xs">⏳ Temp</span>
                  )}
                </div>
                <p className="text-sm text-high truncate">{link.url}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-top">{link.clicks.toLocaleString()}</p>
                <p className="text-xs text-high">clicks</p>
              </div>
              <div className="text-right min-w-[60px]">
                <p className="font-bold text-top">{link.ctr}%</p>
                <p className="text-xs text-high">CTR</p>
              </div>
              <div className="hidden sm:block w-24">
                <div className="h-2 bg-mid/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green rounded-full transition-all"
                    style={{ width: `${Math.min(link.ctr * 5, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Full page skeleton ──────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-[320px]" />
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Skeleton className="h-[280px]" />
        <Skeleton className="h-[280px]" />
        <Skeleton className="h-[280px]" />
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const pageId = usePageId();
  const [activeDays, setActiveDays] = useState<PresetDays>(7);

  // Derive the date range from the active preset.
  // Computed fresh on every render so it's always "last N days from now".
  const range = dateRangeForDays(activeDays);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-top">Analytics</h1>
          <TimeRangeSelector activeDays={activeDays} onChange={setActiveDays} />
        </div>

        {/* Always render skeleton until pageId is resolved — avoids hydration mismatch */}
        {!pageId ? (
          <PageSkeleton />
        ) : (
          <>
            <SummaryCards pageId={pageId} range={range} />
            <DailyChart pageId={pageId} range={range} />
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <SourcesPie pageId={pageId} range={range} />
              <CountriesPie pageId={pageId} range={range} />
              <DevicesPie pageId={pageId} range={range} />
            </div>
            <LinkPerformance pageId={pageId} range={range} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
