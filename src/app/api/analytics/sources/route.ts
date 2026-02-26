import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsContext, isErrorResponse } from '@/lib/analytics-auth';
import { logService } from '@/services/logService';

function parseSource(referrer: string | null): string {
  if (!referrer) return 'Unknown';
  try {
    const url = new URL(referrer);
    return url.searchParams.get('utm_source') || url.hostname || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAnalyticsContext(request);
    if (isErrorResponse(ctx)) return ctx;
    const { supabase, pageId, since, until } = ctx;

    const { data: rows, error } = await supabase
      .from('page_views')
      .select('referrer')
      .eq('page_id', pageId)
      .gte('created_at', since)
      .lte('created_at', until)
      .limit(10000);

    if (error) logService.error('analytics_sources_query_error', { error: error.message });

    const sourceMap: Record<string, number> = {};
    rows?.forEach((r) => {
      const source = parseSource(r.referrer);
      sourceMap[source] = (sourceMap[source] ?? 0) + 1;
    });

    const sources = Object.entries(sourceMap)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(sources);
  } catch (error) {
    logService.error('analytics_sources_error', { error: String(error) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
