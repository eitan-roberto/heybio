import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// LemonSqueezy checkout integration
// Docs: https://docs.lemonsqueezy.com/guides/developer-guide/checkout

const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;
const LEMON_SQUEEZY_VARIANT_ID = process.env.LEMON_SQUEEZY_VARIANT_ID; // Pro plan variant
const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { variantId } = body;

    // Option 1: Use LemonSqueezy's overlay checkout (requires @lemonsqueezy/lemonsqueezy.js)
    // For now, return the checkout URL that will redirect to LemonSqueezy
    
    // Option 2: Generate a checkout URL
    // Format: https://{store}.lemonsqueezy.com/checkout/buy/{variant}?checkout[email]={email}&checkout[custom][user_id]={userId}
    
    const checkoutUrl = new URL(`https://${LEMON_SQUEEZY_STORE_ID || 'your-store'}.lemonsqueezy.com/checkout/buy/${variantId || LEMON_SQUEEZY_VARIANT_ID || 'variant-id'}`);
    
    // Add user info for webhook identification
    checkoutUrl.searchParams.set('checkout[email]', user.email || '');
    checkoutUrl.searchParams.set('checkout[custom][user_id]', user.id);
    checkoutUrl.searchParams.set('checkout[success_url]', `${process.env.NEXT_PUBLIC_APP_URL || 'https://heybio.vercel.app'}/checkout/success`);
    
    return NextResponse.json({ 
      checkoutUrl: checkoutUrl.toString(),
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
