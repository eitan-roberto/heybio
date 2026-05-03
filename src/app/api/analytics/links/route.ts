import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsContext, isErrorResponse } from '@/lib/analytics-auth';
import { logService } from '@/services/logService';

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAnalyticsContext(request);
    if (isErrorResponse(ctx)) return ctx;
    const { supabase, pageId, since, until } = ctx;

    const [{ count: totalViews }, { data: links }] = await Promise.all([
      supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('page_id', pageId)
        .gte('created_at', since)
        .lte('created_at', until),
      supabase
        .from('links')
        .select('id, title, url, is_active, expires_at, is_nsfw')
        .eq('page_id', pageId)
        .order('order'),
    ]);

    if (!links?.length) return NextResponse.json([]);

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

    // One query for all NSFW gate events across NSFW links
    const nsfwLinkIds = links.filter((l) => l.is_nsfw).map((l) => l.id);
    const entered: Record<string, number> = {};

    if (nsfwLinkIds.length > 0) {
      const { data: nsfwEvents } = await supabase
        .from('events')
        .select('link_id, event_type')
        .eq('page_id', pageId)
        .eq('event_type', 'nsfw_continue_clicked')
        .in('link_id', nsfwLinkIds)
        .gte('created_at', since)
        .lte('created_at', until);

      for (const e of nsfwEvents ?? []) {
        if (!e.link_id) continue;
        entered[e.link_id] = (entered[e.link_id] ?? 0) + 1;
      }
    }

    const views = totalViews ?? 0;
    const result = links
      .map((l, i) => {
        const clicks = clickCounts[i]?.count ?? 0;
        const base = {
          id: l.id,
          title: l.title,
          url: l.url,
          is_active: l.is_active,
          expires_at: l.expires_at ?? null,
          is_nsfw: l.is_nsfw ?? false,
          clicks,
          ctr: views > 0 ? Math.round((clicks / views) * 100) : 0,
        };

        if (!l.is_nsfw) return base;

        const nsfw_entered = entered[l.id] ?? 0;
        const nsfw_entry_rate = clicks > 0 ? Math.round((nsfw_entered / clicks) * 100) : 0;

        return { ...base, nsfw_entered, nsfw_entry_rate };
      })
      .sort((a, b) => b.clicks - a.clicks);

    return NextResponse.json(result);
  } catch (error) {
    logService.error('analytics_links_error', { error: String(error) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
