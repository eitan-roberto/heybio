import NextLink from 'next/link';
import { redirect } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardPageCard } from '@/components/dashboard/DashboardPageCard';
import { createClient } from '@/lib/supabase/server';
import { ProUpgradeBanner } from '@/components/dashboard/ProUpgradeBanner';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirect=/dashboard');

  return (
    <div className="space-y-6">

      {/* Pro upgrade banner for free users */}
      <ProUpgradeBanner />

      {/* Stats — lazy loaded, shows skeletons immediately */}
      <div>
        <p className="text-xs font-semibold text-mid uppercase tracking-wider mb-3">Last 7 days</p>
        <DashboardStats />
      </div>

      {/* Page card — client component, reads selected page from Zustand */}
      <DashboardPageCard />

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <NextLink
          href="/dashboard/edit"
          className="rounded-3xl p-5 bg-orange hover:bg-orange/80 transition-colors"
        >
          <Icon icon="pencil" className="w-5 h-5 text-top mb-3" />
          <p className="font-bold text-top text-sm">Edit page</p>
          <p className="text-xs text-top/70 mt-0.5">Links, bio, design</p>
        </NextLink>

        <NextLink
          href="/dashboard/analytics"
          className="rounded-3xl p-5 bg-yellow hover:bg-yellow/80 transition-colors"
        >
          <Icon icon="bar-chart-2" className="w-5 h-5 text-top mb-3" />
          <p className="font-bold text-top text-sm">Stats</p>
          <p className="text-xs text-top/70 mt-0.5">Traffic & clicks</p>
        </NextLink>
      </div>

    </div>
  );
}
