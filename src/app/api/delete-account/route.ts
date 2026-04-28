import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logService } from '@/services/logService';

export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();

    // Delete all user data in order (pages first, then profile, then auth user)
    await admin.from('pages').delete().eq('user_id', user.id);
    await admin.from('profiles').delete().eq('id', user.id);
    await admin.auth.admin.deleteUser(user.id);

    logService.info('account_deleted', { userId: user.id });
    return NextResponse.json({ success: true });
  } catch (err) {
    logService.error('account_delete_error', { error: String(err) });
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
