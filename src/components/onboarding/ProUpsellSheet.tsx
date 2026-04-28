'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { analyticsService } from '@/services/analyticsService';

interface ProUpsellSheetProps {
  open: boolean;
  onSkip: () => void;
}

const PRO_HIGHLIGHTS = [
  { icon: 'image', label: 'Cover image with parallax effect' },
  { icon: 'palette', label: '12 premium themes' },
  { icon: 'bar-chart-2', label: '30-day analytics & traffic sources' },
  { icon: 'badge-check', label: 'No HeyBio badge' },
];

export function ProUpsellSheet({ open, onSkip }: ProUpsellSheetProps) {
  const router = useRouter();

  const handleStartTrial = () => {
    analyticsService.track('pro_upsell_trial_clicked', { source: 'post_creation' });
    router.push('/checkout/start');
  };

  const handleSkip = () => {
    analyticsService.track('pro_upsell_skipped', { source: 'post_creation' });
    onSkip();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-top/60 backdrop-blur-sm" onClick={handleSkip} />

      <div className="relative z-10 w-full bg-bottom rounded-t-3xl shadow-2xl overflow-hidden">
        {/* Gradient header */}
        <div className="bg-gradient-to-br from-pink to-orange p-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-top bg-top/20 px-3 py-1 rounded-full">30-day free trial</span>
            <button
              onClick={handleSkip}
              className="w-8 h-8 rounded-full bg-top/20 flex items-center justify-center text-top hover:bg-top/30 transition-colors"
            >
              <Icon icon="x" className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-top leading-tight">
            Take your page to<br />the next level
          </h2>
          <p className="text-top/80 text-sm mt-2">Try Pro free for 30 days — $2/month after.</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            {PRO_HIGHLIGHTS.map(({ icon, label }) => (
              <div key={label} className="flex items-start gap-2.5 p-3 rounded-2xl bg-low/40">
                <div className="w-7 h-7 rounded-xl bg-pink flex items-center justify-center shrink-0 mt-0.5">
                  <Icon icon={icon} className="w-3.5 h-3.5 text-top" />
                </div>
                <span className="text-xs font-medium text-top leading-snug">{label}</span>
              </div>
            ))}
          </div>

          {/* Pricing note */}
          <div className="flex items-center justify-center gap-2 text-xs text-mid">
            <Icon icon="credit-card" className="w-3.5 h-3.5" />
            <span>Card required · Cancel anytime · $2/mo after trial</span>
          </div>

          {/* CTAs */}
          <div className="space-y-2">
            <Button
              onClick={handleStartTrial}
              variant="pro"
              size="lg"
              className="w-full font-bold"
            >
              <Icon icon="sparkles" className="w-4 h-4" />
              Start 30-day free trial
            </Button>
            <button
              onClick={handleSkip}
              className="w-full py-3 text-sm text-mid hover:text-top transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
