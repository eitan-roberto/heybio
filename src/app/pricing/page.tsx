'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { SvgAsset } from '@/components/ui/svgasset';
import { cn } from '@/lib/utils';

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
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: 'pro_monthly' }),
      });
      
      const data = await response.json();
      
      if (data.checkoutUrl) {
        router.push(data.checkoutUrl);
      } else {
        console.error('No checkout URL returned');
        setUpgrading(false);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      setUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-1 overflow-x-hidden">
      {/* Navigation */}
      <nav className="mx-auto w-full bg-bottom px-4 md:px-10 py-3 rounded-bl-4xl rounded-br-4xl">
        <div className="mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-[12px] text-pink">
            <SvgAsset src="/logos/logo-full.svg" height={42} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 md:gap-4">
            <Button variant="outline" size="lg" className="rounded-full" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="lg" className="rounded-full bg-top text-bottom hover:bg-high" asChild>
              <Link href="/new">Get started</Link>
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-top"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1.5 relative">
              <span className={cn(
                "block h-[3px] w-full bg-current rounded-full transition-all duration-300 absolute",
                mobileMenuOpen ? "rotate-45 top-1/2 -translate-y-1/2" : "top-0"
              )} />
              <span className={cn(
                "block h-[3px] w-full bg-current rounded-full transition-all duration-300",
                mobileMenuOpen && "opacity-0"
              )} />
              <span className={cn(
                "block h-[3px] w-full bg-current rounded-full transition-all duration-300 absolute",
                mobileMenuOpen ? "-rotate-45 top-1/2 -translate-y-1/2" : "bottom-0"
              )} />
            </div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          mobileMenuOpen ? "max-h-48 mt-4" : "max-h-0"
        )}>
          <div className="flex flex-col gap-2 pb-4">
            <Button variant="outline" size="lg" className="rounded-full w-full" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="lg" className="rounded-full bg-top text-bottom hover:bg-high w-full" asChild>
              <Link href="/new">Get started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-bottom p-4 md:p-10 rounded-4xl overflow-hidden flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm bg-pink w-fit">
          <span className="font-bold text-top">Simple & transparent</span>
        </div>
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-top md:text-7xl">
          Simple pricing,
          <span className="text-green"> real value.</span>
        </h1>
        <p className="text-lg text-high max-w-2xl">
          Start free and upgrade when you're ready. No surprise fees, ever.
        </p>
      </section>

      {/* Pricing Cards Section */}
      <section className="bg-bottom p-4 md:p-10 rounded-4xl">
        <div className="mx-auto max-w-5xl">
          {/* Pricing Cards */}
          <div className="grid gap-4 md:gap-8 md:grid-cols-2">
            {/* Free Plan */}
            <div className="rounded-4xl p-6 md:p-10 bg-green">
              <div className="text-sm font-bold text-top">Free Plan</div>
              <div className="mt-4 text-5xl font-bold text-top">$0</div>
              <p className="mt-4 text-top">Everything you need to get started</p>

              <ul className="mt-8 space-y-4">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-top">
                    <Icon icon="check" className="w-5 h-5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button className="mt-8 w-full rounded-full py-6 bg-top text-bottom hover:bg-high" asChild>
                <Link href="/new">Start for free</Link>
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-4xl p-6 md:p-10 bg-pink overflow-hidden">
              <div className="absolute top-4 right-4 inline-block px-3 py-1 rounded-full bg-top text-bottom text-xs font-bold">
                Popular
              </div>
              <div className="text-sm font-bold text-top">Pro Plan</div>
              <div className="mt-4 text-5xl font-bold text-top">
                $4<span className="text-lg font-normal">/month</span>
              </div>
              <p className="mt-4 text-top">For creators who want more</p>

              <ul className="mt-8 space-y-4">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-top">
                    <Icon icon="check" className="w-5 h-5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                className="mt-8 w-full rounded-full py-6 bg-top text-bottom hover:bg-high"
                onClick={handleUpgrade}
                disabled={upgrading}
              >
                {upgrading ? (
                  <Icon icon="loader-2" className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                Upgrade to Pro
              </Button>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-8 rounded-4xl p-6 md:p-10 bg-orange">
            <h3 className="text-2xl font-bold text-top mb-4">Have questions?</h3>
            <p className="text-top text-lg mb-6">
              Both plans include 24/7 support. Upgrade or downgrade anytime.
            </p>
            <Button className="rounded-full bg-top text-bottom hover:bg-high" asChild>
              <Link href="mailto:hello@heybio.co">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bottom p-4 md:p-10 rounded-4xl">
        <div className="mx-auto max-w-5xl rounded-4xl bg-yellow p-6 md:p-20 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-top">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-top">
            Join creators who've upgraded their online presence.
          </p>
          <Button className="mt-8 rounded-full px-8 py-6 text-lg bg-top text-bottom hover:bg-high" asChild>
            <Link href="/new">
              Create your free page
              <Icon icon="arrow-right" className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bottom px-4 md:px-10 py-8 rounded-tl-4xl rounded-tr-4xl">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="text-pink">
            <SvgAsset src="/logos/logo-full.svg" height={32} />
          </Link>
          <div className="flex items-center gap-8 text-sm text-high">
            <Link href="/pricing" className="transition-colors hover:text-top">Pricing</Link>
            <Link href="#" className="transition-colors hover:text-top">Privacy</Link>
            <Link href="#" className="transition-colors hover:text-top">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
