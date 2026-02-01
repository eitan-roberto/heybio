'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
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
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=/new`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-centerpx-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-bottom rounded-3xl p-8 shadow-xl ring-1 ring-low">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <Icon icon="mail" className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              Check your email
            </h1>
            <p className="text-top mb-6">
              We sent a confirmation link to <strong>{email}</strong>. 
              Click the link to activate your account.
            </p>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/login">Back to login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-centerpx-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="block text-center mb-8">
          <span className="text-3xl font-bold">HeyBio</span>
        </Link>

        {/* Card */}
        <div className="bg-bottom rounded-3xl p-8 shadow-xl ring-1 ring-low">
          <h1 className="text-2xl font-bold text-center mb-2">
            Create your account
          </h1>
          <p className="text-center text-top mb-8">
            Start building your bio page for free
          </p>

          {/* Google Signup */}
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full py-6 mb-4"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            Continue with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-low" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2text-top">or</span>
            </div>
          </div>

          {/* Email Signup Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <Icon icon="user" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-top" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 rounded-xl py-6"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Icon icon="mail" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-top" />
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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Icon icon="lock" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-top" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 rounded-xl py-6"
                  minLength={6}
                  required
                />
              </div>
              <p className="text-xs text-top">
                Must be at least 6 characters
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-full py-6 bg-top text-bottom hover:bg-high"
              disabled={loading}
            >
              {loading ? (
                <Icon icon="loader-2" className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create account
                  <Icon icon="arrow-right" className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-top mt-4">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="underline">Terms</Link> and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-top">
          Already have an account?{' '}
          <Link href="/login" className="text-top font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
