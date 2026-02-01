'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { BioPage } from '@/components/bio-page';
import { useOnboardingStore } from '@/stores/onboardingStore';

export default function PreviewPage() {
  const router = useRouter();
  const { draft, reset } = useOnboardingStore();
  const [showMobilePreview, setShowMobilePreview] = useState(true);

  // Redirect if no draft exists
  useEffect(() => {
    if (!draft) {
      router.replace('/new');
    }
  }, [draft, router]);

  if (!draft) {
    return null;
  }

  const handleBack = () => {
    router.push('/new/theme');
  };

  const handlePublish = () => {
    // TODO: In real app, this would create an account and save the page
    // For now, just show a success message and reset
    alert(`Your page heybio.co/${draft.slug} is ready!\n\nNote: Signup coming soon. For now, this is just a preview.`);
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
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-1"
        >
          <Icon icon="arrow-left" className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-top">heybio.co/{draft.slug}</span>
          <button
            onClick={() => window.open(`#preview`, '_blank')}
            className="p-1 text-top hover:text-top"
            title="Open in new tab"
          >
            <Icon icon="external-link" className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleStartOver}
            className="text-sm text-top hover:text-top"
          >
            Start over
          </button>
        </div>
      </header>

      {/* Preview toggle */}
      <div className="bg-bottom border-b border-low px-6 py-2 flex items-center justify-center gap-4">
        <button
          onClick={() => setShowMobilePreview(true)}
          className={`text-sm px-3 py-1 rounded-full ${
            showMobilePreview 
              ? 'bg-top text-bottom' 
              : 'text-top hover:bg-low'
          }`}
        >
          Mobile
        </button>
        <button
          onClick={() => setShowMobilePreview(false)}
          className={`text-sm px-3 py-1 rounded-full ${
            !showMobilePreview 
              ? 'bg-top text-bottom' 
              : 'text-top hover:bg-low'
          }`}
        >
          Desktop
        </button>
      </div>

      {/* Preview area */}
      <div className="flex-1 p-6 flex items-start justify-center overflow-auto">
        <div 
          className={`bg-bottom rounded-3xl shadow-2xl overflow-hidden transition-all ${
            showMobilePreview 
              ? 'w-[375px] h-[700px]' 
              : 'w-full max-w-4xl h-auto min-h-[600px]'
          }`}
        >
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

      {/* Publish CTA */}
      <div className="bg-bottom border-t border-low px-6 py-4">
        <div className="max-w-lg mx-auto flex flex-col gap-3">
          <Button
            onClick={handlePublish}
            className="w-full py-6 text-lg rounded-xl gap-2"
          >
            <Icon icon="sparkles" className="w-5 h-5" />
            Publish my page
          </Button>
          <p className="text-xs text-center text-top">
            Create a free account to save your page and access it anytime
          </p>
        </div>
      </div>
    </div>
  );
}
