'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const FREE_FEATURES = [
  'Unlimited links',
  '6 beautiful themes',
  'Basic analytics (7 days)',
  'Social icons',
  'Mobile optimized',
  'Forever free',
];

const PRO_FEATURES = [
  'Everything in Free',
  '12 premium themes',
  'Advanced analytics (30 days)',
  'Traffic sources & insights',
  'Priority support',
  'No HeyBio badge',
  'Custom domains (coming soon)',
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-top flex flex-col gap-1">
      {/* Navigation */}
      <nav className="mx-auto w-full bg-bottom px-10 py-3 rounded-bl-4xl rounded-br-4xl">
        <div className="mx-auto flex items-center justify-between max-w-6xl">
          <Link href="/" className="text-4xl text-pink font-bold tracking-tight">
            heybio
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="lg" className="rounded-full" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              size="lg"
              className="rounded-full bg-top text-bottom hover:bg-high"
              asChild
            >
              <Link href="/new">Get started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-bottom p-10 rounded-4xl overflow-hidden flex flex-col gap-3 mx-4 md:mx-8">
        <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-top md:text-7xl">
          Simple pricing,
          <span className="text-pink"> real value.</span>
        </h1>
        <p className="text-xl text-high max-w-2xl">
          Start free and upgrade when you're ready. No surprise fees, ever.
        </p>
      </section>

      {/* Pricing Cards Section */}
      <section className="px-4 py-20 md:px-8 bg-bottom rounded-4xl mx-4 md:mx-8">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-top md:text-5xl">
              Pick your plan
            </h2>
            <p className="mt-4 text-high text-lg">
              Choose what works best for you. Upgrade or downgrade anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {/* Free Plan */}
            <div className="rounded-3xl p-8 ring-1 ring-low md:p-10 bg-bottom border-2 border-green">
              <div className="flex items-center gap-2 mb-2">
                <div className="inline-block px-3 py-1 rounded-full bg-green text-top text-sm font-bold">
                  Free forever
                </div>
              </div>
              <div className="text-sm font-medium text-high">Free Plan</div>
              <div className="mt-4 text-5xl font-bold text-top">$0</div>
              <p className="mt-4 text-high">
                Everything you need to get started
              </p>

              <ul className="mt-8 space-y-4">
                {FREE_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-top"
                  >
                    <Icon icon="check" className="w-5 h-5 flex-shrink-0 text-green" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-8 w-full rounded-full py-6 bg-green text-top hover:bg-green/80"
                asChild
              >
                <Link href="/new">Start for free</Link>
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="relative overflow-hidden rounded-3xl bg-top text-bottom p-8 md:p-10 ring-2 ring-pink">
              <div className="absolute top-4 right-4 inline-block px-3 py-1 rounded-full bg-pink text-top text-xs font-bold">
                Most Popular
              </div>
              <div className="text-sm font-medium text-top">Pro Plan</div>
              <div className="mt-4 text-5xl font-bold text-bottom">
                $4<span className="text-lg font-normal text-low">/month</span>
              </div>
              <p className="mt-4 text-bottom">For creators who want more</p>

              <ul className="mt-8 space-y-4">
                {PRO_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-bottom"
                  >
                    <Icon icon="check" className="w-5 h-5 flex-shrink-0 text-green" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-8 w-full rounded-full py-6 bg-pink text-top hover:bg-pink/80"
                asChild
              >
                <Link href="/new">Upgrade to Pro</Link>
              </Button>

              {/* Save badge */}
              <div className="absolute top-20 -right-8 rotate-45 bg-yellow px-8 py-1 text-top font-bold text-sm">
                Save 25%
              </div>
            </div>
          </div>

          {/* FAQ or comparison table */}
          <div className="mt-16 rounded-3xl p-8 md:p-10 bg-top ring-1 ring-low">
            <h3 className="text-2xl font-bold text-bottom mb-4">Have questions?</h3>
            <p className="text-bottom text-lg mb-6">
              Both plans include 24/7 support. Upgrade or downgrade anytime with no penalties.
            </p>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="mailto:hello@heybio.co">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 md:px-8">
        <div className="mx-auto max-w-5xl rounded-4xl bg-pink p-10 text-center text-top md:p-20">
          <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-top">
            Join creators who've upgraded their online presence.
          </p>
          <Button
            className="mt-10 rounded-full px-10 py-7 text-lg bg-top text-pink hover:bg-high"
            asChild
          >
            <Link href="/new">
              Create your free page
              <Icon icon="arrow-right" className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bottom px-4 py-12 md:px-8 border-t border-low">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="text-3xl font-bold tracking-tight text-pink">
            heybio
          </Link>
          <div className="flex items-center gap-8 text-sm text-high">
            <Link href="/pricing" className="transition-colors hover:text-green">
              Pricing
            </Link>
            <Link href="#" className="transition-colors hover:text-green">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-green">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
