import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { eventType, linkId, pageId, properties } = await request.json();

    if (!eventType) {
      return NextResponse.json({ error: 'eventType required' }, { status: 400 });
    }

    const supabase = await createClient();

    await supabase.from('events').insert({
      event_type: eventType,
      link_id: linkId ?? null,
      page_id: pageId ?? null,
      properties: properties ?? {},
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics event error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
