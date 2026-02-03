'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SvgAsset } from '@/components/ui/svgasset';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      {/* Logo */}
      <Link href="/" className="block text-center mb-8 text-pink">
        <SvgAsset src="/logos/logo-full.svg" height={48} className="mx-auto" />
      </Link>

      {/* Card */}
      <div className="bg-low rounded-4xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-top">
          Welcome back
        </h1>
        <p className="text-center text-high mb-8">
          Sign in to manage your bio page
        </p>

        {/* Google Login */}
        <Button
          type="button"
          className="w-full rounded-full py-6 mb-4 bg-blue text-top hover:bg-blue/80"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <Icon icon="github" className="w-5 h-5 mr-2" />
          Continue with Google
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-mid" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-low text-high">or</span>
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
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
                className="pl-10 rounded-xl py-6 bg-low border-0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-top">Password</Label>
              <Link href="/forgot-password" className="text-sm text-pink hover:underline">
                Forgot password?
              </Link>
            </div>
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
              <>
                Sign in
                <Icon icon="arrow-right" className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Sign up link */}
      <p className="text-center mt-6 text-high">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-pink font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="w-full max-w-md px-4">
      <div className="block text-center mb-8 text-pink">
        <SvgAsset src="/logos/logo-full.svg" height={48} className="mx-auto" />
      </div>
      <div className="bg-low rounded-4xl p-8 flex items-center justify-center min-h-[400px]">
        <Icon icon="loader-2" className="w-8 h-8 animate-spin text-mid" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
