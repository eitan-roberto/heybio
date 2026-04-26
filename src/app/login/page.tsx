'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SvgAsset } from '@/components/ui/svgasset';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    router.push(redirect);
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` },
    });
    if (error) { toast.error(error.message); setLoading(false); }
  };

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="flex justify-center mb-8 text-pink">
        <SvgAsset src="/logos/logo-full.svg" height={40} />
      </Link>

      <div className="bg-bottom rounded-3xl p-6 shadow-sm border border-low">
        <h1 className="text-xl font-bold text-top mb-1">Welcome back</h1>
        <p className="text-sm text-high mb-6">Sign in to manage your page</p>

        <Button
          onClick={handleGoogleLogin}
          loading={loading}
          size="md"
          className="w-full mb-4"
        >
          <Icon icon="google" className="w-4 h-4" />
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-low" />
          <span className="text-xs text-mid">or</span>
          <div className="flex-1 h-px bg-low" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-high mb-1.5 block">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-high">Password</label>
              <Link href="/forgot-password" className="text-xs text-mid hover:text-top transition-colors">
                Forgot?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" loading={loading} size="md" className="w-full mt-2">
            Sign in
          </Button>
        </form>
      </div>

      <p className="text-center mt-5 text-sm text-high">
        No account?{' '}
        <Link href="/signup" className="font-semibold text-top hover:underline">
          Sign up free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <div className="h-10 w-32 bg-high/20 rounded-full animate-pulse" />
          </div>
          <div className="bg-bottom rounded-3xl p-6 h-80 animate-pulse" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
