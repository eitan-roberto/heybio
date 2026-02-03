import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// LemonSqueezy webhook handler
// Docs: https://docs.lemonsqueezy.com/guides/developer-guide/webhooks

const LEMON_SQUEEZY_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get('X-Signature');

    // Verify webhook signature
    if (LEMON_SQUEEZY_WEBHOOK_SECRET && signature) {
      const hash = crypto
        .createHmac('sha256', LEMON_SQUEEZY_WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');
      
      if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(payload);
    const { meta, data } = event;

    // Handle different event types
    switch (event.meta.event_name) {
      case 'order_created':
      case 'subscription_created':
      case 'subscription_payment_success': {
        const userId = meta?.custom_data?.user_id;
        
        if (userId) {
          const supabase = await createClient();
          
          // Update user to Pro plan
          await supabase
            .from('users')
            .update({ 
              plan: 'pro',
              lemonsqueezy_customer_id: data.attributes?.customer_id,
              lemonsqueezy_subscription_id: data.attributes?.subscription_id,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
        }
        break;
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        const userId = meta?.custom_data?.user_id;
        
        if (userId) {
          const supabase = await createClient();
          
          // Downgrade user to free plan
          await supabase
            .from('users')
            .update({ 
              plan: 'free',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
        }
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
