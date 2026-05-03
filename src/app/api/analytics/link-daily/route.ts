import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsContext, isErrorResponse, buildDailyMap, toUTCDate } from '@/lib/analytics-auth';
import { logService } from '@/services/logService';

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAnalyticsContext(request);
    if (isErrorResponse(ctx)) return ctx;
    const { supabase, pageId, since, until, startDate, endDate } = ctx;

    const linkId = new URL(request.url).searchParams.get('linkId');
    if (!linkId) return NextResponse.json({ error: 'linkId required' }, { status: 400 });

    // Verify link belongs to this page
    const { data: link } = await supabase
      .from('links')
      .select('id, is_nsfw')
      .eq('id', linkId)
      .eq('page_id', pageId)
      .single();

    if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const dayMap = buildDailyMap(startDate, endDate) as Record<string, { clicks: number; entered: number }>;
    for (const key of Object.keys(dayMap)) {
      dayMap[key] = { clicks: 0, entered: 0 };
    }

    const [{ data: clicks }, { data: enterEvents }] = await Promise.all([
      supabase
        .from('link_clicks')
        .select('created_at')
        .eq('link_id', linkId)
        .gte('created_at', since)
        .lte('created_at', until),
      link.is_nsfw
        ? supabase
            .from('events')
            .select('created_at')
            .eq('link_id', linkId)
            .eq('event_type', 'nsfw_continue_clicked')
            .gte('created_at', since)
            .lte('created_at', until)
        : Promise.resolve({ data: [] }),
    ]);

    for (const c of clicks ?? []) {
      const d = toUTCDate(c.created_at);
      if (dayMap[d]) dayMap[d].clicks++;
    }
    for (const e of enterEvents ?? []) {
      const d = toUTCDate(e.created_at);
      if (dayMap[d]) dayMap[d].entered++;
    }

    const result = Object.entries(dayMap).map(([date, v]) => ({
      date,
      clicks: v.clicks,
      ...(link.is_nsfw ? { nsfw_entered: v.entered } : {}),
    }));

    return NextResponse.json({ isNsfw: link.is_nsfw, days: result });
  } catch (error) {
    logService.error('analytics_link_daily_error', { error: String(error) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
