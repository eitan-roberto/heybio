import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { slug, url, index } = await request.json();
    
    if (!slug || !url) {
      return NextResponse.json({ error: 'Slug and URL required' }, { status: 400 });
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

    // Get or create link
    const { data: link } = await supabase
      .from('links')
      .select('id')
      .eq('page_id', page.id)
      .eq('url', url)
      .maybeSingle();

    // Insert click
    await supabase.from('link_clicks').insert({
      page_id: page.id,
      link_id: link?.id || null,
      timestamp: new Date().toISOString(),
      referrer: request.headers.get('referer') || '',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
