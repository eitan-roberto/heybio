import { notFound } from 'next/navigation';
import { Metadata, Viewport } from 'next';
import { BioPage } from '@/components/bio-page';
import { getTheme } from '@/config/themes';
import { createClient } from '@/lib/supabase/server';

// Keep demo data for static generation
const DEMO_PAGES: Record<string, any> = {
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
};

async function getPageData(username: string) {
  // Check demo first
  if (DEMO_PAGES[username]) return DEMO_PAGES[username];

  // Fetch from Supabase
  try {
    const supabase = await createClient();
    const { data: page } = await supabase.from('pages').select('*').eq('slug', username).single();
    if (!page) return null;

    const [{ data: links }, { data: socialIcons }] = await Promise.all([
      supabase.from('links').select('*').eq('page_id', page.id).order('order'),
      supabase.from('social_icons').select('*').eq('page_id', page.id).order('order'),
    ]);

    return {
      page: {
        display_name: page.display_name,
        bio: page.bio,
        avatar_url: page.avatar_url,
        theme_id: page.theme_id,
        slug: page.slug,
      },
      links: links?.map((l: any) => ({ ...l, is_active: l.is_active ?? true })) || [],
      socialIcons: socialIcons || [],
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const data = await getPageData(username);
  if (!data) return { title: 'Not Found | HeyBio' };
  return {
    title: `${data.page.display_name} | HeyBio`,
    description: data.page.bio || `Check out ${data.page.display_name}'s links`,
  };
}

export async function generateViewport({ params }: { params: Promise<{ username: string }> }): Promise<Viewport> {
  const { username } = await params;
  const data = await getPageData(username);
  const theme = data ? getTheme(data.page.theme_id) : null;
  return { themeColor: theme?.colors.background || '#ffffff' };
}

export default async function PublicBioPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await getPageData(username);
  if (!data) notFound();
  return <BioPage page={data.page} links={data.links} socialIcons={data.socialIcons} showBadge={true} />;
}

export function generateStaticParams() {
  return Object.keys(DEMO_PAGES).map((username) => ({ username }));
}
