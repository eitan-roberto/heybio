'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { createClient } from '@/lib/supabase/client';
import { startTrialCheckout } from '@/services/subscriptionService';
import { analyticsService } from '@/services/analyticsService';

interface TrialStartSheetProps {
  open: boolean;
  onClose: () => void;
  onUseFreeTheme: () => void;
  context?: 'theme' | 'cover';
}

export function TrialStartSheet({ open, onClose, onUseFreeTheme, context = 'theme' }: TrialStartSheetProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStartTrial = async () => {
    setLoading(true);
    analyticsService.track('pro_trial_started', { source: context });
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      await startTrialCheckout(user.id, user.email ?? '');
    } finally {
      setLoading(false);
    }
  };

  const contextText = context === 'cover'
    ? { title: 'Cover image is a Pro feature', body: 'Unlock cover images, premium themes, 30-day analytics, and more.' }
    : { title: 'This theme is Pro only', body: 'Unlock 12 premium themes, cover images, 30-day analytics, and more.' };

  return (
    <BottomSheet open={open} onClose={onClose} title={contextText.title}>
      <div className="space-y-5">
        <p className="text-sm text-high leading-relaxed">{contextText.body}</p>

        {/* Value props */}
        <div className="bg-pink/10 rounded-2xl p-4 space-y-2">
          {['12 premium themes', 'Cover image with parallax', '30-day analytics', 'No HeyBio badge'].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-top">
              <Icon icon="check" className="w-4 h-4 text-green shrink-0" />
              {f}
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs font-bold text-top">30 days free, then $2/month</p>
          <p className="text-xs text-mid mt-0.5">Cancel anytime · No surprise charges</p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleStartTrial}
            loading={loading}
            size="lg"
            className="w-full bg-pink hover:bg-pink/90 text-top font-bold"
          >
            <Icon icon="sparkles" className="w-4 h-4" />
            Start free trial
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="w-full"
            onClick={onUseFreeTheme}
            disabled={loading}
          >
            {context === 'cover' ? 'Remove cover image' : 'Use a free theme'}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
