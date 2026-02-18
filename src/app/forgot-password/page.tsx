'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SvgAsset } from '@/components/ui/svgasset';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
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
    <div className="min-h-screen flex items-center justify-center bg-bottom p-4">
      <div className="w-full max-w-md bg-bottom px-4">
        {/* Logo */}
        <Link href="/" className="block text-center mb-8 text-pink">
          <SvgAsset src="/logos/logo-full.svg" height={48} className="mx-auto" />
        </Link>

        {/* Card */}
        <div className="border border-2 border-low rounded-4xl p-6 md:p-8">
          <h1 className="text-2xl font-bold text-center mb-2 text-top">
            Reset your password
          </h1>
          <p className="text-center text-high mb-8">
            Enter your email and we&apos;ll send you a link to reset your password
          </p>

          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mx-auto">
                <Icon icon="check" className="w-8 h-8 text-top" />
              </div>
              <p className="text-high">
                Check your email for a link to reset your password.
              </p>
              <Button
                className="w-full rounded-full py-6"
                asChild
              >
                <Link href="/login">
                  Back to login
                  <Icon icon="arrow-right" className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-top">Email</Label>
                <div className="relative">
                  <Icon icon="mail" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-high" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 rounded-xl py-6 bg-bottom border-2 border-top"
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
                className="w-full rounded-full py-6"
                disabled={loading}
              >
                {loading ? (
                  <Icon icon="loader-2" className="w-5 h-5 animate-spin" />
                ) : (
                  'Send reset link'
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
