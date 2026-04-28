'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface SubscriptionInfo {
  plan: 'free' | 'pro';
  status: 'inactive' | 'trialing' | 'active' | 'cancelled' | 'expired';
  trialEndsAt: string | null;
  isTrialing: boolean;
  isPro: boolean;
  trialDaysLeft: number | null;
}

const DEFAULT: SubscriptionInfo = {
  plan: 'free',
  status: 'inactive',
  trialEndsAt: null,
  isTrialing: false,
  isPro: false,
  trialDaysLeft: null,
};

export function useSubscription() {
  const [info, setInfo] = useState<SubscriptionInfo>(DEFAULT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data: profile } = await supabase
          .from('profiles')
          .select('plan, subscription_status, trial_ends_at')
          .eq('id', user.id)
          .single();

        if (!profile) { setLoading(false); return; }

        const trialEndsAt = profile.trial_ends_at ?? null;
        const isTrialing = profile.subscription_status === 'trialing';
        const isPro = profile.plan === 'pro';

        let trialDaysLeft: number | null = null;
        if (isTrialing && trialEndsAt) {
          const diff = new Date(trialEndsAt).getTime() - Date.now();
          trialDaysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        }

        setInfo({
          plan: profile.plan as 'free' | 'pro',
          status: profile.subscription_status as SubscriptionInfo['status'],
          trialEndsAt,
          isTrialing,
          isPro,
          trialDaysLeft,
        });
      } catch {
        // noop
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { ...info, loading };
}
