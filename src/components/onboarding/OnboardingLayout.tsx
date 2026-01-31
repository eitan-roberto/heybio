'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="w-20">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
        </div>
        
        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                i + 1 === step
                  ? "bg-gray-900"
                  : i + 1 < step
                  ? "bg-gray-400"
                  : "bg-gray-200"
              )}
            />
          ))}
        </div>
        
        <div className="w-20" />
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && (
            <p className="text-gray-500">{subtitle}</p>
          )}
        </div>
        
        {children}
      </main>
    </div>
  );
}
