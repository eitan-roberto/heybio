import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

function getDeviceType(userAgent: string): 'mobile' | 'desktop' | 'tablet' {
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') && !ua.includes('ipad')) return 'mobile';
  if (ua.includes('ipad') || ua.includes('tablet')) return 'tablet';
  return 'desktop';
}

export async function POST(request: NextRequest) {
  try {
    const { slug, visitorId } = await request.json();
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Get page ID
    const { data: page } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Parse device from user agent
    const userAgent = request.headers.get('user-agent') || '';
    const device = getDeviceType(userAgent);
    
    // Get country from headers (Vercel adds this)
    const country = request.headers.get('x-vercel-ip-country') || 'unknown';
    
    // Insert page view
    await supabase.from('page_views').insert({
      page_id: page.id,
      visitor_id: visitorId ?? null,
      referrer: request.headers.get('referer') || '',
      country,
      device,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
