import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';
import { logService } from '@/services/logService';

const WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

function verifySignature(payload: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) return !WEBHOOK_SECRET; // allow if not configured
  const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get('X-Signature');

    if (!verifySignature(payload, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(payload);
    const eventName: string = event.meta?.event_name;
    const attrs = event.data?.attributes ?? {};
    const userId: string | undefined = event.meta?.custom_data?.user_id;

    logService.error('lemonsqueezy_webhook', { eventName, userId });

    if (!userId) {
      return NextResponse.json({ success: true }); // ignore events without user_id
    }

    const supabase = createAdminClient();

    switch (eventName) {
      case 'subscription_created': {
        const lsStatus: string = attrs.status ?? 'on_trial';
        const trialEndsAt: string | null = attrs.trial_ends_at ?? null;
        const isTrialing = lsStatus === 'on_trial';

        await supabase.from('profiles').update({
          plan: 'pro',
          subscription_status: isTrialing ? 'trialing' : 'active',
          trial_ends_at: trialEndsAt,
          trial_started_at: isTrialing ? new Date().toISOString() : null,
          lemonsqueezy_customer_id: String(attrs.customer_id ?? ''),
          lemonsqueezy_subscription_id: String(event.data?.id ?? ''),
          updated_at: new Date().toISOString(),
        }).eq('id', userId);
        break;
      }

      case 'subscription_updated': {
        const lsStatus: string = attrs.status ?? '';
        if (lsStatus === 'active') {
          await supabase.from('profiles').update({
            plan: 'pro',
            subscription_status: 'active',
            updated_at: new Date().toISOString(),
          }).eq('id', userId);
        } else if (lsStatus === 'cancelled') {
          // Keep pro until the subscription period ends (subscription_expired will downgrade)
          await supabase.from('profiles').update({
            subscription_status: 'cancelled',
            updated_at: new Date().toISOString(),
          }).eq('id', userId);
        } else if (lsStatus === 'on_trial') {
          await supabase.from('profiles').update({
            plan: 'pro',
            subscription_status: 'trialing',
            trial_ends_at: attrs.trial_ends_at ?? null,
            updated_at: new Date().toISOString(),
          }).eq('id', userId);
        }
        break;
      }

      case 'subscription_payment_success': {
        await supabase.from('profiles').update({
          plan: 'pro',
          subscription_status: 'active',
          updated_at: new Date().toISOString(),
        }).eq('id', userId);
        break;
      }

      case 'subscription_payment_failed': {
        // Don't immediately downgrade — LS retries; let subscription_expired handle it
        break;
      }

      case 'subscription_expired': {
        await supabase.from('profiles').update({
          plan: 'free',
          subscription_status: 'expired',
          updated_at: new Date().toISOString(),
        }).eq('id', userId);
        break;
      }

      case 'subscription_cancelled': {
        // Immediate cancel (no grace period) — downgrade now
        const endsAt: string | null = attrs.ends_at ?? null;
        const isStillActive = endsAt ? new Date(endsAt) > new Date() : false;
        await supabase.from('profiles').update({
          plan: isStillActive ? 'pro' : 'free',
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString(),
        }).eq('id', userId);
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    logService.error('webhook_error', { error: String(err) });
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
