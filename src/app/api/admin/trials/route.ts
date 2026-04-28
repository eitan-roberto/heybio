import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { logService } from '@/services/logService';

/** GET: list all trialing users */
export async function GET() {
  try {
    const auth = await requireAdmin();
    if (isAdminResponse(auth)) return auth;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, trial_ends_at, trial_started_at, subscription_status, created_at')
      .eq('subscription_status', 'trialing')
      .order('trial_ends_at', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    logService.error('admin_trials_get_error', { error: String(err) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

/** POST: cancel trial for a user (downgrade immediately) */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (isAdminResponse(auth)) return auth;

    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('profiles')
      .update({
        plan: 'free',
        subscription_status: 'expired',
        trial_ends_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .eq('subscription_status', 'trialing'); // safety — only cancel if actually trialing

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    logService.error('admin_trials_cancel_error', { error: String(err) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
