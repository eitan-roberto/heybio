'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const plan = searchParams.get('plan') || 'pro';

  useEffect(() => {
    const processCheckout = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // TODO: Integrate with Stripe
      // For now, simulate a successful upgrade after 2 seconds
      setTimeout(() => {
        setStatus('success');
        // In production, verify payment with Stripe webhook first
      }, 2000);
    };

    processCheckout();
  }, [router]);

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bottom p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green rounded-full flex items-center justify-center mx-auto">
            <Icon icon="check" className="w-10 h-10 text-top" />
          </div>
          <h1 className="text-3xl font-bold text-bottom">Welcome to Pro!</h1>
          <p className="text-mid">
            Your account has been upgraded. You now have access to all Pro features.
          </p>
          <Button 
            className="rounded-full bg-green text-top hover:bg-green/80"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bottom p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-pink rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Icon icon="loader-2" className="w-10 h-10 text-top animate-spin" />
        </div>
        <h1 className="text-3xl font-bold text-bottom">Processing...</h1>
        <p className="text-mid">
          Upgrading your account to {plan === 'pro' ? 'Pro' : plan} plan.
        </p>
      </div>
    </div>
  );
}

export default function CheckoutProcessing() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bottom p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-pink rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Icon icon="loader-2" className="w-10 h-10 text-top animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-bottom">Loading...</h1>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
