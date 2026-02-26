/**
 * Page Analytics Service
 * Fetches aggregated analytics from server-side API endpoints.
 * No raw rows ever hit the browser.
 */

export interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  totalClicks: number;
}

export interface DailyStat {
  date: string;
  views: number;
  uniqueVisitors: number;
  clicks: number;
}

export interface AnalyticsSource {
  source: string;
  count: number;
}

export interface AnalyticsCountry {
  country: string;
  count: number;
}

export interface AnalyticsDevice {
  device: string;
  count: number;
}

export interface AnalyticsLink {
  id: string;
  title: string;
  url: string;
  is_active: boolean;
  expires_at: string | null;
  clicks: number;
  ctr: number;
}

export interface DateRange {
  start: string; // YYYY-MM-DD UTC
  end: string;   // YYYY-MM-DD UTC
}

/** Build a DateRange for "last N days" (inclusive, UTC). */
export function dateRangeForDays(days: number): DateRange {
  const now = new Date();
  const start = new Date(now);
  start.setUTCDate(now.getUTCDate() - (days - 1));
  return {
    start: start.toISOString().split('T')[0],
    end: now.toISOString().split('T')[0],
  };
}

async function get<T>(path: string, pageId: string, range: DateRange): Promise<T> {
  const qs = new URLSearchParams({ pageId, start: range.start, end: range.end }).toString();
  const res = await fetch(`/api/analytics/${path}?${qs}`);
  if (!res.ok) throw new Error(`analytics_${path}_failed`);
  return res.json() as Promise<T>;
}

export const pageAnalyticsService = {
  getSummary: (pageId: string, range: DateRange) =>
    get<AnalyticsSummary>('summary', pageId, range),

  getDaily: (pageId: string, range: DateRange) =>
    get<DailyStat[]>('daily', pageId, range),

  getSources: (pageId: string, range: DateRange) =>
    get<AnalyticsSource[]>('sources', pageId, range),

  getCountries: (pageId: string, range: DateRange) =>
    get<AnalyticsCountry[]>('countries', pageId, range),

  getDevices: (pageId: string, range: DateRange) =>
    get<AnalyticsDevice[]>('devices', pageId, range),

  getLinks: (pageId: string, range: DateRange) =>
    get<AnalyticsLink[]>('links', pageId, range),
};
