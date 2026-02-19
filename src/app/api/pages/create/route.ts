import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { OnboardingDraft } from '@/types';
import { RESERVED_SLUGS } from '@/lib/reserved-slugs';

export async function POST(request: NextRequest) {
  try {
    console.log('[create] 1. creating supabase client, URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    const supabase = await createClient();

    console.log('[create] 2. getting user');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('[create] auth failed:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('[create] 3. user ok:', user.id);

    const draft: OnboardingDraft = await request.json();
    console.log('[create] 4. draft received, slug:', draft.slug);

    if (!draft.slug || !draft.display_name || !draft.theme_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate slug format
    const validSlugRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!validSlugRegex.test(draft.slug)) {
      return NextResponse.json({ error: 'Invalid username format' }, { status: 400 });
    }

    // Check reserved slugs
    if (RESERVED_SLUGS.includes(draft.slug.toLowerCase())) {
      return NextResponse.json({ error: 'This username is reserved' }, { status: 400 });
    }

    // Ensure profile exists (in case trigger didn't fire for existing auth users)
    console.log('[create] 5. upserting profile');
    const { error: profileError } = await supabase.from('profiles').upsert(
      { id: user.id, email: user.email ?? '', full_name: user.user_metadata?.full_name ?? null },
      { onConflict: 'id', ignoreDuplicates: true }
    );
    if (profileError) console.error('[create] profile upsert error:', profileError);
    else console.log('[create] 6. profile ok');

    // Check slug availability
    console.log('[create] 7. checking slug');
    const { data: existing, error: slugError } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', draft.slug)
      .single();
    if (slugError && slugError.code !== 'PGRST116') console.error('[create] slug check error:', slugError);

    if (existing) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }
    console.log('[create] 8. slug available');

    // Create page (social_icons stored as JSONB)
    console.log('[create] 9. inserting page');
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .insert({
        user_id: user.id,
        slug: draft.slug,
        display_name: draft.display_name,
        bio: draft.bio,
        avatar_url: draft.avatar_url,
        theme_id: draft.theme_id,
        social_icons: draft.social_icons.map((s, i) => ({ platform: s.platform, url: s.url, order: i })),
      })
      .select()
      .single();

    if (pageError || !page) {
      console.error('[create] page insert error:', pageError);
      return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
    }
    console.log('[create] 10. page created:', page.id);

    // Create links
    if (draft.links.length > 0) {
      console.log('[create] 11. inserting', draft.links.length, 'links');
      const { error: linksError } = await supabase.from('links').insert(
        draft.links.map((link) => ({
          page_id: page.id,
          title: link.title,
          url: link.url,
          icon: link.icon,
          order: link.order,
          is_active: link.is_active ?? true,
        }))
      );
      if (linksError) console.error('[create] links insert error:', linksError);
      else console.log('[create] 12. links ok');
    }

    console.log('[create] done');
    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error('[create] unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
