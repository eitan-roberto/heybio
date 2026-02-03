'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/icon';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface LinkAnalytics {
  id: string;
  title: string;
  url: string;
  clicks: number;
  ctr: number; // Click-through rate
  is_active: boolean;
}

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  clickRate: number;
  links: LinkAnalytics[];
  devices: { device: string; count: number }[];
  dailyStats: { date: string; views: number; clicks: number }[];
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [pageId, setPageId] = useState<string | null>(null);
  const [slug, setSlug] = useState('');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<7 | 30>(7);

  useEffect(() => {
    const loadAnalytics = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!page) {
        setLoading(false);
        return;
      }

      setPageId(page.id);
      setSlug(page.slug);

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - timeRange);
      const since = daysAgo.toISOString();

      // Get page views
      const { data: views } = await supabase
        .from('page_views')
        .select('*')
        .eq('page_id', page.id)
        .gte('timestamp', since);

      // Get all link clicks
      const { data: clicks } = await supabase
        .from('link_clicks')
        .select('*')
        .eq('page_id', page.id)
        .gte('timestamp', since);

      // Get all links for this page
      const { data: links } = await supabase
        .from('links')
        .select('*')
        .eq('page_id', page.id)
        .order('order', { ascending: true });

      // Calculate clicks per link
      const linkClicks: Record<string, number> = {};
      clicks?.forEach(c => {
        if (c.link_id) {
          linkClicks[c.link_id] = (linkClicks[c.link_id] || 0) + 1;
        }
      });

      // Build link analytics
      const linkAnalytics: LinkAnalytics[] = (links || []).map(link => {
        const linkClicksCount = linkClicks[link.id] || 0;
        const linkViews = views?.length || 0;
        return {
          id: link.id,
          title: link.title,
          url: link.url,
          clicks: linkClicksCount,
          ctr: linkViews > 0 ? Math.round((linkClicksCount / linkViews) * 100) : 0,
          is_active: link.is_active,
        };
      }).sort((a, b) => b.clicks - a.clicks);

      // Device stats
      const deviceCounts: Record<string, number> = {};
      views?.forEach(v => {
        const device = v.device || 'desktop';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });

      const devices = Object.entries(deviceCounts)
        .map(([device, count]) => ({ device, count }))
        .sort((a, b) => b.count - a.count);

      // Daily stats
      const dailyMap: Record<string, { views: number; clicks: number }> = {};
      for (let i = 0; i < timeRange; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dailyMap[d.toISOString().split('T')[0]] = { views: 0, clicks: 0 };
      }

      views?.forEach(v => {
        const date = v.timestamp.split('T')[0];
        if (dailyMap[date]) dailyMap[date].views++;
      });

      clicks?.forEach(c => {
        const date = c.timestamp.split('T')[0];
        if (dailyMap[date]) dailyMap[date].clicks++;
      });

      const dailyStats = Object.entries(dailyMap)
        .map(([date, stats]) => ({
          date: new Date(date).toLocaleDateString('en', { weekday: 'short' }),
          ...stats,
        }))
        .reverse();

      setData({
        totalViews: views?.length || 0,
        totalClicks: clicks?.length || 0,
        clickRate: views?.length ? Math.round((clicks?.length || 0) / views.length * 100) : 0,
        links: linkAnalytics,
        devices,
        dailyStats,
      });

      setLoading(false);
    };

    loadAnalytics();
  }, [timeRange]);

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

  const maxDaily = Math.max(...data.dailyStats.map(d => d.views), 1);
  const totalLinkClicks = data.links.reduce((sum, link) => sum + link.clicks, 0);

  return (
    <DashboardLayout pageSlug={slug}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-top">Analytics</h1>
          <div className="flex gap-2 bg-bottom rounded-full p-1">
            {[7, 30].map((days) => (
              <button
                key={days}
                onClick={() => setTimeRange(days as 7 | 30)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  timeRange === days ? 'bg-green text-top' : 'text-high hover:bg-low'
                )}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-4xl p-6 bg-green">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-top">Page Views</span>
              <Icon icon="eye" className="w-5 h-5 text-top" />
            </div>
            <div className="text-3xl font-bold text-top">{data.totalViews.toLocaleString()}</div>
          </div>

          <div className="rounded-4xl p-6 bg-pink">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-top">Link Clicks</span>
              <Icon icon="mouse-pointer-click" className="w-5 h-5 text-top" />
            </div>
            <div className="text-3xl font-bold text-top">{totalLinkClicks.toLocaleString()}</div>
          </div>

          <div className="rounded-4xl p-6 bg-blue">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-top">Click Rate</span>
              <Icon icon="bar-chart-2" className="w-5 h-5 text-top" />
            </div>
            <div className="text-3xl font-bold text-top">{data.clickRate}%</div>
          </div>
        </div>

        {/* Daily Activity Chart */}
        <div className="rounded-4xl p-6 bg-bottom">
          <h3 className="font-semibold text-top mb-4">Daily Activity</h3>
          <div className="flex items-end gap-2 h-48">
            {data.dailyStats.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1">
                  <div
                    className="flex-1 bg-green rounded-t"
                    style={{ height: `${(day.views / maxDaily) * 100}px` }}
                  />
                  <div
                    className="flex-1 bg-pink rounded-t"
                    style={{ height: `${(day.clicks / maxDaily) * 100}px` }}
                  />
                </div>
                <span className="text-xs text-high">{day.date}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green rounded" />
              <span className="text-sm text-high">Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pink rounded" />
              <span className="text-sm text-high">Clicks</span>
            </div>
          </div>
        </div>

        {/* Individual Link Analytics */}
        <div className="rounded-4xl p-6 bg-bottom">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-top">Link Performance</h3>
            <span className="text-sm text-high">{data.links.length} links</span>
          </div>
          
          {data.links.length > 0 ? (
            <div className="space-y-3">
              {data.links.map((link, i) => (
                <div key={link.id} className="flex items-center gap-4 p-3 rounded-3xl bg-low">
                  {/* Rank */}
                  <span className="text-lg font-bold text-high w-8 text-center">
                    {i + 1}
                  </span>
                  
                  {/* Link Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-top truncate">{link.title}</p>
                      {!link.is_active && (
                        <span className="px-2 py-0.5 rounded-full bg-orange/20 text-orange text-xs">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-high truncate">{link.url}</p>
                  </div>
                  
                  {/* Stats */}
                  <div className="text-right">
                    <p className="font-bold text-top">{link.clicks}</p>
                    <p className="text-xs text-high">clicks</p>
                  </div>
                  
                  {/* CTR */}
                  <div className="text-right min-w-[60px]">
                    <p className="font-bold text-top">{link.ctr}%</p>
                    <p className="text-xs text-high">CTR</p>
                  </div>
                  
                  {/* Progress bar */}
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
          <div className="rounded-4xl p-6 bg-bottom">
            <h3 className="font-semibold text-top mb-4">Devices</h3>
            <div className="flex gap-4">
              {data.devices.map((d) => (
                <div key={d.device} className="flex items-center gap-2">
                  <Icon icon={d.device === 'mobile' ? 'smartphone' : d.device === 'tablet' ? 'tablet' : 'monitor'} className="w-5 h-5 text-high" />
                  <span className="text-high capitalize">{d.device}</span>
                  <span className="text-top font-medium">{Math.round(d.count / data.totalViews * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
