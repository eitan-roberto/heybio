'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { useSubscription } from '@/hooks/useSubscription';

export function ProUpgradeBanner() {
  const { isPro, isTrialing, loading } = useSubscription();

  // Hide for pro users or while loading
  if (loading || isPro || isTrialing) return null;

  return (
    <Link
      href="/pricing"
      className="block rounded-3xl p-4 bg-gradient-to-r from-pink to-orange group hover:opacity-90 transition-opacity"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-top/20 flex items-center justify-center shrink-0">
          <Icon icon="sparkles" className="w-4 h-4 text-top" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-top">Try Pro free for 30 days</p>
          <p className="text-xs text-top/80">Premium themes, cover images & more · $2/mo after</p>
        </div>
        <Icon icon="arrow-right" className="w-4 h-4 text-top group-hover:translate-x-0.5 transition-transform shrink-0" />
      </div>
    </Link>
  );
}
