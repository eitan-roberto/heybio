'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/Skeleton';
import { ConfirmSheet } from '@/components/ui/confirm-sheet';
import { createClient } from '@/lib/supabase/client';
import { useDashboardStore } from '@/stores/dashboardStore';
import { analyticsService } from '@/services/analyticsService';

export default function SettingsPage() {
  const router = useRouter();
  const { pages, setPages, getSelectedPage, selectPage } = useDashboardStore();
  const selectedPage = getSelectedPage();

  const [loading,          setLoading]          = useState(true);
  const [email,            setEmail]            = useState('');
  const [newPassword,      setNewPassword]      = useState('');
  const [confirmPassword,  setConfirmPassword]  = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [showDeletePage,   setShowDeletePage]   = useState(false);
  const [deletingPage,     setDeletingPage]     = useState(false);
  const [showDeleteAccount,setShowDeleteAccount]= useState(false);
  const [deletingAccount,  setDeletingAccount]  = useState(false);

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

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from('pages').delete().eq('user_id', user.id);
    await supabase.auth.signOut();
    analyticsService.track('account_deleted', {});
    router.push('/');
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

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
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeletePage(true)}
            >
              <Icon icon="trash-2" className="w-4 h-4" />
              Delete page
            </Button>
          </div>
        )}

        <div className="h-px bg-orange/20" />

        {/* Delete account */}
        <div className="space-y-2">
          <p className="text-sm text-high">
            Delete account — permanently removes your account and all pages. Cannot be undone.
          </p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteAccount(true)}
          >
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

      <ConfirmSheet
        open={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
        onConfirm={handleDeleteAccount}
        title="Delete your account?"
        description="This will permanently delete your account, all your pages, and all data. This cannot be undone."
        confirmText="Delete account"
        cancelText="Keep account"
        loading={deletingAccount}
      />
    </div>
  );
}
