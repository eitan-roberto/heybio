import { NextResponse } from 'next/server';
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { logService } from '@/services/logService';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (isAdminResponse(auth)) return auth;

    const supabase = createAdminClient();

    const [
      { count: totalUsers },
      { count: totalPages },
      { count: proUsers },
      { count: trialingUsers },
      { data: dailySignups },
      { data: dailyRevenue },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('pages').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'pro').eq('subscription_status', 'active'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'trialing'),
      // Daily signups last 30 days
      supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true }),
      // Daily pro upgrades last 30 days (users who went to pro in last 30d)
      supabase
        .from('profiles')
        .select('updated_at, subscription_status')
        .eq('plan', 'pro')
        .gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('updated_at', { ascending: true }),
    ]);

    // Aggregate daily signup counts
    const signupsByDay: Record<string, number> = {};
    (dailySignups ?? []).forEach((p) => {
      const day = p.created_at.split('T')[0];
      signupsByDay[day] = (signupsByDay[day] ?? 0) + 1;
    });

    const revenueByDay: Record<string, number> = {};
    (dailyRevenue ?? []).forEach((p) => {
      const day = p.updated_at.split('T')[0];
      revenueByDay[day] = (revenueByDay[day] ?? 0) + 1;
    });

    return NextResponse.json({
      totalUsers: totalUsers ?? 0,
      totalPages: totalPages ?? 0,
      proUsers: proUsers ?? 0,
      trialingUsers: trialingUsers ?? 0,
      signupsByDay,
      payingByDay: revenueByDay,
    });
  } catch (err) {
    logService.error('admin_stats_error', { error: String(err) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
