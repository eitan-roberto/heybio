'use client';

import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@/components/ui/icon';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { createClient } from '@/lib/supabase/client';
import { useDashboardStore } from '@/stores/dashboardStore';
import { cn } from '@/lib/utils';
import { ActivityChart } from '@/components/dashboard/ActivityChart';

interface LinkAnalytics {
  id: string;
  title: string;
  url: string;
  clicks: number;
  ctr: number;
  is_active: boolean;
  expires_at?: string | null;
}

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  totalClicks: number;
  links: LinkAnalytics[];
  devices: { device: string; count: number }[];
  dailyStats: { date: string; views: number; clicks: number; uniqueVisitors: number }[];
}

export default function AnalyticsPage() {
  const { getSelectedPage } = useDashboardStore();
  const selectedPage = getSelectedPage();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<7 | 30>(7);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Get the page: selected from store or first page
    let page;
    if (selectedPage) {
      const { data: p } = await supabase
        .from('pages')
        .select('*')
        .eq('id', selectedPage.id)
        .single();
      page = p;
    } else {
      const { data: pages } = await supabase
        .from('pages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      page = pages?.[0] ?? null;
    }

    if (!page) {
      setLoading(false);
      return;
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - timeRange);
    const since = daysAgo.toISOString();

    const [{ data: views }, { data: clicks }, { data: links }] = await Promise.all([
      supabase.from('page_views').select('*').eq('page_id', page.id).gte('created_at', since),
      supabase.from('link_clicks').select('*').eq('page_id', page.id).gte('created_at', since),
      supabase.from('links').select('*').eq('page_id', page.id).order('order', { ascending: true }),
    ]);

    // Clicks per link
    const linkClickMap: Record<string, number> = {};
    clicks?.forEach((c) => {
      if (c.link_id) linkClickMap[c.link_id] = (linkClickMap[c.link_id] ?? 0) + 1;
    });

    const linkAnalytics: LinkAnalytics[] = (links ?? [])
      .map((link) => {
        const linkClicksCount = linkClickMap[link.id] ?? 0;
        const linkViews = views?.length ?? 0;
        return {
          id: link.id,
          title: link.title,
          url: link.url,
          clicks: linkClicksCount,
          ctr: linkViews > 0 ? Math.round((linkClicksCount / linkViews) * 100) : 0,
          is_active: link.is_active,
          expires_at: link.expires_at ?? null,
        };
      })
      .sort((a, b) => b.clicks - a.clicks);

    // Device stats
    const deviceCounts: Record<string, number> = {};
    views?.forEach((v) => {
      const device = v.device ?? 'desktop';
      deviceCounts[device] = (deviceCounts[device] ?? 0) + 1;
    });
    const devices = Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count);

    // Daily stats
    const dailyMap: Record<string, { views: number; clicks: number; visitorIds: Set<string> }> = {};
    for (let i = 0; i < timeRange; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().split('T')[0]] = { views: 0, clicks: 0, visitorIds: new Set() };
    }
    views?.forEach((v) => {
      const date = v.created_at?.split('T')[0];
      if (date && dailyMap[date]) {
        dailyMap[date].views++;
        if (v.visitor_id) dailyMap[date].visitorIds.add(v.visitor_id);
      }
    });
    clicks?.forEach((c) => {
      const date = c.created_at?.split('T')[0];
      if (date && dailyMap[date]) dailyMap[date].clicks++;
    });

    const dailyStats = Object.entries(dailyMap)
      .map(([date, { views, clicks, visitorIds }]) => ({
        date: new Date(date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }),
        views,
        clicks,
        uniqueVisitors: visitorIds.size,
      }))
      .reverse();

    const totalClicks = clicks?.length ?? 0;
    const totalViews = views?.length ?? 0;
    const uniqueVisitors = new Set(
      (views ?? []).map((v) => v.visitor_id).filter(Boolean)
    ).size;

    setData({
      totalViews,
      uniqueVisitors,
      totalClicks,
      links: linkAnalytics,
      devices,
      dailyStats,
    });
    setLoading(false);
  }, [selectedPage?.id, timeRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Icon icon="loader-2" className="w-8 h-8 animate-spin text-mid" />
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-top">No data yet</h2>
          <p className="text-high">Share your page to start seeing analytics</p>
        </div>
      </DashboardLayout>
    );
  }

  const totalLinkClicks = data.links.reduce((sum, l) => sum + l.clicks, 0);
  const now = new Date().toISOString();
  const temporaryLinks = data.links.filter((l) => l.expires_at);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-top">Analytics</h1>
          <div className="flex gap-2 bg-bottom rounded-full p-1">
            {([7, 30] as const).map((days) => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  timeRange === days ? 'bg-green text-top' : 'text-high hover:bg-low'
                )}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          <div className="rounded-4xl p-6 bg-green">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-top">Page Views</span>
              <Icon icon="eye" className="w-5 h-5 text-top" />
            </div>
            <div className="text-3xl font-bold text-top">{data.totalViews.toLocaleString()}</div>
          </div>

          <div className="rounded-4xl p-6 bg-blue">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-top">Unique Visitors</span>
              <Icon icon="users" className="w-5 h-5 text-top" />
            </div>
            <div className="text-3xl font-bold text-top">{data.uniqueVisitors.toLocaleString()}</div>
          </div>

          <div className="rounded-4xl p-6 bg-pink">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-top">Link Clicks</span>
              <Icon icon="mouse-pointer-click" className="w-5 h-5 text-top" />
            </div>
            <div className="text-3xl font-bold text-top">{totalLinkClicks.toLocaleString()}</div>
          </div>

        </div>

        {/* Daily Activity Chart */}
        <div className="rounded-4xl py-6">
          <h3 className="font-semibold text-top mb-4">Daily Activity</h3>
          <ActivityChart data={data.dailyStats} />
        </div>

        {/* Temporary Links Section */}
        {temporaryLinks.length > 0 && (
          <div className="rounded-4xl py-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="clock" className="w-5 h-5 text-high" />
              <h3 className="font-semibold text-top">Temporary Links</h3>
            </div>
            <div className="space-y-3">
              {temporaryLinks.map((link) => {
                const isExpired = link.expires_at! < now;
                const expiresDate = new Date(link.expires_at!);
                return (
                  <div key={link.id} className="flex items-center gap-4 p-3 rounded-3xl border border-2 border-top">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-top truncate">{link.title}</p>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs',
                            isExpired ? 'bg-orange/20 text-orange' : 'bg-yellow/20 text-yellow-700'
                          )}
                        >
                          {isExpired ? 'Expired' : 'Active'}
                        </span>
                      </div>
                      <p className="text-xs text-high">
                        {isExpired ? 'Expired' : 'Expires'}{' '}
                        {expiresDate.toLocaleString('en', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-top">{link.clicks}</p>
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

        {/* Individual Link Analytics */}
        <div className="rounded-4xl py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-top">Link Performance</h3>
            <span className="text-sm text-high">{data.links.length} links</span>
          </div>

          {data.links.length > 0 ? (
            <div className="space-y-3">
              {data.links.map((link, i) => (
                <div key={link.id} className="flex items-center gap-4 p-3 rounded-3xl border border-2 border-top">
                  <span className="text-lg font-bold text-high w-8 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-top truncate">{link.title}</p>
                      {!link.is_active && (
                        <span className="px-2 py-0.5 rounded-full bg-orange/20 text-orange text-xs">
                          Hidden
                        </span>
                      )}
                      {link.expires_at && (
                        <span className="px-2 py-0.5 rounded-full bg-yellow/20 text-yellow-700 text-xs">
                          ⏳ Temp
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-high truncate">{link.url}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-top">{link.clicks}</p>
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
          ) : (
            <p className="text-high text-center py-8">No links yet</p>
          )}
        </div>

        {/* Devices */}
        {data.devices.length > 0 && (
          <div className="rounded-4xl py-6">
            <h3 className="font-semibold text-top mb-4">Devices</h3>
            <div className="flex gap-6 flex-wrap">
              {data.devices.map((d) => (
                <div key={d.device} className="flex items-center gap-2">
                  <Icon
                    icon={
                      d.device === 'mobile' ? 'smartphone' : d.device === 'tablet' ? 'tablet' : 'monitor'
                    }
                    className="w-5 h-5 text-high"
                  />
                  <span className="text-high capitalize">{d.device}</span>
                  <span className="text-top font-medium">
                    {data.totalViews > 0 ? Math.round((d.count / data.totalViews) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
