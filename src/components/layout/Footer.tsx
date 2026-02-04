import Link from 'next/link';
import { SvgAsset } from '@/components/ui/svgasset';

export function Footer() {
  return (
    <>
      {/* Footer Marquee */}
      <div className="bg-bottom p-6 md:p-10 rounded-4xl">
        <div className="animate-marquee flex whitespace-nowrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="mx-4 text-lg text-top font-bold">
              © 2026 HeyBio. All rights reserved. ✦
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-bottom p-6 md:p-10 rounded-tl-4xl rounded-tr-4xl">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row">
          <Link href="/" className="text-pink">
            <SvgAsset src="/logos/logo-full.svg" height={120} />
          </Link>

          <div className="flex items-start gap-8 text-2xl font-bold text-top pt-2">
            <Link href="/pricing" className="transition-colors hover:text-high">
              Pricing
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-high">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-high">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
