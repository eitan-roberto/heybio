import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsContext, isErrorResponse } from '@/lib/analytics-auth';
import { logService } from '@/services/logService';

function getDaysInRange(startDate: string, endDate: string): string[] {
  const days: string[] = [];
  const cur = new Date(startDate + 'T00:00:00.000Z');
  const end = new Date(endDate + 'T00:00:00.000Z');
  while (cur <= end) {
    days.push(cur.toISOString().split('T')[0]);
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return days;
}

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAnalyticsContext(request);
    if (isErrorResponse(ctx)) return ctx;
    const { supabase, pageId, since: _since, until: _until, startDate, endDate } = ctx;

    const days = getDaysInRange(startDate, endDate);

    // One HEAD-count request per day for views + clicks (exact, no row-limit).
    // count(distinct:visitor_id) for unique visitors (single aggregate row, no row-limit).
    const daily = await Promise.all(
      days.map(async (date) => {
        const dayStart = date + 'T00:00:00.000Z';
        const dayEnd = date + 'T23:59:59.999Z';

        const [{ count: views }, { count: clicks }, { data: uvRows }] = await Promise.all([
          supabase
            .from('page_views')
            .select('*', { count: 'exact', head: true })
            .eq('page_id', pageId)
            .gte('created_at', dayStart)
            .lte('created_at', dayEnd),
          supabase
            .from('link_clicks')
            .select('*', { count: 'exact', head: true })
            .eq('page_id', pageId)
            .gte('created_at', dayStart)
            .lte('created_at', dayEnd),
          // Raw visitor_ids for distinct count — accurate for days < 1000 views.
          supabase
            .from('page_views')
            .select('visitor_id')
            .eq('page_id', pageId)
            .gte('created_at', dayStart)
            .lte('created_at', dayEnd)
            .not('visitor_id', 'is', null),
        ]);

        return {
          date,
          views: views ?? 0,
          clicks: clicks ?? 0,
          uniqueVisitors: new Set(uvRows?.map((r) => r.visitor_id)).size,
        };
      })
    );

    return NextResponse.json(daily);
  } catch (error) {
    logService.error('analytics_daily_error', { error: String(error) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
