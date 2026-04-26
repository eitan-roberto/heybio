'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Icon } from '@/components/ui/icon';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useDashboardStore } from '@/stores/dashboardStore';
import { createClient } from '@/lib/supabase/client';

export default function LaunchPage() {
  const router = useRouter();
  const { draft, reset } = useOnboardingStore();
  const { setPages, selectPage } = useDashboardStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const launch = async () => {
      if (!draft) {
        router.replace('/dashboard');
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login?redirect=/new/launch');
        return;
      }

      try {
        const res = await fetch('/api/pages/create', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(draft),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not create page');

        const newPage = {
          id: data.page.id,
          slug: data.page.slug,
          displayName: data.page.display_name,
          bio: data.page.bio ?? undefined,
          themeId: data.page.theme_id,
        };
        setPages([newPage]);
        selectPage(newPage.id);
        reset();
        toast.success('Your page is live!');
        router.push('/dashboard/edit');
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong';
        setError(msg);
      }
    };

    launch();
  }, [draft, router, reset, setPages, selectPage]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <div className="w-12 h-12 rounded-full bg-orange/20 flex items-center justify-center">
          <Icon icon="x" className="w-6 h-6 text-orange" />
        </div>
        <p className="text-top font-semibold">Could not launch your page</p>
        <p className="text-sm text-high text-center">{error}</p>
        <button onClick={() => router.push('/new/links')} className="text-sm text-top font-semibold underline">
          Go back and try again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Icon icon="loader-2" className="w-8 h-8 animate-spin text-mid" />
      <p className="text-high text-sm">Launching your page…</p>
    </div>
  );
}
