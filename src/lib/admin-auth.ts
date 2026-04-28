import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim()).filter(Boolean);

export async function requireAdmin(req?: NextRequest): Promise<{ userId: string; email: string } | NextResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!ADMIN_EMAILS.includes(user.email ?? '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return { userId: user.id, email: user.email! };
}

export function isAdminResponse(v: unknown): v is NextResponse {
  return v instanceof NextResponse;
}

/** Client-side check — reads from session */
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email);
}
