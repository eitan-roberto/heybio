import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { slug, url, index, linkId, visitorId } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get page
    const { data: page } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Resolve link_id: prefer explicit linkId, fall back to URL match
    let resolvedLinkId: string | null = linkId ?? null;
    if (!resolvedLinkId && url) {
      const { data: link } = await supabase
        .from('links')
        .select('id')
        .eq('page_id', page.id)
        .eq('url', url)
        .maybeSingle();
      resolvedLinkId = link?.id ?? null;
    }

    // Insert click
    await supabase.from('link_clicks').insert({
      page_id: page.id,
      link_id: resolvedLinkId,
      visitor_id: visitorId ?? null,
      referrer: request.headers.get('referer') || '',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
