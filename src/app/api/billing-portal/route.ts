import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logService } from '@/services/logService';

const LS_API_KEY  = process.env.LEMON_SQUEEZY_API_KEY;
const STORE_SLUG  = process.env.LEMON_SQUEEZY_STORE_SLUG;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('lemonsqueezy_customer_id')
      .eq('id', user.id)
      .single();

    const customerId = profile?.lemonsqueezy_customer_id;

    // No customer yet — link to store billing page (they can auth by email)
    if (!customerId || !LS_API_KEY) {
      return NextResponse.json({
        url: `https://${STORE_SLUG}.lemonsqueezy.com/billing`,
      });
    }

    // Fetch customer portal URL from LS API
    const res = await fetch(`https://api.lemonsqueezy.com/v1/customers/${customerId}`, {
      headers: {
        Authorization: `Bearer ${LS_API_KEY}`,
        Accept: 'application/vnd.api+json',
      },
    });

    if (!res.ok) throw new Error(`LS API ${res.status}`);

    const json = await res.json();
    const portalUrl: string = json.data?.attributes?.urls?.customer_portal
      ?? `https://${STORE_SLUG}.lemonsqueezy.com/billing`;

    return NextResponse.json({ url: portalUrl });
  } catch (err) {
    logService.error('billing_portal_error', { error: String(err) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
