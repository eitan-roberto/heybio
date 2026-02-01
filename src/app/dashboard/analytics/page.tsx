'use client';

import { useState } from 'react';
import { Icon, IconSize } from '@/components/ui/icon';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Demo data
const DEMO_STATS = {
  pageViews: 1234,
  linkClicks: 567,
  uniqueVisitors: 892,
  clickRate: 45.9,
};

const DEMO_DAILY_VIEWS = [
  { date: 'Mon', views: 120, clicks: 45 },
  { date: 'Tue', views: 180, clicks: 78 },
  { date: 'Wed', views: 150, clicks: 62 },
  { date: 'Thu', views: 200, clicks: 95 },
  { date: 'Fri', views: 250, clicks: 120 },
  { date: 'Sat', views: 180, clicks: 85 },
  { date: 'Sun', views: 154, clicks: 82 },
];

const DEMO_TOP_LINKS = [
  { title: 'My YouTube Channel', clicks: 234, percent: 41 },
  { title: 'Latest Blog Post', clicks: 156, percent: 28 },
  { title: 'Book a Call', clicks: 98, percent: 17 },
  { title: 'My Newsletter', clicks: 79, percent: 14 },
];

const DEMO_DEVICES = [
  { device: 'Mobile', percent: 68, icon: 'smartphone' },
  { device: 'Desktop', percent: 28, icon: 'monitor' },
  { device: 'Tablet', percent: 4, icon: 'monitor' },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const isPro = false; // Demo: free user

  const maxViews = Math.max(...DEMO_DAILY_VIEWS.map(d => d.views));

  return (
    <DashboardLayout pageSlug="demo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-top">Analytics</h1>
            <p className="text-top mt-1">
              Track your page performance
            </p>
          </div>
          
          {/* Time range toggle */}
          <div className="flex items-center bg-low rounded-lg p-1">
            <button
              onClick={() => setTimeRange('7d')}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                timeRange === '7d'
                  ? "bg-bottom text-top shadow-sm"
                  : "text-top hover:text-top"
              )}
            >
              7 days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              disabled={!isPro}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1",
                timeRange === '30d'
                  ? "bg-bottom text-top shadow-sm"
                  : "text-top hover:text-top",
                !isPro && "opacity-50 cursor-not-allowed"
              )}
            >
              30 days
              {!isPro && <Icon name="lock" className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-top">
                Page Views
              </CardTitle>
              <Icon name="eye" className="w-4 h-4 text-top" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{DEMO_STATS.pageViews.toLocaleString()}</div>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <Icon name="trending-up" className="w-3 h-3" />
                +12% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-top">
                Link Clicks
              </CardTitle>
              <Icon name="mouse-pointer-click" className="w-4 h-4 text-top" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{DEMO_STATS.linkClicks.toLocaleString()}</div>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <Icon name="trending-up" className="w-3 h-3" />
                +8% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-top">
                Unique Visitors
              </CardTitle>
              <Icon name="globe" className="w-4 h-4 text-top" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{DEMO_STATS.uniqueVisitors.toLocaleString()}</div>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <Icon name="trending-up" className="w-3 h-3" />
                +5% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-top">
                Click Rate
              </CardTitle>
              <Icon name="trending-up" className="w-4 h-4 text-top" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{DEMO_STATS.clickRate}%</div>
              <p className="text-xs text-top mt-1">
                of visitors click a link
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Views & Clicks</CardTitle>
              <CardDescription>Daily breakdown for the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {DEMO_DAILY_VIEWS.map((day) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                    {/* Bars */}
                    <div className="w-full flex gap-1 h-48 items-end">
                      <div 
                        className="flex-1 bg-low rounded-t"
                        style={{ height: `${(day.views / maxViews) * 100}%` }}
                        title={`${day.views} views`}
                      />
                      <div 
                        className="flex-1 bg-blue-500 rounded-t"
                        style={{ height: `${(day.clicks / maxViews) * 100}%` }}
                        title={`${day.clicks} clicks`}
                      />
                    </div>
                    {/* Label */}
                    <span className="text-xs text-top">{day.date}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-low" />
                  <span className="text-top">Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-top">Clicks</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top links */}
          <Card>
            <CardHeader>
              <CardTitle>Top Links</CardTitle>
              <CardDescription>Most clicked links</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DEMO_TOP_LINKS.map((link, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-top truncate">
                        {link.title}
                      </span>
                      <span className="text-sm text-top">
                        {link.clicks}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-low rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${link.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pro features teaser */}
        {!isPro && (
          <Card className="bg-top text-bottom">
            <CardContent className="flex items-center justify-between py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-bottom/10 rounded-xl">
                  <Icon name="sparkles" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Unlock Pro Analytics</h3>
                  <p className="text-sm text-top">
                    30-day history, traffic sources, insights, and more
                  </p>
                </div>
              </div>
              <Button variant="secondary" className="bg-bottom text-top hover:bg-low">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Device breakdown */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Devices</CardTitle>
              <CardDescription>How visitors access your page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DEMO_DEVICES.map((item) => {
                  return (
                    <div key={item.device} className="flex items-center gap-3">
                      <Icon name={item.icon} className="w-5 h-5 text-top" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-top">
                            {item.device}
                          </span>
                          <span className="text-sm text-top">
                            {item.percent}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-low rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-high rounded-full"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Traffic sources - Pro only */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Traffic Sources
                <Icon name="lock" className="w-4 h-4 text-top" />
              </CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Instagram</span>
                  <span className="text-sm text-top">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Twitter</span>
                  <span className="text-sm text-top">28%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Direct</span>
                  <span className="text-sm text-top">18%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Other</span>
                  <span className="text-sm text-top">9%</span>
                </div>
              </div>
            </CardContent>
            <div className="absolute inset-0 flex items-center justify-center bg-bottom/80">
              <div className="text-center">
                <Icon name="lock" className="w-8 h-8 text-top mx-auto mb-2" />
                <p className="text-sm font-medium text-top">Pro feature</p>
                <Button size="sm" className="mt-2">
                  Upgrade
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
