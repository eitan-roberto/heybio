import { logService } from './logService';
import { analyticsService } from './analyticsService';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://heybio.co';

export async function createCheckoutUrl(userId: string, email: string): Promise<string | null> {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'checkout_failed');
    analyticsService.track('checkout_started', { user_id: userId });
    return data.checkoutUrl as string;
  } catch (err) {
    logService.error('subscription_checkout_error', { error: err });
    return null;
  }
}

export function redirectToCheckout(url: string) {
  window.location.href = url;
}

export async function startTrialCheckout(userId: string, email: string) {
  const url = await createCheckoutUrl(userId, email);
  if (url) redirectToCheckout(url);
}
