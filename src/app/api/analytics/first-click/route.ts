import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsContext, isErrorResponse } from '@/lib/analytics-auth';
import { logService } from '@/services/logService';

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAnalyticsContext(request);
    if (isErrorResponse(ctx)) return ctx;
    const { supabase, pageId, since, until } = ctx;

    // Fetch all clicks in range, ordered ascending so first per visitor comes first
    const { data: clicks } = await supabase
      .from('link_clicks')
      .select('visitor_id, link_id, created_at')
      .eq('page_id', pageId)
      .gte('created_at', since)
      .lte('created_at', until)
      .not('link_id', 'is', null)
      .order('created_at', { ascending: true });

    if (!clicks?.length) return NextResponse.json([]);

    // Keep only the first click per unique visitor
    const firstClickByVisitor = new Map<string, string>(); // visitor_id -> link_id
    for (const click of clicks) {
      if (!firstClickByVisitor.has(click.visitor_id)) {
        firstClickByVisitor.set(click.visitor_id, click.link_id);
      }
    }

    // Count how many visitors had each link as their first click
    const countByLink = new Map<string, number>();
    for (const linkId of firstClickByVisitor.values()) {
      countByLink.set(linkId, (countByLink.get(linkId) ?? 0) + 1);
    }

    if (!countByLink.size) return NextResponse.json([]);

    // Fetch link titles for the links that appear
    const linkIds = Array.from(countByLink.keys());
    const { data: links } = await supabase
      .from('links')
      .select('id, title')
      .in('id', linkIds);

    const titleById = new Map((links ?? []).map((l) => [l.id, l.title]));

    const result = linkIds
      .map((id) => ({
        link_id: id,
        title: titleById.get(id) ?? 'Unknown',
        count: countByLink.get(id) ?? 0,
      }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(result);
  } catch (error) {
    logService.error('analytics_first_click_error', { error: String(error) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
