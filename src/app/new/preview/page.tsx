'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { BioPage } from '@/components/bio-page';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { createClient } from '@/lib/supabase/client';

export default function PreviewPage() {
  const router = useRouter();
  const { draft, reset } = useOnboardingStore();
  const [showMobilePreview, setShowMobilePreview] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Redirect if no draft exists
  useEffect(() => {
    if (!draft && !loading) {
      router.replace('/new');
    }
  }, [draft, loading, router]);

  if (!draft || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon icon="loader-2" className="w-8 h-8 animate-spin text-mid" />
      </div>
    );
  }

  const handleBack = () => {
    router.push('/new/theme');
  };

  const handlePublish = async () => {
    setError(null);
    setIsPublishing(true);

    try {
      const response = await fetch('/api/pages/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draft),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to publish page');
      }

      // Clear draft and redirect to the new page
      reset();
      router.push(`/${draft.slug}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      setIsPublishing(false);
    }
  };

  const handleGoogleAuth = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=/new/preview`,
      },
    });
  };

  const handleStartOver = () => {
    if (confirm('Start over? You will lose your current progress.')) {
      reset();
      router.push('/new');
    }
  };

  // Convert draft to page format for preview
  const previewPage = {
    display_name: draft.display_name || draft.slug,
    bio: draft.bio,
    avatar_url: draft.avatar_url,
    theme_id: draft.theme_id,
    slug: draft.slug,
  };

  const previewLinks = draft.links.map((link, index) => ({
    ...link,
    order: index,
    is_active: true,
  }));

  return (
    <div className="min-h-screen bg-low flex flex-col">
      {/* Header */}
      <header className="bg-bottom border-b border-low px-6 py-4 flex items-center justify-between">
        <Button size="sm" onClick={handleBack} className="gap-1">
          <Icon icon="arrow-left" className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-top">heybio.co/{draft.slug}</span>
        </div>
        
        <button onClick={handleStartOver} className="text-sm text-high hover:text-top">
          Start over
        </button>
      </header>

      {/* Preview toggle */}
      <div className="bg-bottom border-b border-low px-6 py-2 flex items-center justify-center gap-4">
        <button
          onClick={() => setShowMobilePreview(true)}
          className={`text-sm px-3 py-1 rounded-full ${
            showMobilePreview ? 'bg-top text-bottom' : 'text-top hover:bg-low'
          }`}
        >
          Mobile
        </button>
        <button
          onClick={() => setShowMobilePreview(false)}
          className={`text-sm px-3 py-1 rounded-full ${
            !showMobilePreview ? 'bg-top text-bottom' : 'text-top hover:bg-low'
          }`}
        >
          Desktop
        </button>
      </div>

      {/* Preview area */}
      <div className="flex-1 p-6 flex items-start justify-center overflow-auto">
        <div className={`bg-bottom rounded-3xl shadow-2xl overflow-hidden transition-all ${
          showMobilePreview ? 'w-[375px] h-[700px]' : 'w-full max-w-4xl h-auto min-h-[600px]'
        }`}>
          <div className="h-full overflow-auto">
            <BioPage
              page={previewPage}
              links={previewLinks}
              socialIcons={draft.social_icons}
              showBadge={true}
            />
          </div>
        </div>
      </div>

      {/* Publish CTA - Show auth if not logged in */}
      <div className="bg-bottom border-t border-low px-6 py-4">
        <div className="max-w-lg mx-auto flex flex-col gap-3">
          {error && (
            <div className="p-3 rounded-lg bg-orange/20 text-orange text-sm text-center">
              {error}
            </div>
          )}
          
          {!user ? (
            // Auth required
            <>
              <div className="text-center mb-2">
                <p className="text-top font-semibold">Almost there!</p>
                <p className="text-high text-sm">Create an account to publish your page</p>
              </div>
              
              <Button
                onClick={handleGoogleAuth}
                className="w-full py-6 text-lg gap-2"
              >
                <Icon icon="google" className="w-5 h-5" />
                Continue with Google
              </Button>
              
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-low" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-bottom text-mid">or</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full py-6 text-lg rounded-full"
                asChild
              >
                <Link href="/signup">Sign up with email</Link>
              </Button>
              
              <p className="text-xs text-center text-high">
                Already have an account?{' '}
                <Link href="/login" className="text-pink hover:underline">
                  Log in
                </Link>
              </p>
            </>
          ) : (
            // User logged in - show publish
            <>
              <Button
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-full py-6 text-lg rounded-full gap-2 bg-green text-top hover:bg-green/80"
              >
                {isPublishing ? (
                  <>
                    <Icon icon="loader-2" className="w-5 h-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Icon icon="sparkles" className="w-5 h-5" />
                    Publish my page
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-high">
                Publishing as {user.email}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
