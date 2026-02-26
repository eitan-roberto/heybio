import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsContext, isErrorResponse } from '@/lib/analytics-auth';
import { logService } from '@/services/logService';

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAnalyticsContext(request);
    if (isErrorResponse(ctx)) return ctx;
    const { supabase, pageId, since, until } = ctx;

    const { data: rows, error } = await supabase
      .from('page_views')
      .select('country')
      .eq('page_id', pageId)
      .gte('created_at', since)
      .lte('created_at', until)
      .limit(10000);

    if (error) logService.error('analytics_countries_query_error', { error: error.message });

    const countryMap: Record<string, number> = {};
    rows?.forEach((r) => {
      const country = r.country || 'Unknown';
      countryMap[country] = (countryMap[country] ?? 0) + 1;
    });

    const countries = Object.entries(countryMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(countries);
  } catch (error) {
    logService.error('analytics_countries_error', { error: String(error) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
