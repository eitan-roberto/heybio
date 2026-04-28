'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { analyticsService } from '@/services/analyticsService';

const PRO_PERKS = [
  { icon: 'palette', label: '12 premium themes unlocked' },
  { icon: 'image', label: 'Cover image with parallax' },
  { icon: 'bar-chart-2', label: '30-day analytics & insights' },
  { icon: 'badge-check', label: 'No HeyBio badge on your page' },
];

function CheckoutSuccessContent() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    analyticsService.track('checkout_completed', {});
  }, []);

  useEffect(() => {
    if (countdown <= 0) { router.push('/dashboard'); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-bottom flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-green rounded-full flex items-center justify-center mx-auto">
          <Icon icon="check" className="w-10 h-10 text-top" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-top">You're Pro!</h1>
          <p className="text-mid mt-2 text-sm">Your 30-day free trial has started. Enjoy all Pro features.</p>
        </div>

        {/* Perks */}
        <div className="bg-low/40 rounded-3xl p-5 text-left space-y-3">
          {PRO_PERKS.map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-green flex items-center justify-center shrink-0">
                <Icon icon={icon} className="w-4 h-4 text-top" />
              </div>
              <span className="text-sm font-medium text-top">{label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Button className="w-full" onClick={() => router.push('/dashboard/edit')}>
            Customize my page
          </Button>
          <p className="text-xs text-mid">Redirecting to dashboard in {countdown}s</p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Icon icon="loader-2" className="w-8 h-8 animate-spin text-mid" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
