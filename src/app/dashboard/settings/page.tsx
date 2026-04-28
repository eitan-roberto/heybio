'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/Skeleton';
import { ConfirmSheet } from '@/components/ui/confirm-sheet';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { createClient } from '@/lib/supabase/client';
import { useDashboardStore } from '@/stores/dashboardStore';
import { analyticsService } from '@/services/analyticsService';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

function BillingPortalButton() {
  const [loading, setLoading] = useState(false);

  const open = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/billing-portal');
      const { url } = await res.json();
      if (url) window.open(url, '_blank', 'noopener');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="sm" variant="outline" onClick={open} loading={loading}>
      <Icon icon="receipt" className="w-4 h-4" />
      Invoices, receipts & cancel
    </Button>
  );
}

function DeleteAccountSheet({
  open,
  onClose,
  hasActiveSubscription,
}: {
  open: boolean;
  onClose: () => void;
  hasActiveSubscription: boolean;
}) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return;
    setDeleting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await supabase.from('pages').delete().eq('user_id', user.id);
      await supabase.auth.signOut();
      analyticsService.track('account_deleted', {});
      router.push('/');
    } catch {
      toast.error('Could not delete account. Try again.');
      setDeleting(false);
    }
  };

  const handleOpenPortal = async () => {
    setOpeningPortal(true);
    try {
      const res = await fetch('/api/billing-portal');
      const { url } = await res.json();
      if (url) window.open(url, '_blank', 'noopener');
    } finally {
      setOpeningPortal(false);
    }
  };

  // Reset when closed
  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={handleClose} title="Delete account">
      {hasActiveSubscription ? (
        <div className="space-y-5">
          <div className="flex gap-3 p-4 rounded-2xl bg-orange/10 border border-orange/20">
            <Icon icon="alert-triangle" className="w-5 h-5 text-orange shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-top">Active subscription detected</p>
              <p className="text-sm text-high leading-relaxed">
                Cancel your Pro subscription before deleting your account. Otherwise you'll keep getting charged with no account to use.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Button
              size="md"
              className="w-full"
              onClick={handleOpenPortal}
              loading={openingPortal}
            >
              <Icon icon="receipt" className="w-4 h-4" />
              Cancel subscription first
            </Button>
            <Button variant="ghost" size="md" className="w-full" onClick={handleClose}>
              Keep my account
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm text-high leading-relaxed">
              This will permanently delete:
            </p>
            <ul className="space-y-1.5 text-sm text-high">
              {['Your account and login', 'All bio pages you created', 'All links and social icons', 'All analytics data', 'Everything. Forever.'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Icon icon="x" className="w-3.5 h-3.5 text-orange shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-top">
              Type <span className="font-mono bg-low px-1.5 py-0.5 rounded text-orange">DELETE</span> to confirm
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder="DELETE"
              className={cn(
                'font-mono transition-colors',
                confirmText === 'DELETE' && 'border-orange focus:ring-orange/20'
              )}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>

          <div className="space-y-2">
            <Button
              variant="danger"
              size="md"
              className="w-full"
              onClick={handleDelete}
              disabled={confirmText !== 'DELETE'}
              loading={deleting}
            >
              <Icon icon="trash-2" className="w-4 h-4" />
              Delete my account permanently
            </Button>
            <Button variant="ghost" size="md" className="w-full" onClick={handleClose} disabled={deleting}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { pages, setPages, getSelectedPage, selectPage } = useDashboardStore();
  const selectedPage = getSelectedPage();

  const subscription = useSubscription();
  const [loading,          setLoading]          = useState(true);
  const [email,            setEmail]            = useState('');
  const [newPassword,      setNewPassword]      = useState('');
  const [confirmPassword,  setConfirmPassword]  = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [showDeletePage,   setShowDeletePage]   = useState(false);
  const [deletingPage,     setDeletingPage]     = useState(false);
  const [showDeleteAccount,setShowDeleteAccount]= useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setEmail(user.email || '');
      setLoading(false);
    };
    load();
  }, []);

  const handleUpdatePassword = async () => {
    if (!newPassword) return;
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setUpdatingPassword(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated!');
      setNewPassword('');
      setConfirmPassword('');
    }
    setUpdatingPassword(false);
  };

  const handleDeletePage = async () => {
    if (!selectedPage) return;
    setDeletingPage(true);
    const supabase = createClient();
    const { error } = await supabase.from('pages').delete().eq('id', selectedPage.id);
    if (error) {
      toast.error('Could not delete page. Try again.');
      setDeletingPage(false);
      return;
    }
    const remaining = pages.filter((p) => p.id !== selectedPage.id);
    setPages(remaining);
    if (remaining.length > 0) selectPage(remaining[0].id);
    analyticsService.track('page_deleted', { page_id: selectedPage.id });
    toast.success('Page deleted');
    router.push('/dashboard');
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Block deletion if subscription is active or trialing
  const hasActiveSubscription = subscription.isPro &&
    (subscription.status === 'active' || subscription.status === 'trialing');

  if (loading) {
    return (
      <div className="space-y-6 max-w-lg">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-32 rounded-3xl" />
        <Skeleton className="h-40 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-lg">
      <h1 className="text-xl font-bold text-top">Settings</h1>

      {/* Account info */}
      <div className="bg-bottom border border-low rounded-3xl p-5 space-y-1">
        <p className="text-sm font-semibold text-top">Account</p>
        <p className="text-sm text-mid">{email}</p>
      </div>

      {/* Subscription */}
      {!subscription.loading && (
        <div className="bg-bottom border border-low rounded-3xl p-5 space-y-3">
          <p className="text-sm font-semibold text-top">Plan</p>
          {subscription.isPro ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink text-top">PRO</span>
                {subscription.isTrialing && subscription.trialDaysLeft !== null && (
                  <span className="text-xs text-mid">Trial ends in {subscription.trialDaysLeft} day{subscription.trialDaysLeft !== 1 ? 's' : ''}</span>
                )}
                {subscription.status === 'active' && <span className="text-xs text-mid">Active · $2/month</span>}
                {subscription.status === 'cancelled' && <span className="text-xs text-orange">Cancelled · access until period ends</span>}
              </div>
              <BillingPortalButton />
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-mid">You're on the Free plan.</p>
              <Button variant="pro" size="sm" asChild>
                <NextLink href="/pricing">
                  <Icon icon="sparkles" className="w-4 h-4" />
                  Start 30-day free trial
                </NextLink>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Password */}
      <div className="bg-bottom border border-low rounded-3xl p-5 space-y-4">
        <p className="text-sm font-semibold text-top">Change password</p>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
        />
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />
        <Button
          onClick={handleUpdatePassword}
          loading={updatingPassword}
          disabled={!newPassword || !confirmPassword}
          variant="success"
          size="sm"
        >
          Update password
        </Button>
      </div>

      {/* Log out (mobile only) */}
      <div className="md:hidden bg-bottom border border-low rounded-3xl p-5">
        <Button variant="outline" size="md" className="w-full" onClick={handleLogout}>
          <Icon icon="log-out" className="w-4 h-4" />
          Log out
        </Button>
      </div>

      {/* Danger zone */}
      <div className="border-2 border-orange/30 rounded-3xl p-5 space-y-4">
        <p className="text-sm font-semibold text-orange">Danger zone</p>

        {/* Delete page */}
        {selectedPage && (
          <div className="space-y-2">
            <p className="text-sm text-high">
              Delete <span className="font-semibold text-top">{selectedPage.displayName}</span> — removes the page and all its links permanently.
            </p>
            <Button variant="danger" size="sm" onClick={() => setShowDeletePage(true)}>
              <Icon icon="trash-2" className="w-4 h-4" />
              Delete page
            </Button>
          </div>
        )}

        <div className="h-px bg-orange/20" />

        {/* Delete account */}
        <div className="space-y-2">
          <p className="text-sm text-high">
            Delete account — permanently removes your account, all pages, and all data.
          </p>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteAccount(true)}>
            <Icon icon="trash-2" className="w-4 h-4" />
            Delete account
          </Button>
        </div>
      </div>

      <ConfirmSheet
        open={showDeletePage}
        onClose={() => setShowDeletePage(false)}
        onConfirm={handleDeletePage}
        title={`Delete "${selectedPage?.displayName}"?`}
        description="This will permanently delete this page and all its links. This cannot be undone."
        confirmText="Delete page"
        cancelText="Keep it"
        loading={deletingPage}
      />

      <DeleteAccountSheet
        open={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
        hasActiveSubscription={hasActiveSubscription}
      />
    </div>
  );
}
