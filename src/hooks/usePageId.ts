'use client';

import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { createClient } from '@/lib/supabase/client';

/**
 * Returns the active page ID, reactive to page-selector changes.
 * Starts as null to avoid hydration mismatches.
 */
export function usePageId(): string | null {
  const [pageId, setPageId] = useState<string | null>(null);

  // Subscribe to selectedPageId so the effect re-runs on every page switch
  const selectedPageId = useDashboardStore((state) => state.selectedPageId);

  useEffect(() => {
    const selected = useDashboardStore.getState().getSelectedPage();
    if (selected?.id) {
      setPageId(selected.id);
      return;
    }

    // Fallback: fetch first page from DB if store is empty
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
  }, [selectedPageId]); // re-run whenever the selected page changes

  return pageId;
}
