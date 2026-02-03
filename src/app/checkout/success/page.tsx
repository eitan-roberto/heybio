'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // LemonSqueezy redirects back with these params on success
    // We could verify the signature here, but for now just show success
    const status = searchParams.get('status');
    
    // If payment was successful, we can update the user's plan
    // This is also handled by the webhook
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-top p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-green rounded-full flex items-center justify-center mx-auto">
          <Icon icon="check" className="w-10 h-10 text-top" />
        </div>
        <h1 className="text-3xl font-bold text-bottom">Welcome to Pro!</h1>
        <p className="text-mid">
          Your payment was successful. You now have access to all Pro features.
        </p>
        <div className="space-y-3">
          <Button 
            className="w-full rounded-full bg-green text-top hover:bg-green/80"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </Button>
          <Button 
            variant="outline"
            className="w-full rounded-full"
            onClick={() => router.push('/dashboard/settings')}
          >
            Manage Subscription
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-top p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Icon icon="loader-2" className="w-10 h-10 text-top animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-bottom">Confirming...</h1>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
