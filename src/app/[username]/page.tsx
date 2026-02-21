import { notFound } from 'next/navigation';
import { Metadata, Viewport } from 'next';
import { BioPage } from '@/components/bio-page';
import { getTheme } from '@/config/themes';
import { createStaticClient } from '@/lib/supabase/static';
import type { PageTranslation, LinkTranslation, SocialPlatform } from '@/types';

// Demo pages for testing / landing page previews
const DEMO_PAGES: Record<string, {
  page: {
    display_name: string;
    bio: string;
    theme_id: string;
    slug: string;
    avatar_url?: string;
    languages?: string[];
  };
  links: { title: string; url: string; order: number; is_active: boolean; expires_at?: string | null; coming_soon_message?: string | null }[];
  socialIcons: { platform: SocialPlatform; url: string; order: number }[];
}> = {
  demo: {
    page: {
      display_name: 'Alex Demo',
      bio: 'Creator, builder, dreamer ✨',
      theme_id: 'clean',
      slug: 'demo',
    },
    links: [
      { title: 'My YouTube', url: 'https://youtube.com/@demo', order: 0, is_active: true },
      { title: 'Latest Blog', url: 'https://medium.com/@demo', order: 1, is_active: true },
    ],
    socialIcons: [
      { platform: 'instagram', url: 'https://instagram.com/demo', order: 0 },
      { platform: 'twitter', url: 'https://twitter.com/demo', order: 1 },
    ],
  },
  dark: {
    page: {
      display_name: 'Night Owl',
      bio: 'Embracing the darkness 🌙',
      theme_id: 'dark',
      slug: 'dark',
    },
    links: [
      { title: 'My Music', url: 'https://spotify.com/artist/demo', order: 0, is_active: true },
    ],
    socialIcons: [{ platform: 'spotify', url: 'https://spotify.com/demo', order: 0 }],
  },
  warm: {
    page: {
      display_name: 'Sarah Cozy',
      bio: 'Lifestyle | Home decor | Coffee lover ☕',
      theme_id: 'warm',
      slug: 'warm',
    },
    links: [
      { title: 'Shop My Favorites', url: 'https://amazon.com/shop/demo', order: 0, is_active: true },
    ],
    socialIcons: [{ platform: 'instagram', url: 'https://instagram.com/demo', order: 0 }],
  },
};

async function getPageData(username: string) {
  if (DEMO_PAGES[username]) {
    return { ...DEMO_PAGES[username], translations: [], linkTranslations: [], isPro: false };
  }

  try {
    const supabase = createStaticClient();
    const { data: page } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', username)
      .single();

    if (!page) return null;

    const now = new Date().toISOString();

    const [
      { data: links },
      { data: pageTrans },
    ] = await Promise.all([
      supabase
        .from('links')
        .select('*')
        .eq('page_id', page.id)
        .eq('is_active', true)
        .order('order'),
      supabase.from('page_translations').select('*').eq('page_id', page.id),
    ]);

    // Fetch link translations if page has multiple languages
    const pageLanguages: string[] = page.languages ?? ['en'];
    let linkTranslations: LinkTranslation[] = [];
    if (pageLanguages.length > 1 && links && links.length > 0) {
      const linkIds = links.map((l) => l.id);
      const { data: lt } = await supabase
        .from('link_translations')
        .select('*')
        .in('link_id', linkIds);
      linkTranslations = lt ?? [];
    }

    // Fetch user's plan to determine Pro status
    let isPro = false;
    if (page.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', page.user_id)
        .single();
      isPro = profile?.plan === 'pro';
    }

    return {
      page: {
        display_name: page.display_name,
        bio: page.bio ?? '',
        avatar_url: page.avatar_url,
        theme_id: page.theme_id,
        slug: page.slug,
        languages: pageLanguages,
        cover_image_url: page.cover_image_url ?? undefined,
      },
      links: (links ?? []).map((l) => ({
        ...l,
        is_active: l.is_active ?? true,
        expires_at: l.expires_at ?? null,
      })),
      socialIcons: ((page.social_icons ?? []) as import('@/types').SocialIcon[]),
      translations: (pageTrans ?? []) as PageTranslation[],
      linkTranslations,
      isPro,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const data = await getPageData(username);
  if (!data) return { title: 'Not Found | HeyBio' };

  return {
    title: `${data.page.display_name} | HeyBio`,
    description: data.page.bio || `Check out ${data.page.display_name}'s links`,
    openGraph: {
      title: `${data.page.display_name} | HeyBio`,
      description: data.page.bio || `Check out ${data.page.display_name}'s links`,
      images: data.page.avatar_url ? [{ url: data.page.avatar_url, width: 400, height: 400 }] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: `${data.page.display_name} | HeyBio`,
      description: data.page.bio || `Check out ${data.page.display_name}'s links`,
      images: data.page.avatar_url ? [data.page.avatar_url] : [],
    },
  };
}

export async function generateViewport({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Viewport> {
  const { username } = await params;
  const data = await getPageData(username);
  const theme = data ? getTheme(data.page.theme_id) : null;
  return { themeColor: theme?.colors.background ?? '#ffffff' };
}

// Pages are statically generated and revalidated on-demand when edited
export const dynamicParams = true;

export default async function PublicBioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await getPageData(username);
  if (!data) notFound();

  return (
    <BioPage
      page={data.page}
      links={data.links}
      socialIcons={data.socialIcons}
      translations={data.translations}
      linkTranslations={data.linkTranslations}
      coverImageUrl={'cover_image_url' in data.page ? data.page.cover_image_url : undefined}
      isPro={data.isPro}
      showBadge={true}
    />
  );
}

// Pre-render demo pages at build time
export function generateStaticParams() {
  return Object.keys(DEMO_PAGES).map((username) => ({ username }));
}
