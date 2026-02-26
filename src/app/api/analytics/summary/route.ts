import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsContext, isErrorResponse } from '@/lib/analytics-auth';
import { logService } from '@/services/logService';

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAnalyticsContext(request);
    if (isErrorResponse(ctx)) return ctx;
    const { supabase, pageId, since, until } = ctx;

    const [
      { count: totalViews },
      { count: totalClicks },
      { data: uvData },
    ] = await Promise.all([
      supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('page_id', pageId)
        .gte('created_at', since)
        .lte('created_at', until),
      supabase
        .from('link_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('page_id', pageId)
        .gte('created_at', since)
        .lte('created_at', until),
      supabase
        .from('page_views')
        .select('visitor_id')
        .eq('page_id', pageId)
        .gte('created_at', since)
        .lte('created_at', until)
        .not('visitor_id', 'is', null),
    ]);

    const uniqueVisitors = new Set(uvData?.map((v) => v.visitor_id)).size;

    return NextResponse.json({
      totalViews: totalViews ?? 0,
      uniqueVisitors,
      totalClicks: totalClicks ?? 0,
    });
  } catch (error) {
    logService.error('analytics_summary_error', { error: String(error) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
