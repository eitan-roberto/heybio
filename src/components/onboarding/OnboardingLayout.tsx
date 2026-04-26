'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SvgAsset } from '@/components/ui/svgasset';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backPath?: string;
}

export function OnboardingLayout({
  children,
  step,
  totalSteps = 2,
  title,
  subtitle,
  showBack = true,
  backPath,
}: OnboardingLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backPath) router.push(backPath);
    else router.back();
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Header */}
      <header className="h-14 bg-bottom border-b border-low flex items-center px-4 gap-4 shrink-0">
        {showBack ? (
          <button
            onClick={handleBack}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-low transition-colors text-high"
          >
            <Icon icon="arrow-left" className="w-4 h-4" />
          </button>
        ) : (
          <Link href="/" className="text-pink">
            <SvgAsset src="/logos/logo-full.svg" height={26} />
          </Link>
        )}

        {/* Progress bar */}
        <div className="flex-1 h-1.5 bg-low rounded-full overflow-hidden">
          <div
            className="h-full bg-top rounded-full transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <span className="text-xs text-mid font-medium shrink-0">{step} / {totalSteps}</span>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col p-4 md:p-6 max-w-lg w-full mx-auto">
        <div className="mb-6 mt-4">
          <h1 className="text-2xl font-bold text-top mb-1">{title}</h1>
          {subtitle && <p className="text-high text-sm">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
