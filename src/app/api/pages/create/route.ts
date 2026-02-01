import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { OnboardingDraft } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const draft: OnboardingDraft = await request.json();

    // Validate required fields
    if (!draft.slug || !draft.display_name || !draft.theme_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already taken
    const { data: existing } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', draft.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Create page
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .insert({
        user_id: user.id,
        slug: draft.slug,
        display_name: draft.display_name,
        bio: draft.bio,
        avatar_url: draft.avatar_url,
        theme_id: draft.theme_id,
      })
      .select()
      .single();

    if (pageError || !page) {
      return NextResponse.json(
        { error: 'Failed to create page' },
        { status: 500 }
      );
    }

    // Create links
    if (draft.links.length > 0) {
      const links = draft.links.map((link) => ({
        page_id: page.id,
        title: link.title,
        url: link.url,
        icon: link.icon,
        order: link.order,
        is_active: link.is_active ?? true,
      }));

      const { error: linksError } = await supabase
        .from('links')
        .insert(links);

      if (linksError) {
        console.error('Failed to create links:', linksError);
      }
    }

    // Create social icons
    if (draft.social_icons.length > 0) {
      const socials = draft.social_icons.map((icon) => ({
        page_id: page.id,
        platform: icon.platform,
        url: icon.url,
        order: icon.order,
      }));

      const { error: socialsError } = await supabase
        .from('social_icons')
        .insert(socials);

      if (socialsError) {
        console.error('Failed to create social icons:', socialsError);
      }
    }

    return NextResponse.json({
      success: true,
      page,
    });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
