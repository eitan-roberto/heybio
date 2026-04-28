'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OnboardingLayout } from '@/components/onboarding';
import { ProUpsellSheet } from '@/components/onboarding/ProUpsellSheet';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useDashboardStore } from '@/stores/dashboardStore';
import { createClient } from '@/lib/supabase/client';
import { extractDomain, formatUrl, detectLinkIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';

function SetupContent() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const {
    draft,
    initDraft,
    setDisplayName,
    setBio,
    addLink,
    updateLink,
    removeLink,
    reorderLinks,
    reset: resetDraft,
  } = useOnboardingStore();
  const { setPages, selectPage } = useDashboardStore();

  const [user,       setUser]       = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [newUrl,     setNewUrl]     = useState('');
  const [showUpsell, setShowUpsell] = useState(false);

  // Init from ?u= if no draft
  useEffect(() => {
    const u = searchParams.get('u');
    if (!draft && u && u.length >= 3) {
      initDraft(u);
    } else if (!draft) {
      router.replace('/new');
    }
  }, [draft, searchParams, router, initDraft]);

  // Check auth
  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setCheckingAuth(false);
    };
    check();
  }, []);

  if (!draft) return null;

  const handleAddUrl = () => {
    if (!newUrl.trim()) return;
    const formatted = formatUrl(newUrl.trim());
    addLink({
      title:     extractDomain(formatted),
      url:       formatted,
      icon:      detectLinkIcon(formatted),
      order:     draft.links.length,
      is_active: true,
      is_nsfw:   false,
    });
    setNewUrl('');
  };

  const handlePublish = async () => {
    if (!draft) return;
    setPublishing(true);
    try {
      const res = await fetch('/api/pages/create', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create page');
      const newPage = {
        id: data.page.id,
        slug: data.page.slug,
        displayName: data.page.display_name,
        bio: data.page.bio ?? undefined,
        themeId: data.page.theme_id,
      };
      setPages([newPage]);
      selectPage(newPage.id);
      resetDraft();
      toast.success('Your page is live!');
      setShowUpsell(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
      setPublishing(false);
    }
  };

  const handleGoogleAuth = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options:  { redirectTo: `${window.location.origin}/auth/callback?redirect=/new/launch` },
    });
  };

  return (
    <OnboardingLayout step={2} title="Set up your page" backPath="/new">
      <div className="space-y-5 pb-4">

        {/* Profile */}
        <div className="space-y-3">
          <Input
            placeholder="Your name"
            value={draft.display_name || ''}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Input
            placeholder="Short bio (optional)"
            value={draft.bio || ''}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="h-px bg-low" />

        {/* Links */}
        <div>
          <p className="text-sm font-semibold text-top mb-3">
            Links <span className="text-mid font-normal">({draft.links.length})</span>
          </p>

          {draft.links.map((link, i) => (
            <div key={i} className={cn('flex items-center gap-2 p-3 rounded-2xl border border-low mb-2 bg-white', i === 0 && 'mt-0')}>
              <div className="flex flex-col gap-0.5">
                <button onClick={() => reorderLinks(i, i - 1)} disabled={i === 0} className="w-6 h-5 flex items-center justify-center text-mid disabled:opacity-30">
                  <Icon icon="arrow-up" className="w-3 h-3" />
                </button>
                <button onClick={() => reorderLinks(i, i + 1)} disabled={i === draft.links.length - 1} className="w-6 h-5 flex items-center justify-center text-mid disabled:opacity-30">
                  <Icon icon="arrow-down" className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <input
                  value={link.title}
                  onChange={(e) => updateLink(i, { title: e.target.value })}
                  placeholder="Title"
                  className="w-full text-sm font-medium text-top bg-transparent outline-none truncate"
                />
                <p className="text-xs text-mid truncate">{extractDomain(link.url)}</p>
              </div>
              <button onClick={() => removeLink(i)} className="w-8 h-8 flex items-center justify-center text-mid hover:text-orange transition-colors rounded-lg">
                <Icon icon="trash-2" className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add URL */}
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Paste a URL to add a link…"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
              className="flex-1"
            />
            <button
              onClick={handleAddUrl}
              disabled={!newUrl.trim()}
              className="w-12 h-12 rounded-2xl bg-top text-bottom flex items-center justify-center disabled:opacity-30 hover:bg-high transition-colors active:scale-95 shrink-0"
            >
              <Icon icon="plus" className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="h-px bg-low" />

        {/* Launch / Auth */}
        {checkingAuth ? (
          <div className="h-12 rounded-2xl bg-low animate-pulse" />
        ) : user ? (
          <Button
            onClick={handlePublish}
            loading={publishing}
            size="lg"
            className="w-full"
          >
            <Icon icon="sparkles" className="w-4 h-4" />
            Launch my page
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-center text-high">Create a free account to launch</p>
            <Button onClick={handleGoogleAuth} size="lg" className="w-full">
              <Icon icon="google" className="w-4 h-4" />
              Continue with Google
            </Button>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <a href={`/signup?next=/new/launch`}>Sign up with email</a>
            </Button>
            <p className="text-xs text-center text-mid">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-top hover:underline">Sign in</a>
            </p>
          </div>
        )}
      </div>
      <ProUpsellSheet
        open={showUpsell}
        onSkip={() => { setShowUpsell(false); router.push('/dashboard/edit'); }}
      />
    </OnboardingLayout>
  );
}

export default function AddLinksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Icon icon="loader-2" className="w-6 h-6 animate-spin text-mid" />
      </div>
    }>
      <SetupContent />
    </Suspense>
  );
}
