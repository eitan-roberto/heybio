import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { logService } from '@/services/logService';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (isAdminResponse(auth)) return auth;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    logService.error('admin_promotions_get_error', { error: String(err) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (isAdminResponse(auth)) return auth;

    const body = await req.json();
    const { code, description, free_trial_days, discount_percent, max_uses, expires_at } = body;

    if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('promotions')
      .insert({
        code: code.toUpperCase().trim(),
        description: description ?? null,
        free_trial_days: free_trial_days ?? 30,
        discount_percent: discount_percent ?? 0,
        max_uses: max_uses ?? null,
        expires_at: expires_at ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    logService.error('admin_promotions_post_error', { error: String(err) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (isAdminResponse(auth)) return auth;

    const { id, is_active } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('promotions')
      .update({ is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    logService.error('admin_promotions_patch_error', { error: String(err) });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
