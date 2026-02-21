import { createClient } from '@supabase/supabase-js';

/**
 * A cookie-free Supabase client for static/ISR pages.
 * Does NOT call cookies(), so it won't force pages into dynamic rendering.
 * Only use this for reading public data — no auth context available.
 */
export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
