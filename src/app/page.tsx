'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Zap, Sparkles, Eye, MousePointerClick, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Stunning themes',
    description: 'Pick from beautiful, curated themes. No design skills needed.',
  },
  {
    icon: Zap,
    title: 'Lightning fast',
    description: 'Your page loads in under a second. Better for visitors, better for SEO.',
  },
  {
    icon: Eye,
    title: 'Actionable analytics',
    description: 'Know what works. See where your visitors come from and what they click.',
  },
];

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Content Creator', text: 'Finally a bio link that matches my aesthetic!' },
  { name: 'Alex M.', role: 'Musician', text: 'Simple, fast, beautiful. Exactly what I needed.' },
  { name: 'Jordan T.', role: 'Designer', text: 'The themes are gorgeous. My followers love it.' },
  { name: 'Maria L.', role: 'Influencer', text: 'Switched from Linktree and never looked back.' },
];

export default function LandingPage() {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      window.location.href = `/new?u=${username}`;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full bg-white/80 px-6 py-3 shadow-lg backdrop-blur-xl">
          <Link href="/" className="font-heading text-2xl font-bold tracking-tight">
            HeyBio
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="sm" className="rounded-full" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" className="rounded-full bg-black text-white hover:bg-gray-800" asChild>
              <Link href="/new">Get started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-20 pt-32 md:px-8 md:pb-32 md:pt-40">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-md">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-brand)]" />
            <span className="text-[var(--color-muted)]">Free forever, no credit card required</span>
          </div>

          {/* Main Heading - HUGE */}
          <h1 className="font-heading text-5xl font-bold leading-[1.1] tracking-tight text-black md:text-7xl lg:text-8xl">
            Finally, a bio link
            <br />
            <span className="text-[var(--color-gray-400)]">that looks good.</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--color-muted)] md:mt-8 md:text-xl">
            One page for everything you share. Stunning design. Lightning fast. Always free.
          </p>

          {/* CTA Form */}
          <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md md:mt-12">
            <div className="flex items-center gap-2 rounded-full bg-white p-2 shadow-xl shadow-gray-200/50 ring-1 ring-gray-100 transition-shadow focus-within:ring-2 focus-within:ring-black/10">
              <span className="pl-4 text-lg text-[var(--color-gray-400)]">heybio.co/</span>
              <Input
                type="text"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className="flex-1 border-0 bg-transparent text-lg placeholder:text-gray-300 focus-visible:ring-0"
              />
              <Button 
                type="submit" 
                disabled={!username.trim()}
                className="rounded-full bg-black px-6 py-6 text-white hover:bg-gray-800"
              >
                <span className="mr-2 hidden sm:inline">Claim it</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </form>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--color-gray-400)]">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-500" />
              No signup required
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              Ready in seconds
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Beautiful by default
            </span>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="overflow-hidden border-y border-gray-200 bg-white py-4">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div key={i} className="mx-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand)] text-sm font-bold text-white">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-black">&quot;{t.text}&quot;</p>
                <p className="text-xs text-[var(--color-muted)]">{t.name} · {t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-16 text-center md:mb-20">
            <h2 className="font-heading text-4xl font-bold tracking-tight text-black md:text-5xl lg:text-6xl">
              Everything you need,
              <br />
              <span className="text-[var(--color-gray-400)]">nothing you don&apos;t.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--color-muted)] md:mt-6 md:text-lg">
              We focused on what actually matters. Beautiful pages that load fast and help you grow.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="group rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-lg hover:ring-gray-200 md:p-10"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 transition-colors group-hover:bg-[var(--color-brand)] group-hover:text-white">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-black md:text-2xl">
                  {feature.title}
                </h3>
                <p className="mt-3 text-[var(--color-muted)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="mb-16 text-center md:mb-20">
            <h2 className="font-heading text-4xl font-bold tracking-tight text-black md:text-5xl lg:text-6xl">
              Simple pricing
            </h2>
            <p className="mt-4 text-[var(--color-muted)] md:text-lg">
              Start free. Upgrade when you need more.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {/* Free Plan */}
            <div className="rounded-3xl bg-white p-8 ring-1 ring-gray-200 md:p-10">
              <div className="text-sm font-medium text-[var(--color-muted)]">Free</div>
              <div className="mt-2 font-heading text-5xl font-bold text-black">$0</div>
              <p className="mt-4 text-[var(--color-muted)]">Everything you need to get started</p>

              <ul className="mt-8 space-y-4">
                {['Unlimited links', '6 beautiful themes', 'Basic analytics', 'Social icons', 'Mobile optimized'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-700">
                    <Check className="h-5 w-5 flex-shrink-0 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button variant="outline" className="mt-8 w-full rounded-full py-6" asChild>
                <Link href="/new">Start for free</Link>
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="relative overflow-hidden rounded-3xl bg-black p-8 text-white md:p-10">
              <div className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                Popular
              </div>
              <div className="text-sm font-medium text-gray-400">Pro</div>
              <div className="mt-2 font-heading text-5xl font-bold">
                $4<span className="text-lg font-normal text-gray-400">/month</span>
              </div>
              <p className="mt-4 text-gray-400">For creators who want more</p>

              <ul className="mt-8 space-y-4">
                {['Everything in Free', '12 premium themes', 'Advanced analytics', 'Priority support', 'No HeyBio badge'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-300">
                    <Check className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button className="mt-8 w-full rounded-full bg-white py-6 text-black hover:bg-gray-100" asChild>
                <Link href="/new">Upgrade to Pro</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Big CTA Section */}
      <section className="px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-black p-10 text-center text-white md:p-20">
          <h2 className="font-heading text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Ready to stand out?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400">
            Join thousands of creators who&apos;ve upgraded their online presence.
          </p>
          <Button className="mt-10 rounded-full bg-white px-10 py-7 text-lg text-black hover:bg-gray-100" asChild>
            <Link href="/new">
              Create your free page
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Contact Section - WaxyWeb Style with HUGE text */}
      <section className="border-t border-gray-200 bg-white px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 md:grid-cols-2 md:gap-20">
            {/* Email */}
            <div className="space-y-4">
              <h3 className="font-heading text-6xl font-bold tracking-tight text-black md:text-7xl lg:text-8xl">
                Email
              </h3>
              <div className="flex items-center gap-4">
                <ArrowRight className="h-6 w-6 text-[var(--color-brand)]" />
                <a 
                  href="mailto:hello@heybio.co" 
                  className="text-2xl text-black transition-colors hover:text-[var(--color-brand)] md:text-3xl"
                >
                  hello@heybio.co
                </a>
              </div>
            </div>

            {/* Twitter */}
            <div className="space-y-4">
              <h3 className="font-heading text-6xl font-bold tracking-tight text-black md:text-7xl lg:text-8xl">
                Twitter
              </h3>
              <div className="flex items-center gap-4">
                <ArrowRight className="h-6 w-6 text-[var(--color-brand)]" />
                <a 
                  href="https://twitter.com/heybio" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-black transition-colors hover:text-[var(--color-brand)] md:text-3xl"
                >
                  @heybio
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Marquee */}
      <div className="overflow-hidden border-y border-gray-200 bg-gray-100 py-3">
        <div className="animate-marquee flex whitespace-nowrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="mx-4 text-sm text-[var(--color-muted)]">
              © 2026 HeyBio. All rights reserved. ✦
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white px-4 py-12 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="font-heading text-3xl font-bold tracking-tight">
            HeyBio
          </Link>
          <div className="flex items-center gap-8 text-sm text-[var(--color-muted)]">
            <Link href="/pricing" className="transition-colors hover:text-black">Pricing</Link>
            <Link href="#" className="transition-colors hover:text-black">Privacy</Link>
            <Link href="#" className="transition-colors hover:text-black">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
