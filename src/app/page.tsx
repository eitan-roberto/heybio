"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SvgAsset } from "@/components/ui/svgasset";

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

const ORDERED_COLORS = ["green", "pink", "orange", "yellow"];


const FEATURES = [
  {
    icon: "sparkles",
    title: "Stunning themes",
    description:
      "Pick from beautiful, curated themes. No design skills needed.",
    color: ORDERED_COLORS[0],
  },
  {
    icon: "zap",
    title: "Lightning fast",
    description:
      "Your page loads in under a second. Better for visitors, better for SEO.",
    color: ORDERED_COLORS[1],
  },
  {
    icon: "eye",
    title: "Actionable analytics",
    description:
      "Know what works. See where your visitors come from and what they click.",
    color: ORDERED_COLORS[2],
  },
];


const TESTIMONIALS = [
  {
    name: "Sarah K.",
    role: "Content Creator",
    text: "Finally a bio link that matches my aesthetic!",
    color: ORDERED_COLORS[0],
  },
  {
    name: "Alex M.",
    role: "Musician",
    text: "Simple, fast, beautiful. Exactly what I needed.",
    color: ORDERED_COLORS[1],
  },
  {
    name: "Jordan T.",
    role: "Designer",
    text: "The themes are gorgeous. My followers love it.",
    color: ORDERED_COLORS[2],
  },
  {
    name: "Maria L.",
    role: "Influencer",
    text: "Switched from Linktree and never looked back.",
    color: ORDERED_COLORS[3],
  },
];

