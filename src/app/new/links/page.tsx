'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { OnboardingLayout, LinkEditor } from '@/components/onboarding';
import { useOnboardingStore } from '@/stores/onboardingStore';

export default function AddLinksPage() {
  const router = useRouter();
  const { draft, addLink, updateLink, removeLink, reorderLinks } = useOnboardingStore();

  // Redirect if no draft exists
  useEffect(() => {
    if (!draft) {
      router.replace('/new');
    }
  }, [draft, router]);

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
            className="w-full py-6 text-lg rounded-xl"
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
