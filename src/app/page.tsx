"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon, IconSize } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const getColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    green: "bg-green text-top",
    pink: "bg-pink text-top",
    orange: "bg-orange text-top",
    yellow: "bg-yellow text-top",
    brown: "bg-brown text-bottom",
    blue: "bg-blue text-top",
  };
  return colorMap[color] || colorMap.green;
};

const FEATURES = [
  {
    icon: "sparkles",
    title: "Stunning themes",
    description:
      "Pick from beautiful, curated themes. No design skills needed.",
  },
  {
    icon: "zap",
    title: "Lightning fast",
    description:
      "Your page loads in under a second. Better for visitors, better for SEO.",
  },
  {
    icon: "eye",
    title: "Actionable analytics",
    description:
      "Know what works. See where your visitors come from and what they click.",
  },
];

const TESTIMONIAL_COLORS = ["green", "pink", "orange", "yellow"];

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    role: "Content Creator",
    text: "Finally a bio link that matches my aesthetic!",
    color: TESTIMONIAL_COLORS[0],
  },
  {
    name: "Alex M.",
    role: "Musician",
    text: "Simple, fast, beautiful. Exactly what I needed.",
    color: TESTIMONIAL_COLORS[1],
  },
  {
    name: "Jordan T.",
    role: "Designer",
    text: "The themes are gorgeous. My followers love it.",
    color: TESTIMONIAL_COLORS[2],
  },
  {
    name: "Maria L.",
    role: "Influencer",
    text: "Switched from Linktree and never looked back.",
    color: TESTIMONIAL_COLORS[3],
  },
];

