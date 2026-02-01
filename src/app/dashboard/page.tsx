'use client';

import Link from 'next/link';
import { ExternalLink, Eye, MousePointerClick, TrendingUp, ArrowRight, Edit, BarChart2 } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Demo data - in real app, this would come from Supabase
const DEMO_STATS = {
  pageViews: 1234,
  linkClicks: 567,
  clickRate: 45.9,
};

const DEMO_PAGE = {
  slug: 'demo',
  displayName: 'Alex Demo',
  bio: 'Creator, builder, dreamer ✨',
  themeId: 'clean',
  linksCount: 4,
};

export default function DashboardPage() {
  return (
    <DashboardLayout pageSlug={DEMO_PAGE.slug}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here is how your page is performing.
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Page Views
              </CardTitle>
              <Eye className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{DEMO_STATS.pageViews.toLocaleString()}</div>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Link Clicks
              </CardTitle>
              <MousePointerClick className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{DEMO_STATS.linkClicks.toLocaleString()}</div>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Click Rate
              </CardTitle>
              <BarChart2 className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{DEMO_STATS.clickRate}%</div>
              <p className="text-xs text-gray-500 mt-1">
                of visitors click a link
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Page preview card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Page</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  heybio.co/{DEMO_PAGE.slug}
                  <a 
                    href={`/${DEMO_PAGE.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/edit">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-xl">
                {DEMO_PAGE.displayName.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{DEMO_PAGE.displayName}</h3>
                <p className="text-sm text-gray-500">{DEMO_PAGE.bio}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {DEMO_PAGE.linksCount} links • {DEMO_PAGE.themeId} theme
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:border-gray-300 transition-colors cursor-pointer" asChild>
            <Link href="/dashboard/edit">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Edit your page
                </CardTitle>
                <CardDescription>
                  Update your bio, add links, change theme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-blue-600 font-medium">
                  Edit page
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:border-gray-300 transition-colors cursor-pointer" asChild>
            <Link href="/dashboard/analytics">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart2 className="w-5 h-5" />
                  View analytics
                </CardTitle>
                <CardDescription>
                  See detailed stats and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-blue-600 font-medium">
                  View analytics
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
