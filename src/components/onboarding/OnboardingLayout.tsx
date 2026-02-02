'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SvgAsset } from '@/components/ui/svgasset';
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
  totalSteps = 4,
  title,
  subtitle,
  showBack = true,
  backPath,
}: OnboardingLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backPath) {
      router.push(backPath);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-1">
      {/* Header */}
      <header className="bg-bottom px-4 md:px-6 py-4 rounded-bl-4xl rounded-br-4xl flex items-center justify-between">
        <div className="w-20">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-1 text-top"
            >
              <Icon icon="arrow-left" className="w-4 h-4" />
              Back
            </Button>
          )}
        </div>
        
        {/* Logo */}
        <Link href="/" className="text-pink">
          <SvgAsset src="/logos/logo-full.svg" height={32} />
        </Link>
        
        {/* Progress dots */}
        <div className="flex items-center gap-2 w-20 justify-end">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                i + 1 === step
                  ? "bg-pink"
                  : i + 1 < step
                  ? "bg-green"
                  : "bg-low"
              )}
            />
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 bg-bottom rounded-4xl mx-0 md:mx-4 p-4 md:p-8">
        <div className="max-w-lg mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-top mb-2">{title}</h1>
            {subtitle && (
              <p className="text-high">{subtitle}</p>
            )}
          </div>
          
          {children}
        </div>
      </main>
    </div>
  );
}