export default function LandingPage() {
  const [username, setUsername] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debounced username availability check
  useEffect(() => {
    if (!username || username.length < 3) {
      setIsAvailable(null);
      setError(null);
      return;
    }

    const checkAvailability = async () => {
      setIsChecking(true);
      setError(null);

      try {
        const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
        const data = await response.json();

        if (data.available) {
          setIsAvailable(true);
          setError(null);
        } else {
          setIsAvailable(false);
          setError(data.error || 'Username not available');
        }
      } catch {
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(checkAvailability, 300); // Debounce 300ms
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && isAvailable) {
      window.location.href = `/new/links?u=${username}`;
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
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              asChild
            >
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
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-full"
              asChild
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              size="lg"
              className="rounded-full bg-top text-bottom hover:bg-high w-full"
              asChild
            >
              <Link href="/new">Get started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-bottom p-4 md:p-10 rounded-4xl overflow-hidden flex flex-col gap-3">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm bg-green w-fit">
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
        <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto mt-6 md:mt-12">
          {/* Mobile: Stacked Layout */}
          <div className="flex md:hidden flex-col gap-3 bg-blue rounded-3xl p-4 focus-within:ring-4 focus-within:ring-blue/30">
            <span className="text-lg text-top font-bold text-center">heybio.co/</span>
            <div className="relative">
              <input
                id="username-input-mobile"
                type="text"
                placeholder="yourname"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                  )
                }
                className="w-full px-4 py-3 border-0 bg-bottom font-bold rounded-full placeholder:text-high text-top focus-visible:ring-0 text-xl text-center"
              />
              {isChecking && (
                <Icon icon="loader-2" className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-high animate-spin" />
              )}
              {isAvailable && !isChecking && (
                <Icon icon="check" className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green" />
              )}
            </div>
            {error && username.length >= 3 && (
              <p className="text-sm text-orange text-center">{error}</p>
            )}
            <Button
              type="submit"
              disabled={!username.trim() || !isAvailable || isChecking}
              className="rounded-full bg-top px-6 py-3 text-bottom hover:bg-high w-full disabled:opacity-50"
            >
              <span className="font-bold text-lg">Claim it</span>
              <Icon icon="arrow-right" className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Desktop: Horizontal Layout */}
          <div className="hidden md:flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-full p-4 bg-blue focus-within:ring-8 focus-within:ring-blue/30">
              <span className="pl-4 text-xl text-top">heybio.co/</span>
              <div className="relative flex-1">
                <input
                  id="username-input-desktop"
                  type="text"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                    )
                  }
                  className="w-full px-3 py-2 border-0 bg-bottom font-bold rounded-full placeholder:text-top text-top focus-visible:ring-0 text-2xl"
                />
                {isChecking && (
                  <Icon icon="loader-2" className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-high animate-spin" />
                )}
                {isAvailable && !isChecking && (
                  <Icon icon="check" className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green" />
                )}
              </div>
              <Button
                type="submit"
                disabled={!username.trim() || !isAvailable || isChecking}
                className="rounded-full bg-top px-6 py-6 text-bottom hover:bg-high disabled:opacity-50"
              >
                <span className="mr-2 font-bold text-xl">Claim it</span>
                <Icon icon="arrow-right" className="w-5 h-5" />
              </Button>
            </div>
            {error && username.length >= 3 && (
              <p className="text-sm text-orange text-center">{error}</p>
            )}
          </div>
        </form>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-top">
          <span className="flex items-center gap-1.5">
            <Icon icon="check" className="w-6 h-6 text-top font-bold" />
            No signup required
          </span>
          <span className="flex items-center gap-1.5">
            <Icon icon="zap" className="w-6 h-6 text-top font-bold" />
            Ready in seconds
          </span>
          <span className="flex items-center gap-1.5">
            <Icon icon="sparkles" className="w-6 h-6 text-top font-bold" />
            Beautiful by default
          </span>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="overflow-hidden bg-bottom p-4 md:p-10 rounded-4xl">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div
              key={i}
              className={cn(
                "rounded-full p-8 min-w-max flex items-center gap-3",
                getColorClass(t.color),
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-top text-sm font-bold text-bottom flex-shrink-0">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-md font-medium">&quot;{t.text}&quot;</p>
                <p className="text-xs opacity-75">
                  {t.name} · {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-bottom p-4 md:p-10 rounded-4xl">
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
                 className={cn(
                "flex flex-col group rounded-4xl p-10",
                getColorClass(feature.color),
              )}
              >
                <Icon icon={feature.icon} className="w-12 h-12" />
                <h3 className="text-xl font-semibold mt-6">
                  {feature.title}
                </h3>
                <p className="mt-3">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-bottom p-10 rounded-4xl">
        <div className="mx-auto max-w-6xl">
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
            <div className="rounded-4xl p-8 ring-3 ring-high md:p-10 bg-bottom">
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
                    <Icon
                      icon="check"
                      className="w-5 h-5 flex-shrink-0 text-emerald-500"
                    />
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
            <div className="relative overflow-hidden rounded-4xl bg-green p-8 text-top md:p-10">
              <div className="absolute right-4 top-4 rounded-full bg-bottom px-4 py-2 text-xl font-bold tracking-tight">
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
                    className="flex items-center gap-3 text-top font-bold"
                  >
                    <Icon
                      icon="check"
                      className="h-5 w-5 flex-shrink-0 text-top"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button className="mt-8 w-full rounded-full py-6" asChild>
                <Link href="/new">Upgrade to Pro</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Big CTA Section */}
      <section className="bg-pink p-4 md:p-10 rounded-4xl">
        <div className="mx-auto max-w-6xl rounded-4xl bg-bottom p-6 md:p-10 text-center text-top">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Ready to stand out?
          </h2>
          <p className="mx-auto mt-4 md:mt-6 text-base md:text-lg text-top">
            Join thousands of creators who&apos;ve upgraded their online
            presence.
          </p>
          <Button
            className="mt-6 md:mt-10 rounded-full px-6 md:px-10 py-4 md:py-7 text-base md:text-lg whitespace-nowrap"
            asChild
          >
            <Link href="/new" className="flex items-center gap-2">
              <span>Create your free page</span>
              <Icon icon="arrow-right" className="w-5 h-5 flex-shrink-0" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Contact Section - WaxyWeb Style with HUGE text */}
      <section className="bg-bottom p-4 md:p-10 rounded-4xl">
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
      <div className="bg-bottom p-10 rounded-4xl">
        <div className="animate-marquee flex whitespace-nowrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="mx-4 text-lg text-top font-bold">
              © 2026 HeyBio. All rights reserved. ✦
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-bottom p-10 rounded-tl-4xl rounded-tr-4xl">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row">
          <Link href="/" className="text-pink">
            <SvgAsset src="/logos/logo-full.svg" height={120} />
          </Link>

          <div className="flex items-start gap-8 text-2xl font-bold text-top pt-2">
            <Link href="/pricing" className="transition-colors hover:text-high">
              Pricing
            </Link>
            <Link href="#" className="transition-colors hover:text-high">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-high">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
