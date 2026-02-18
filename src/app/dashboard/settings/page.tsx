'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setEmail(user.email || '');
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleUpdateEmail = async () => {
    if (!email) return;
    setUpdating(true);
    setMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Check your new email for confirmation link');
    }
    setUpdating(false);
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setUpdating(true);
    setMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    }
    setUpdating(false);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    const supabase = createClient();
    
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      await supabase.from('pages').delete().eq('user_id', currentUser.id);
    }

    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Icon icon="loader-2" className="w-8 h-8 animate-spin text-mid" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-top">Settings</h1>

        {message && (
          <div className={cn(
            "rounded-4xl p-4",
            message.includes('Error') || message.includes('not match') ? 'bg-orange' : 'bg-green'
          )}>
            <p className="text-top text-sm">{message}</p>
          </div>
        )}

        <div className="rounded-4xl space-y-4">
          <h2 className="font-semibold text-top">Email</h2>
          <div>
            <label className="text-sm text-high block mb-1">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl bg-bottom border-2 border-top"
            />
          </div>
          <Button
            onClick={handleUpdateEmail}
            disabled={updating || email === user?.email}
            className="rounded-full bg-green text-top hover:bg-green/80"
          >
            {updating ? <Icon icon="loader-2" className="w-4 h-4 animate-spin" /> : 'Update Email'}
          </Button>
        </div>

        <div className="rounded-4xl space-y-4">
          <h2 className="font-semibold text-top">Change Password</h2>
          <div>
            <label className="text-sm text-high block mb-1">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-xl bg-bottom border-2 border-top"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-sm text-high block mb-1">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-xl bg-bottom border-2 border-top"
              placeholder="••••••••"
            />
          </div>
          <Button
            onClick={handleUpdatePassword}
            disabled={updating || !newPassword || !confirmPassword}
            className="rounded-full bg-green text-top hover:bg-green/80"
          >
            {updating ? <Icon icon="loader-2" className="w-4 h-4 animate-spin" /> : 'Update Password'}
          </Button>
        </div>

        <div className="rounded-4xl p-6 bg-orange/20 space-y-4">
          <h2 className="font-semibold text-orange">Danger Zone</h2>
          <p className="text-high text-sm">
            Once you delete your account, there is no going back. This will permanently delete your account and all your pages.
          </p>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            className="rounded-full bg-orange text-top hover:bg-orange/80"
          >
            <Icon icon="trash-2" className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>

        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteAccount}
          title="Delete your account?"
          description="This will permanently delete your account, all your bio pages, and all associated data. This action cannot be undone."
          confirmText="Delete Account"
          variant="danger"
        />
      </div>
    </DashboardLayout>
  );
}
