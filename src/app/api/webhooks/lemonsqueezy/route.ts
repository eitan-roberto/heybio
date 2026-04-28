import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';
import { logService } from '@/services/logService';

const WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

function verifySignature(payload: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) return !WEBHOOK_SECRET;
  const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

async function updateProfile(supabase: ReturnType<typeof createAdminClient>, userId: string, data: Record<string, unknown>) {
  const { error, count } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)
    .select('id', { count: 'exact', head: true });

  if (error) {
    logService.error('webhook_db_error', { userId, error: error.message, data });
  } else {
    logService.error('webhook_db_updated', { userId, count, fields: Object.keys(data) });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get('X-Signature') ?? req.headers.get('x-signature');

    if (!verifySignature(payload, signature)) {
      logService.error('webhook_invalid_signature', {});
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(payload);
    const eventName: string = event.meta?.event_name;
    const attrs = event.data?.attributes ?? {};
    const userId: string | undefined = event.meta?.custom_data?.user_id;

    logService.error('lemonsqueezy_webhook_received', { eventName, userId, lsStatus: attrs.status });

    if (!userId) {
      logService.error('webhook_no_user_id', { eventName, customData: event.meta?.custom_data });
      return NextResponse.json({ success: true });
    }

    const supabase = createAdminClient();

    switch (eventName) {
      case 'subscription_created': {
        const lsStatus: string = attrs.status ?? 'on_trial';
        const isTrialing = lsStatus === 'on_trial';
        await updateProfile(supabase, userId, {
          plan: 'pro',
          subscription_status: isTrialing ? 'trialing' : 'active',
          trial_ends_at: attrs.trial_ends_at ?? null,
          trial_started_at: isTrialing ? new Date().toISOString() : null,
          lemonsqueezy_customer_id: String(attrs.customer_id ?? ''),
          lemonsqueezy_subscription_id: String(event.data?.id ?? ''),
          updated_at: new Date().toISOString(),
        });
        break;
      }

      case 'subscription_updated': {
        const lsStatus: string = attrs.status ?? '';
        if (lsStatus === 'active') {
          await updateProfile(supabase, userId, {
            plan: 'pro',
            subscription_status: 'active',
            updated_at: new Date().toISOString(),
          });
        } else if (lsStatus === 'cancelled') {
          await updateProfile(supabase, userId, {
            subscription_status: 'cancelled',
            updated_at: new Date().toISOString(),
          });
        } else if (lsStatus === 'on_trial') {
          await updateProfile(supabase, userId, {
            plan: 'pro',
            subscription_status: 'trialing',
            trial_ends_at: attrs.trial_ends_at ?? null,
            updated_at: new Date().toISOString(),
          });
        }
        break;
      }

      case 'subscription_payment_success': {
        await updateProfile(supabase, userId, {
          plan: 'pro',
          subscription_status: 'active',
          updated_at: new Date().toISOString(),
        });
        break;
      }

      case 'subscription_payment_failed': {
        // Don't downgrade — LS retries; subscription_expired will handle it
        break;
      }

      case 'subscription_expired': {
        await updateProfile(supabase, userId, {
          plan: 'free',
          subscription_status: 'expired',
          updated_at: new Date().toISOString(),
        });
        break;
      }

      case 'subscription_cancelled': {
        const endsAt: string | null = attrs.ends_at ?? null;
        const isStillActive = endsAt ? new Date(endsAt) > new Date() : false;
        await updateProfile(supabase, userId, {
          plan: isStillActive ? 'pro' : 'free',
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString(),
        });
        break;
      }

      default:
        logService.error('webhook_unhandled_event', { eventName });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    logService.error('webhook_error', { error: String(err) });
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
