'use client';

import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { createClient } from '@/lib/supabase/client';

/**
 * Resolves the active page ID on the client.
 * Tries the Zustand store (selected page) first, falls back to the first page from Supabase.
 * Always starts as null to avoid hydration mismatches.
 */
export function usePageId(): string | null {
  const [pageId, setPageId] = useState<string | null>(null);

  useEffect(() => {
    const selected = useDashboardStore.getState().getSelectedPage();
    if (selected?.id) {
      setPageId(selected.id);
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from('pages')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .then(({ data }) => {
          if (data?.[0]) setPageId(data[0].id);
        });
    });
  }, []);

  return pageId;
}
