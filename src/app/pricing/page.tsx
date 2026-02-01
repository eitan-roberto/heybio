'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon, IconSize } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
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
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  const monthlyPrice = 4;
  const yearlyPrice = 36; // $3/month billed yearly
  const yearlyMonthly = yearlyPrice / 12;
  const savings = Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          HeyBio
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/new">Get started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-16 pb-8 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-top mb-4">
          Simple, fair pricing
        </h1>
        <p className="text-xl text-top mb-8">
          Start free, upgrade when you need more.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center bg-low rounded-full p-1 mb-12">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all",
              billingPeriod === 'monthly'
                ? "bg-bottom text-top shadow-sm"
                : "text-top hover:text-top"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all relative",
              billingPeriod === 'yearly'
                ? "bg-bottom text-top shadow-sm"
                : "text-top hover:text-top"
            )}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-bottom text-xs px-1.5 py-0.5 rounded-full">
              -{savings}%
            </span>
          </button>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free plan */}
          <div className="p-8 rounded-2xlborder border-low">
            <div className="text-sm font-medium text-top mb-2">Free</div>
            <div className="text-5xl font-bold text-top mb-2">$0</div>
            <p className="text-top mb-6">Forever free, no credit card required</p>
            
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-top">
                  <Icon icon="check" className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Button variant="outline" className="w-full py-6 rounded-xl" asChild>
              <Link href="/new">
                Start for free
                <Icon icon="arrow-right" className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Pro plan */}
          <div className="p-8 rounded-2xl bg-top text-bottom relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-bottom/10 rounded-full text-xs font-medium">
              <Icon icon="sparkles" className="w-3 h-3" />
              Popular
            </div>
            
            <div className="text-sm font-medium text-top mb-2">Pro</div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold">
                ${billingPeriod === 'monthly' ? monthlyPrice : yearlyMonthly.toFixed(0)}
              </span>
              <span className="text-top">/month</span>
            </div>
            {billingPeriod === 'yearly' && (
              <p className="text-sm text-top mb-6">
                Billed ${yearlyPrice}/year
              </p>
            )}
            {billingPeriod === 'monthly' && (
              <p className="text-top mb-6">For creators who want more</p>
            )}
            
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-top">
                  <Icon icon="check" className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Button className="w-full py-6 rounded-xltext-top hover:bg-low" asChild>
              <Link href="/new">
                Upgrade to Pro
                <Icon icon="arrow-right" className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24border-t border-low">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-top text-center mb-12">
            Frequently asked questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-top mb-2">
                Can I really use HeyBio for free?
              </h3>
              <p className="text-top">
                Yes! The free plan includes everything you need to create a beautiful bio page.
                Unlimited links, 6 themes, and basic analytics. No catch.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-top mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-top">
                We accept all major credit cards, Apple Pay, and Google Pay through our secure
                payment processor.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-top mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-top">
                Absolutely. No contracts, no commitments. Cancel your Pro subscription anytime
                and keep using the free features.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-top mb-2">
                What about custom domains?
              </h3>
              <p className="text-top">
                Custom domains are coming soon for Pro users. You will be able to use your own
                domain like links.yourdomain.com.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12border-t border-low">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-top">
            © 2026 HeyBio. Made with ♥ for creators.
          </div>
          <div className="flex items-center gap-6 text-sm text-top">
            <Link href="#" className="hover:text-top transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-top transition-colors">Terms</Link>
            <Link href="#" className="hover:text-top transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
