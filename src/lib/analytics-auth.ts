import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseClient } from '@supabase/supabase-js';

export interface AnalyticsContext {
  supabase: SupabaseClient;
  pageId: string;
  /** ISO timestamp — lower bound for created_at queries */
  since: string;
  /** ISO timestamp — upper bound for created_at queries */
  until: string;
  /** YYYY-MM-DD — first day of the range (UTC) */
  startDate: string;
  /** YYYY-MM-DD — last day of the range (UTC) */
  endDate: string;
}

/**
 * Validates auth + page ownership for analytics API routes.
 *
 * Accepts either:
 *   ?pageId=xxx&days=7          (days back from now)
 *   ?pageId=xxx&start=YYYY-MM-DD&end=YYYY-MM-DD  (explicit range)
 *
 * Returns context on success or a NextResponse error to return early.
 */
export async function getAnalyticsContext(
  request: NextRequest
): Promise<AnalyticsContext | NextResponse> {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get('pageId');

  if (!pageId) {
    return NextResponse.json({ error: 'pageId required' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: page } = await supabase
    .from('pages')
    .select('id')
    .eq('id', pageId)
    .eq('user_id', user.id)
    .single();

  if (!page) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Date range: prefer explicit start/end, fall back to days
  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');

  let startDate: string;
  let endDate: string;
  let since: string;
  let until: string;

  if (startParam && endParam) {
    startDate = startParam;
    endDate = endParam;
    since = startDate + 'T00:00:00.000Z';
    until = endDate + 'T23:59:59.999Z';
  } else {
    const days = Math.min(parseInt(searchParams.get('days') ?? '7'), 90);
    const now = new Date();
    const start = new Date(now);
    start.setUTCDate(now.getUTCDate() - (days - 1));
    startDate = start.toISOString().split('T')[0];
    endDate = now.toISOString().split('T')[0];
    since = startDate + 'T00:00:00.000Z';
    until = endDate + 'T23:59:59.999Z';
  }

  return { supabase, pageId, since, until, startDate, endDate };
}

export function isErrorResponse(
  ctx: AnalyticsContext | NextResponse
): ctx is NextResponse {
  return ctx instanceof NextResponse;
}

/** Build a gap-filled date map from startDate to endDate (inclusive, UTC). */
export function buildDailyMap(startDate: string, endDate: string) {
  const map: Record<string, { views: number; visitors: Set<string>; clicks: number }> = {};
  const cur = new Date(startDate + 'T00:00:00.000Z');
  const end = new Date(endDate + 'T00:00:00.000Z');
  while (cur <= end) {
    map[cur.toISOString().split('T')[0]] = { views: 0, visitors: new Set(), clicks: 0 };
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return map;
}

/** Extract UTC date string from a Supabase timestamp (handles both T and space separators). */
export function toUTCDate(timestamp: string): string {
  return timestamp.split('T')[0].split(' ')[0];
}
