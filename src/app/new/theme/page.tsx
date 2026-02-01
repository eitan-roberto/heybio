'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { OnboardingLayout, ThemePicker } from '@/components/onboarding';
import { useOnboardingStore } from '@/stores/onboardingStore';

export default function ChooseThemePage() {
  const router = useRouter();
  const { draft, setThemeId } = useOnboardingStore();

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
    router.push('/new/preview');
  };

  return (
    <OnboardingLayout
      step={3}
      title="Pick your style"
      subtitle="Choose a theme that matches your vibe"
      backPath="/new/links"
    >
      <div className="space-y-6">
        <ThemePicker
          selectedThemeId={draft.theme_id}
          onSelectTheme={setThemeId}
          showProThemes={true}
        />

        {/* Continue button */}
        <Button
          onClick={handleContinue}
          className="w-full py-6 text-lg rounded-xl"
        >
          Continue
          <Icon icon="arrow-right" className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </OnboardingLayout>
  );
}
