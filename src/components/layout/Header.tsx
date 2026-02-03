'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SvgAsset } from '@/components/ui/svgasset';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
  );
}
