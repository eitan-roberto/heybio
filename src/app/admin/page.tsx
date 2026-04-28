'use client';

import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { formatCount } from '@/lib/utils';
import { logService } from '@/services/logService';

interface AdminStats {
  totalUsers: number;
  totalPages: number;
  proUsers: number;
  trialingUsers: number;
  signupsByDay: Record<string, number>;
  payingByDay: Record<string, number>;
}

interface Promotion {
  id: string;
  code: string;
  description: string | null;
  free_trial_days: number;
  discount_percent: number;
  max_uses: number | null;
  uses_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

interface TrialingUser {
  id: string;
  email: string;
  trial_ends_at: string | null;
  trial_started_at: string | null;
  created_at: string;
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className={`${color} rounded-3xl p-5`}>
      <div className="text-2xl font-bold text-top leading-none">{value}</div>
      <div className="text-xs font-medium text-top/70 mt-1">{label}</div>
    </div>
  );
}

function buildChartData(signupsByDay: Record<string, number>, payingByDay: Record<string, number>) {
  const allDates = new Set([...Object.keys(signupsByDay), ...Object.keys(payingByDay)]);
  const sorted = Array.from(allDates).sort();
  return sorted.map((date) => ({
    date,
    views: signupsByDay[date] ?? 0,
    uniqueVisitors: payingByDay[date] ?? 0,
    clicks: 0,
  }));
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [trials, setTrials] = useState<TrialingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'promotions' | 'trials'>('overview');

  // Promotion form
  const [promoCode, setPromoCode] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [promoTrialDays, setPromoTrialDays] = useState('30');
  const [promoMaxUses, setPromoMaxUses] = useState('');
  const [promoExpires, setPromoExpires] = useState('');
  const [savingPromo, setSavingPromo] = useState(false);

  const load = useCallback(async () => {
    try {
      const [statsRes, promosRes, trialsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/promotions'),
        fetch('/api/admin/trials'),
      ]);
      const [statsData, promosData, trialsData] = await Promise.all([
        statsRes.json(),
        promosRes.json(),
        trialsRes.json(),
      ]);
      setStats(statsData);
      setPromotions(Array.isArray(promosData) ? promosData : []);
      setTrials(Array.isArray(trialsData) ? trialsData : []);
    } catch (err) {
      logService.error('admin_load_error', { error: err });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreatePromo = async () => {
    if (!promoCode.trim()) return;
    setSavingPromo(true);
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode,
          description: promoDesc || null,
          free_trial_days: parseInt(promoTrialDays) || 30,
          max_uses: promoMaxUses ? parseInt(promoMaxUses) : null,
          expires_at: promoExpires || null,
        }),
      });
      if (res.ok) {
        const promo = await res.json();
        setPromotions((prev) => [promo, ...prev]);
        setPromoCode(''); setPromoDesc(''); setPromoTrialDays('30'); setPromoMaxUses(''); setPromoExpires('');
      }
    } finally {
      setSavingPromo(false);
    }
  };

  const togglePromo = async (id: string, is_active: boolean) => {
    const res = await fetch('/api/admin/promotions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !is_active }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPromotions((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
  };

  const cancelTrial = async (userId: string) => {
    const res = await fetch('/api/admin/trials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      setTrials((prev) => prev.filter((t) => t.id !== userId));
    }
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
    { id: 'promotions', label: 'Promotions', icon: 'tag' },
    { id: 'trials', label: `Trials (${trials.length})`, icon: 'clock' },
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-bottom flex items-center justify-center">
        <Icon icon="loader-2" className="w-8 h-8 animate-spin text-mid" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bottom">
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-top">Admin</h1>
            <p className="text-sm text-mid mt-0.5">HeyBio dashboard</p>
          </div>
          <button onClick={load} className="w-9 h-9 rounded-xl bg-low flex items-center justify-center hover:bg-low/70 transition-colors">
            <Icon icon="refresh-cw" className="w-4 h-4 text-high" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-top text-bottom' : 'bg-low/50 text-high hover:bg-low'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Total users" value={formatCount(stats.totalUsers)} color="bg-green" />
              <StatCard label="Total pages" value={formatCount(stats.totalPages)} color="bg-blue" />
              <StatCard label="Paying (active)" value={formatCount(stats.proUsers)} color="bg-pink" />
              <StatCard label="On trial" value={formatCount(stats.trialingUsers)} color="bg-yellow" />
            </div>

            <div className="bg-low/30 rounded-3xl p-5">
              <p className="text-sm font-semibold text-top mb-4">Last 30 days — signups vs upgrades</p>
              <ActivityChart data={buildChartData(stats.signupsByDay, stats.payingByDay)} />
              <div className="flex gap-4 mt-3 text-xs text-mid">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green inline-block" />Signups</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue inline-block" />Upgrades</span>
              </div>
            </div>
          </div>
        )}

        {/* PROMOTIONS */}
        {tab === 'promotions' && (
          <div className="space-y-4">
            {/* Create form */}
            <div className="bg-low/30 rounded-3xl p-5 space-y-4">
              <p className="text-sm font-semibold text-top">New promotion</p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Code (e.g. LAUNCH30)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                />
                <Input
                  placeholder="Description"
                  value={promoDesc}
                  onChange={(e) => setPromoDesc(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Trial days (default 30)"
                  value={promoTrialDays}
                  onChange={(e) => setPromoTrialDays(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max uses (blank = unlimited)"
                  value={promoMaxUses}
                  onChange={(e) => setPromoMaxUses(e.target.value)}
                />
                <Input
                  type="datetime-local"
                  placeholder="Expires at"
                  value={promoExpires}
                  onChange={(e) => setPromoExpires(e.target.value)}
                  className="col-span-2"
                />
              </div>
              <Button onClick={handleCreatePromo} loading={savingPromo} disabled={!promoCode.trim()} size="sm">
                <Icon icon="plus" className="w-4 h-4" />
                Create promotion
              </Button>
            </div>

            {/* List */}
            {promotions.length === 0 ? (
              <p className="text-sm text-mid text-center py-8">No promotions yet.</p>
            ) : (
              <div className="space-y-2">
                {promotions.map((promo) => (
                  <div key={promo.id} className="bg-bottom border border-low rounded-2xl p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-top text-sm font-mono">{promo.code}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${promo.is_active ? 'bg-green text-top' : 'bg-low text-mid'}`}>
                          {promo.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-mid mt-0.5">
                        {promo.free_trial_days}d trial · {promo.uses_count}/{promo.max_uses ?? '∞'} uses
                        {promo.description && ` · ${promo.description}`}
                      </p>
                    </div>
                    <button
                      onClick={() => togglePromo(promo.id, promo.is_active)}
                      className="text-xs px-3 py-1.5 rounded-xl border border-low text-high hover:border-top hover:text-top transition-colors"
                    >
                      {promo.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TRIALS */}
        {tab === 'trials' && (
          <div className="space-y-2">
            {trials.length === 0 ? (
              <p className="text-sm text-mid text-center py-8">No active trials.</p>
            ) : (
              trials.map((t) => {
                const daysLeft = t.trial_ends_at
                  ? Math.max(0, Math.ceil((new Date(t.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  : null;
                return (
                  <div key={t.id} className="bg-bottom border border-low rounded-2xl p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-top truncate">{t.email}</p>
                      <p className="text-xs text-mid mt-0.5">
                        {daysLeft !== null ? `${daysLeft} days left` : 'Trial active'}
                        {t.trial_ends_at && ` · ends ${new Date(t.trial_ends_at).toLocaleDateString()}`}
                      </p>
                    </div>
                    <button
                      onClick={() => cancelTrial(t.id)}
                      className="text-xs px-3 py-1.5 rounded-xl border border-orange/40 text-orange hover:bg-orange/10 transition-colors"
                    >
                      Cancel trial
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
