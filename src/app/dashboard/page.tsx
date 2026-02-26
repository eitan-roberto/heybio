import NextLink from 'next/link';
import { redirect } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

async function getDashboardData(userId: string) {
  const supabase = await createClient();

  const { data: pages } = await supabase
    .from('pages')
    .select('id, slug, display_name, bio, theme_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (!pages || pages.length === 0) return { pages: [] };

  return {
    pages: pages.map((p) => ({
      id: p.id,
      slug: p.slug,
      displayName: p.display_name,
      bio: p.bio,
      themeId: p.theme_id,
    })),
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  const { pages } = await getDashboardData(user.id);

  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-green flex items-center justify-center mb-6">
          <Icon icon="plus" className="w-10 h-10 text-top" />
        </div>
        <h1 className="text-2xl font-bold text-top mb-2">Create your first page</h1>
        <p className="text-high mb-8 max-w-md">
          You don&apos;t have any bio pages yet. Create one in just a few clicks.
        </p>
        <Button asChild>
          <NextLink href="/new">Create your page</NextLink>
        </Button>
      </div>
    );
  }

  const page = pages[0];

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-top">Dashboard</h1>
          <p className="text-high mt-1">Welcome back! Here&apos;s how your page is performing.</p>
        </div>

        {/* Stats */}
        <DashboardStats />

        {/* Page Card */}
        <div className="rounded-4xl py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-top">Your Page</h2>
              <NextLink
                href={`/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-pink hover:underline flex items-center gap-1"
              >
                heybio.co/{page.slug}
                <Icon icon="external-link" className="w-3 h-3" />
              </NextLink>
            </div>
            <Button variant="outline" className="rounded-full" asChild>
              <NextLink href="/dashboard/edit">Edit</NextLink>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-top flex items-center justify-center text-bottom font-bold text-xl">
              {page.displayName.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-top">{page.displayName}</h3>
              <p className="text-sm text-high">{page.bio ?? 'No bio yet'}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <NextLink
            href="/dashboard/edit"
            className="rounded-4xl p-6 bg-orange hover:bg-orange/80 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon icon="pencil" className="w-6 h-6 text-top" />
              <span className="font-semibold text-top">Edit your page</span>
            </div>
            <p className="text-sm text-top">Update bio, add links, change theme</p>
          </NextLink>

          <NextLink
            href="/dashboard/analytics"
            className="rounded-4xl p-6 bg-yellow hover:bg-yellow/80 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon icon="bar-chart-2" className="w-6 h-6 text-top" />
              <span className="font-semibold text-top">View analytics</span>
            </div>
            <p className="text-sm text-top">See detailed stats and insights</p>
          </NextLink>
        </div>

        {/* Multiple pages hint */}
        {pages.length > 1 && (
          <div className="rounded-3xl py-4 flex items-center gap-3">
            <Icon icon="layers" className="w-5 h-5 text-high" />
            <p className="text-sm text-high">
              You have <span className="text-top font-medium">{pages.length} pages</span>. Use the
              page selector in the sidebar to switch between them.
            </p>
          </div>
        )}
      </div>
  );
}