export default function LandingPage() {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      window.location.href = `/new?u=${username}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-1">
      {/* Navigation */}
      <nav className="mx-auto w-full bg-bottom px-10 py-3 rounded-bl-4xl rounded-br-4xl">
        <div className="mx-auto flex items-center justify-between">
          <Link href="/" className="text-4xl text-pinkfont-bold tracking-tight">
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
      <section className="relative bg-bottom p-10 rounded-4xl overflow-hidden flex flex-col gap-3">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm bg-green w-fit">
          <span className="font-bold text-top">
            Free forever, no credit card required
          </span>
        </div>

        {/* Main Heading - HUGE */}
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-top md:text-7xl lg:text-8xl">
          Finally, a bio link
          <span className="text-pink"> that looks good.</span>
        </h1>

        {/* CTA Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 max-w-md md:mt-12"
        >
          <div className="flex items-center gap-2 rounded-full p-4 bg-blue focus-within:ring-8 focus-within:ring-blue/30">
            <span className="pl-4 text-xl text-top">heybio.co/</span>
            <input
              id='username-input'
              data-slot="input"
              type="text"
              placeholder="yourname"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                )
              }
              className="w-full min-w-0 px-3 py-2 border-0 bg-bottom font-bold rounded-full placeholder:text-top text-top focus-visible:ring-0 text-2xl"
            />
            <Button
              type="submit"
              disabled={!username.trim()}
              className="rounded-full bg-top px-6 py-6 text-bottom hover:bg-high"
            >
              <span className="mr-2 hidden sm:inline font-bold text-xl">
                Claim it
              </span>
              <Icon icon="arrow-right" className="w-5 h-5" />
            </Button>
          </div>
        </form>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-top">
          <span className="flex items-center gap-1.5">
            <Icon icon="check" className="w-4 h-4 text-bottom" />
            No signup required
          </span>
          <span className="flex items-center gap-1.5">
            <Icon icon="zap" className="w-4 h-4 text-bottom" />
            Ready in seconds
          </span>
          <span className="flex items-center gap-1.5">
            <Icon icon="sparkles" className="w-4 h-4 text-bottom" />
            Beautiful by default
          </span>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="overflow-hidden bg-bottom p-10 rounded-4xl">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div
              key={i}
              className={cn(
                "rounded-full p-8 min-w-max flex items-center gap-3",
                getColorClass(t.color)
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-top text-sm font-bold text-bottom flex-shrink-0">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-md font-medium">
                  &quot;{t.text}&quot;
                </p>
                <p className="text-xs opacity-75">
                  {t.name} · {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-bottom p-10 rounded-4xl">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-16 text-center md:mb-20">
            <h2 className="text-4xl font-bold tracking-tight text-top md:text-5xl lg:text-6xl">
              Everything you need,
              <br />
              <span className="text-top">nothing you don&apos;t.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-top md:mt-6 md:text-lg">
              We focused on what actually matters. Beautiful pages that load
              fast and help you grow.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="group rounded-full p-10 bg-blue transition-all hover:ring-green/30"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-low text-top transition-colors group-hover:bg-green group-hover:text-bottom">
                  <Icon icon={feature.icon} className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-top md:text-2xl">
                  {feature.title}
                </h3>
                <p className="mt-3 text-top">{feature.description}</p>
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
            <h2 className="text-4xl font-bold tracking-tight text-top md:text-5xl lg:text-6xl">
              Simple pricing
            </h2>
            <p className="mt-4 text-top md:text-lg">
              Start free. Upgrade when you need more.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {/* Free Plan */}
            <div className="rounded-3xl p-8 ring-1 ring-low md:p-10 bg-bottom">
              <div className="text-sm font-medium text-top">Free</div>
              <div className="mt-2 text-5xl font-bold text-top">$0</div>
              <p className="mt-4 text-top">
                Everything you need to get started
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "Unlimited links",
                  "6 beautiful themes",
                  "Basic analytics",
                  "Social icons",
                  "Mobile optimized",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-top"
                  >
                    <Icon icon="check" className="w-5 h-5 flex-shrink-0 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant="outline"
                className="mt-8 w-full rounded-full py-6"
                asChild
              >
                <Link href="/new">Start for free</Link>
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="relative overflow-hidden rounded-3xl bg-top p-8 text-bottom md:p-10">
              <div className="absolute right-4 top-4 rounded-full bg-bottom/10 px-3 py-1 text-xs font-medium">
                Popular
              </div>
              <div className="text-sm font-medium text-top">Pro</div>
              <div className="mt-2 text-5xl font-bold">
                $4<span className="text-lg font-normal text-top">/month</span>
              </div>
              <p className="mt-4 text-top">For creators who want more</p>

              <ul className="mt-8 space-y-4">
                {[
                  "Everything in Free",
                  "12 premium themes",
                  "Advanced analytics",
                  "Priority support",
                  "No HeyBio badge",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-top"
                  >
                    <Icon icon="check" className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-8 w-full rounded-full py-6"
                asChild
              >
                <Link href="/new">Upgrade to Pro</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Big CTA Section */}
      <section className="px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-top p-10 text-center text-bottom md:p-20">
          <h2 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Ready to stand out?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-top">
            Join thousands of creators who&apos;ve upgraded their online
            presence.
          </p>
          <Button
            className="mt-10 rounded-full px-10 py-7 text-lg bg-bottom text-top hover:bg-low"
            asChild
          >
            <Link href="/new">
              Create your free page
              <Icon icon="arrow-right" className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Contact Section - WaxyWeb Style with HUGE text */}
      <section className="border-t border-low px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 md:grid-cols-2 md:gap-20">
            {/* Email */}
            <div className="space-y-4">
              <h3 className="text-6xl font-bold tracking-tight text-top md:text-7xl lg:text-8xl">
                Email
              </h3>
              <div className="flex items-center gap-4">
                <Icon icon="arrow-right" className="w-6 h-6 text-green" />
                <a
                  href="mailto:hello@heybio.co"
                  className="text-2xl text-top transition-colors hover:text-green md:text-3xl"
                >
                  hello@heybio.co
                </a>
              </div>
            </div>

            {/* Twitter */}
            <div className="space-y-4">
              <h3 className="text-6xl font-bold tracking-tight text-top md:text-7xl lg:text-8xl">
                Twitter
              </h3>
              <div className="flex items-center gap-4">
                <Icon icon="arrow-right" className="w-6 h-6 text-green" />
                <a
                  href="https://twitter.com/heybio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-top transition-colors hover:text-green md:text-3xl"
                >
                  @heybio
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Marquee */}
      <div className="overflow-hidden border-y border-low bg-low py-3">
        <div className="animate-marquee flex whitespace-nowrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="mx-4 text-sm text-top">
              © 2026 HeyBio. All rights reserved. ✦
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-bottom px-4 py-12 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="text-3xl font-bold tracking-tight text-pink">
            heybio
          </Link>
          <div className="flex items-center gap-8 text-sm text-top">
            <Link href="/pricing" className="transition-colors hover:text-top">
              Pricing
            </Link>
            <Link href="#" className="transition-colors hover:text-top">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-top">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
