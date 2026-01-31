import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BioPage } from '@/components/bio-page';
import { getTheme } from '@/config/themes';

// Demo data - in real app, this would come from Supabase
const DEMO_PAGES: Record<string, {
  page: {
    display_name: string;
    bio?: string;
    avatar_url?: string;
    theme_id: string;
    slug: string;
  };
  links: {
    title: string;
    url: string;
    icon?: string;
    order: number;
    is_active: boolean;
  }[];
  socialIcons: {
    platform: 'instagram' | 'twitter' | 'youtube' | 'tiktok' | 'spotify' | 'github' | 'linkedin';
    url: string;
    order: number;
  }[];
}> = {
  demo: {
    page: {
      display_name: 'Alex Demo',
      bio: 'Creator, builder, dreamer ✨',
      theme_id: 'clean',
      slug: 'demo',
    },
    links: [
      { title: 'My YouTube Channel', url: 'https://youtube.com/@demo', order: 0, is_active: true },
      { title: 'Latest Blog Post', url: 'https://medium.com/@demo', order: 1, is_active: true },
      { title: 'Book a Call', url: 'https://calendly.com/demo', order: 2, is_active: true },
      { title: 'My Newsletter', url: 'https://substack.com/@demo', order: 3, is_active: true },
    ],
    socialIcons: [
      { platform: 'instagram', url: 'https://instagram.com/demo', order: 0 },
      { platform: 'twitter', url: 'https://twitter.com/demo', order: 1 },
      { platform: 'youtube', url: 'https://youtube.com/@demo', order: 2 },
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
      { title: 'Stream on Twitch', url: 'https://twitch.tv/demo', order: 1, is_active: true },
      { title: 'Discord Community', url: 'https://discord.gg/demo', order: 2, is_active: true },
    ],
    socialIcons: [
      { platform: 'spotify', url: 'https://spotify.com/demo', order: 0 },
      { platform: 'github', url: 'https://github.com/demo', order: 1 },
    ],
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
      { title: 'Latest Video', url: 'https://youtube.com/watch?v=demo', order: 1, is_active: true },
      { title: 'Recipe Blog', url: 'https://demo.com/recipes', order: 2, is_active: true },
      { title: 'Support Me', url: 'https://ko-fi.com/demo', order: 3, is_active: true },
    ],
    socialIcons: [
      { platform: 'instagram', url: 'https://instagram.com/demo', order: 0 },
      { platform: 'tiktok', url: 'https://tiktok.com/@demo', order: 1 },
      { platform: 'youtube', url: 'https://youtube.com/@demo', order: 2 },
    ],
  },
};

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const data = DEMO_PAGES[username];
  
  if (!data) {
    return {
      title: 'Page Not Found | HeyBio',
    };
  }

  const theme = getTheme(data.page.theme_id);
  
  return {
    title: `${data.page.display_name} | HeyBio`,
    description: data.page.bio || `Check out ${data.page.display_name}'s links`,
    openGraph: {
      title: data.page.display_name,
      description: data.page.bio || `Check out ${data.page.display_name}'s links`,
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: data.page.display_name,
      description: data.page.bio || `Check out ${data.page.display_name}'s links`,
    },
    themeColor: theme.colors.background.startsWith('linear') 
      ? '#ffffff' 
      : theme.colors.background,
  };
}

export default async function PublicBioPage({ params }: PageProps) {
  const { username } = await params;
  
  // In real app, fetch from Supabase
  const data = DEMO_PAGES[username];
  
  if (!data) {
    notFound();
  }

  return (
    <BioPage
      page={data.page}
      links={data.links}
      socialIcons={data.socialIcons}
      showBadge={true}
    />
  );
}

// Generate static pages for demo usernames
export function generateStaticParams() {
  return Object.keys(DEMO_PAGES).map((username) => ({ username }));
}
