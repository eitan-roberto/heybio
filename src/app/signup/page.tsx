'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

function SignupForm() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    router.push('/dashboard');
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-bottom rounded-4xl p-8 text-center">
          <Icon icon="check" className="w-16 h-16 text-green mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-top mb-2">Welcome!</h2>
          <p className="text-high mb-6">
            Check your email to confirm your account.
          </p>
          <Button className="w-full rounded-full py-6 bg-top text-bottom hover:bg-high" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <Link href="/" className="block text-center mb-8">
        <span className="text-4xl text-pink font-bold">heybio</span>
      </Link>

      {/* Card */}
      <div className="bg-bottom rounded-4xl p-8 shadow-xl ring-1 ring-low">
        <h1 className="text-2xl font-bold text-center mb-2 text-top">
          Create your account
        </h1>
        <p className="text-center text-high mb-8">
          Join creators who've already upgraded their presence
        </p>

        {/* Google Signup */}
        <Button
          type="button"
          className="w-full rounded-full py-6 mb-4 bg-top text-bottom hover:bg-high"
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          <Icon icon="github" className="w-5 h-5 mr-2" />
          Continue with Google
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-low" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-bottom text-mid">or</span>
          </div>
        </div>

        {/* Email Signup Form */}
        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-top">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl py-6"
              required
            />
          </div>

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
                className="pl-10 rounded-xl py-6"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-top">Password</Label>
            <div className="relative">
              <Icon icon="lock" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-high" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 rounded-xl py-6"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-900/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full rounded-full py-6 bg-top text-bottom hover:bg-high"
            disabled={loading}
          >
            {loading ? (
              <Icon icon="loader-2" className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Create account
                <Icon icon="arrow-right" className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-high">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      {/* Login link */}
      <p className="text-center mt-6 text-high">
        Already have an account?{' '}
        <Link href="/login" className="text-top font-medium hover:text-pink">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function SignupFallback() {
  return (
    <div className="w-full max-w-md">
      <div className="block text-center mb-8">
        <span className="text-4xl text-pink font-bold">heybio</span>
      </div>
      <div className="bg-bottom rounded-4xl p-8 shadow-xl ring-1 ring-low flex items-center justify-center min-h-[400px]">
        <Icon icon="loader-2" className="w-8 h-8 animate-spin text-mid" />
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-top px-4">
      <Suspense fallback={<SignupFallback />}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
