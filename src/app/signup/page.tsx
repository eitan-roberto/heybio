'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SvgAsset } from '@/components/ui/svgasset';
import { createClient } from '@/lib/supabase/client';
import { Suspense } from 'react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';

  const [name,          setName]          = useState('');
  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');
  const [emailLoading,  setEmailLoading]  = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setEmailLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    });
    if (error) { toast.error(error.message); setEmailLoading(false); return; }
    toast.success('Account created! Check your email if confirmation is required.');
    router.push(next);
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${next}` },
    });
    if (error) { toast.error(error.message); setGoogleLoading(false); }
  };

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="flex justify-center mb-8 text-pink">
        <SvgAsset src="/logos/logo-full.svg" height={40} />
      </Link>

      <div className="bg-bottom rounded-3xl p-6 shadow-sm border border-low">
        <h1 className="text-xl font-bold text-top mb-1">Create your account</h1>
        <p className="text-sm text-high mb-6">Free forever, no card needed</p>

        <Button
          onClick={handleGoogleSignup}
          loading={googleLoading}
          disabled={emailLoading}
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

        <form onSubmit={handleEmailSignup} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-high mb-1.5 block">Name</label>
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            <label className="text-xs font-semibold text-high mb-1.5 block">Password</label>
            <Input
              type="password"
              placeholder="6+ characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" loading={emailLoading} disabled={googleLoading} size="md" className="w-full mt-2">
            Create account
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-mid">
          By signing up you agree to our{' '}
          <Link href="/terms" className="hover:text-top underline">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="hover:text-top underline">Privacy Policy</Link>
        </p>
      </div>

      <p className="text-center mt-5 text-sm text-high">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-top hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <div className="h-10 w-32 bg-high/20 rounded-full animate-pulse" />
          </div>
          <div className="bg-bottom rounded-3xl p-6 h-96 animate-pulse" />
        </div>
      }>
        <SignupForm />
      </Suspense>
    </div>
  );
}
