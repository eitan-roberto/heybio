import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logService } from '@/services/logService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    if (!pageId) return NextResponse.json({ error: 'pageId required' }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: page } = await supabase
      .from('pages')
      .select('id')
      .eq('id', pageId)
      .eq('user_id', user.id)
      .single();
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const [{ count: pageViews }, { count: linkClicks }] = await Promise.all([
      supabase.from('page_views').select('*', { count: 'exact', head: true }).eq('page_id', pageId),
      supabase.from('link_clicks').select('*', { count: 'exact', head: true }).eq('page_id', pageId),
    ]);

    const views = pageViews ?? 0;
    const clicks = linkClicks ?? 0;
    return NextResponse.json({
      pageViews: views,
      linkClicks: clicks,
      clickRate: views > 0 ? Math.round((clicks / views) * 100) : 0,
    });
  } catch (error) {
    logService.error('analytics_overview_error', { error: String(error) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
