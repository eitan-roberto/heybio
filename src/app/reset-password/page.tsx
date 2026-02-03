'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SvgAsset } from '@/components/ui/svgasset';
import { createClient } from '@/lib/supabase/client';

function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if we have a session (user clicked the reset link)
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Invalid or expired reset link. Please request a new one.');
      }
    };
    
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md px-4">
      {/* Logo */}
      <Link href="/" className="block text-center mb-8 text-pink">
        <SvgAsset src="/logos/logo-full.svg" height={48} className="mx-auto" />
      </Link>

      {/* Card */}
      <div className="bg-bottom rounded-4xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-top">
          Set new password
        </h1>
        <p className="text-center text-high mb-8">
          Enter your new password below
        </p>

        {success ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mx-auto">
              <Icon icon="check" className="w-8 h-8 text-top" />
            </div>
            <p className="text-high">
              Your password has been updated successfully.
            </p>
            <Button
              className="w-full rounded-full bg-green text-top hover:bg-green/80"
              onClick={() => router.push('/login')}
            >
              Sign in
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-top">New Password</Label>
              <div className="relative">
                <Icon icon="lock" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-high" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 rounded-xl py-6 bg-low border-0"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-top">Confirm Password</Label>
              <div className="relative">
                <Icon icon="lock" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-high" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 rounded-xl py-6 bg-low border-0"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-orange/20 text-orange text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-full py-6 bg-green text-top hover:bg-green/80"
              disabled={loading}
            >
              {loading ? (
                <Icon icon="loader-2" className="w-5 h-5 animate-spin" />
              ) : (
                'Update password'
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full rounded-full"
              asChild
            >
              <Link href="/login">Back to login</Link>
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

function ResetPasswordFallback() {
  return (
    <div className="w-full max-w-md px-4">
      <div className="block text-center mb-8 text-pink">
        <SvgAsset src="/logos/logo-full.svg" height={48} className="mx-auto" />
      </div>
      <div className="bg-bottom rounded-4xl p-8 flex items-center justify-center min-h-[400px]">
        <Icon icon="loader-2" className="w-8 h-8 animate-spin text-mid" />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
