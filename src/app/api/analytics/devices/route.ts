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
      .select('device')
      .eq('page_id', pageId)
      .gte('created_at', since)
      .lte('created_at', until)
      .limit(10000);

    if (error) logService.error('analytics_devices_query_error', { error: error.message });

    const deviceMap: Record<string, number> = {};
    rows?.forEach((r) => {
      const device = r.device || 'desktop';
      deviceMap[device] = (deviceMap[device] ?? 0) + 1;
    });

    const devices = Object.entries(deviceMap)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(devices);
  } catch (error) {
    logService.error('analytics_devices_error', { error: String(error) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
