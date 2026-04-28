'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { SvgAsset } from '@/components/ui/svgasset';
import { analyticsService } from '@/services/analyticsService';
import { logService } from '@/services/logService';

export default function CheckoutStartPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  const initCheckout = async () => {
    setError(false);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });

      if (res.status === 401) {
        router.replace('/login?redirect=/checkout/start');
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error || 'no_url');

      analyticsService.track('checkout_started', {});
      window.location.href = data.checkoutUrl;
    } catch (err) {
      logService.error('checkout_start_error', { error: String(err) });
      setError(true);
    }
  };

  useEffect(() => { initCheckout(); }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-base">
      <SvgAsset src="/logos/logo-full.svg" height={36} className="invert" />

      {error ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-bottom flex items-center justify-center">
            <Icon icon="alert-circle" className="w-7 h-7 text-high" />
          </div>
          <p className="text-bottom font-medium">Something went wrong. Please try again.</p>
          <Button variant="pro" onClick={initCheckout}>
            <Icon icon="refresh-cw" className="w-4 h-4" />
            Try again
          </Button>
          <button
            onClick={() => router.push('/pricing')}
            className="text-sm text-bottom/60 hover:text-bottom transition-colors"
          >
            Back to pricing
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-pink/20 flex items-center justify-center">
            <Icon icon="loader-2" className="w-7 h-7 text-pink animate-spin" />
          </div>
          <p className="text-bottom font-medium">Setting up your free trial…</p>
          <p className="text-sm text-bottom/60">You'll be redirected to checkout in a moment.</p>
        </div>
      )}
    </div>
  );
}
