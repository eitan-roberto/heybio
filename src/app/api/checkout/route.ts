import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logService } from '@/services/logService';

const STORE_SLUG    = process.env.LEMON_SQUEEZY_STORE_SLUG;   // e.g. "heybio"
const VARIANT_ID    = process.env.LEMON_SQUEEZY_VARIANT_ID;   // pro monthly variant id
const APP_URL       = process.env.NEXT_PUBLIC_APP_URL || 'https://heybio.co';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!STORE_SLUG || !VARIANT_ID) {
      logService.error('checkout_env_missing', { STORE_SLUG, VARIANT_ID });
      return NextResponse.json({ error: 'Payment not configured' }, { status: 503 });
    }

    // Build LemonSqueezy hosted checkout URL
    // Trial is configured on the variant in the LS dashboard (30 days)
    const url = new URL(`https://${STORE_SLUG}.lemonsqueezy.com/buy/${VARIANT_ID}`);
    url.searchParams.set('checkout[email]', user.email || '');
    url.searchParams.set('checkout[custom][user_id]', user.id);
    url.searchParams.set('checkout[success_url]', `${APP_URL}/checkout/success`);

    return NextResponse.json({ checkoutUrl: url.toString() });
  } catch (err) {
    logService.error('checkout_error', { error: String(err) });
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
