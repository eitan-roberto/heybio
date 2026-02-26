import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsContext, isErrorResponse } from '@/lib/analytics-auth';
import { logService } from '@/services/logService';

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAnalyticsContext(request);
    if (isErrorResponse(ctx)) return ctx;
    const { supabase, pageId, since, until } = ctx;

    // Fetch links and total page views in parallel first
    const [{ count: totalViews }, { data: links }] = await Promise.all([
      supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('page_id', pageId)
        .gte('created_at', since)
        .lte('created_at', until),
      supabase
        .from('links')
        .select('id, title, url, is_active, expires_at')
        .eq('page_id', pageId)
        .order('order'),
    ]);

    if (!links?.length) return NextResponse.json([]);

    // One HEAD count per link — exact, bypasses max-rows, works with RLS subquery policies.
    const clickCounts = await Promise.all(
      links.map((link) =>
        supabase
          .from('link_clicks')
          .select('*', { count: 'exact', head: true })
          .eq('link_id', link.id)
          .gte('created_at', since)
          .lte('created_at', until)
      )
    );

    const views = totalViews ?? 0;
    const result = links
      .map((l, i) => {
        const clicks = clickCounts[i]?.count ?? 0;
        return {
          id: l.id,
          title: l.title,
          url: l.url,
          is_active: l.is_active,
          expires_at: l.expires_at ?? null,
          clicks,
          ctr: views > 0 ? Math.round((clicks / views) * 100) : 0,
        };
      })
      .sort((a, b) => b.clicks - a.clicks);

    return NextResponse.json(result);
  } catch (error) {
    logService.error('analytics_links_error', { error: String(error) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
