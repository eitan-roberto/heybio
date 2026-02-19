'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { OnboardingLayout, LinkEditor } from '@/components/onboarding';
import { useOnboardingStore } from '@/stores/onboardingStore';

function LinksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { draft, initDraft, addLink, updateLink, removeLink, reorderLinks } = useOnboardingStore();

  // Initialize from ?u= parameter if no draft
  useEffect(() => {
    if (!draft) {
      const u = searchParams.get('u');
      if (u && u.length >= 3) {
        initDraft(u);
      } else {
        router.replace('/new');
      }
    }
  }, [draft, searchParams, router, initDraft]);

  if (!draft) {
    return null;
  }

  const handleContinue = () => {
    router.push('/new/theme');
  };

  const handleSkip = () => {
    router.push('/new/theme');
  };

  return (
    <OnboardingLayout
      step={2}
      title="Add your links"
      subtitle="Paste the links you want to share on your page"
      backPath="/new"
    >
      <div className="space-y-6">
        <LinkEditor
          links={draft.links}
          onAddLink={addLink}
          onUpdateLink={updateLink}
          onRemoveLink={removeLink}
          onReorderLinks={reorderLinks}
        />

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleContinue}
            className="w-full py-6 text-lg"
          >
            Continue
            <Icon icon="arrow-right" className="ml-2 w-5 h-5" />
          </Button>
          
          {draft.links.length === 0 && (
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-top"
            >
              Skip for now
            </Button>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
}

export default function AddLinksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Icon icon="loader-2" className="w-8 h-8 animate-spin text-mid" /></div>}>
      <LinksContent />
    </Suspense>
  );
}
