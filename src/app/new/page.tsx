'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OnboardingLayout } from '@/components/onboarding';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { cn } from '@/lib/utils';

// Reserved slugs that cannot be used
const RESERVED_SLUGS = [
  'admin', 'api', 'app', 'dashboard', 'login', 'signup', 'new', 
  'settings', 'help', 'support', 'about', 'pricing', 'blog',
  'terms', 'privacy', 'heybio', 'www', 'null', 'undefined'
];

type ValidationState = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

function UsernameForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { initDraft } = useOnboardingStore();
  
  const [username, setUsername] = useState('');
  const [validationState, setValidationState] = useState<ValidationState>('idle');
  const [isChecking, setIsChecking] = useState(false);

  // Check for ?u= parameter and auto-validate/skip
  useEffect(() => {
    const u = searchParams.get('u');
    if (u && u.length >= 3) {
      const cleaned = u.toLowerCase().replace(/[^a-z0-9_]/g, '');
      setUsername(cleaned);
      
      // Check if valid and available
      const validateAndSkip = async () => {
        setIsChecking(true);
        try {
          const response = await fetch(`/api/check-username?username=${encodeURIComponent(cleaned)}`);
          const data = await response.json();
          
          if (data.available) {
            setValidationState('available');
            initDraft(cleaned);
            // Auto-skip to links after short delay
            setTimeout(() => {
              router.push('/new/links');
            }, 500);
          } else {
            setValidationState('taken');
          }
        } catch {
          setValidationState('idle');
        } finally {
          setIsChecking(false);
        }
      };
      
      validateAndSkip();
    }
  }, [searchParams, router, initDraft]);

  // Validate username format
  const validateFormat = (value: string): boolean => {
    // 3-30 chars, alphanumeric and underscores only
    const regex = /^[a-zA-Z0-9_]{3,30}$/;
    return regex.test(value);
  };

  const handleUsernameChange = (value: string) => {
    // Only allow valid characters
    const cleaned = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(cleaned);
    
    if (cleaned.length < 3) {
      setValidationState('idle');
      return;
    }
    
    if (RESERVED_SLUGS.includes(cleaned)) {
      setValidationState('invalid');
      return;
    }
    
    if (!validateFormat(cleaned)) {
      setValidationState('invalid');
      return;
    }
    
    // Simulate availability check (in real app, would call API)
    setValidationState('checking');
    setTimeout(() => {
      // For MVP, just mark as available (backend will do real check)
      setValidationState('available');
    }, 500);
  };

  const handleContinue = () => {
    if (validationState !== 'available') return;
    
    // Initialize the draft with the chosen username
    initDraft(username);
    
    // Navigate to next step
    router.push('/new/links');
  };

  const getValidationMessage = () => {
    switch (validationState) {
      case 'checking':
        return { text: 'Checking availability...', color: 'text-top' };
      case 'available':
        return { text: `heybio.co/${username} is available!`, color: 'text-green-600' };
      case 'taken':
        return { text: 'This username is taken', color: 'text-red-600' };
      case 'invalid':
        return { text: 'Username must be 3-30 characters (letters, numbers, underscores)', color: 'text-red-600' };
      default:
        return null;
    }
  };

  const validationMessage = getValidationMessage();

  return (
    <OnboardingLayout
      step={1}
      title="Claim your link"
      subtitle="Choose a unique username for your bio page"
      showBack={false}
    >
      <div className="space-y-6">
        {/* Username input */}
        <div className="space-y-2">
          <div className="flex items-centerrounded-xl border border-low focus-within:ring-2 focus-within:ring-top/10 focus-within:border-mid transition-all overflow-hidden">
            <span className="pl-4 text-top text-lg select-none">heybio.co/</span>
            <Input
              type="text"
              placeholder="yourname"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className="flex-1 border-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-top"
              maxLength={30}
              autoFocus
            />
            <div className="pr-4">
              {validationState === 'checking' && (
                <Icon icon="loader-2" className="w-5 h-5 text-top animate-spin" />
              )}
              {validationState === 'available' && (
                <Icon icon="check" className="w-5 h-5 text-green-500" />
              )}
              {(validationState === 'taken' || validationState === 'invalid') && (
                <Icon icon="x" className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
          
          {validationMessage && (
            <p className={cn("text-sm", validationMessage.color)}>
              {validationMessage.text}
            </p>
          )}
        </div>

        {/* Continue button */}
        <Button
          onClick={handleContinue}
          disabled={validationState !== 'available'}
          className="w-full py-6 text-lg rounded-xl"
        >
          Continue
          <Icon icon="arrow-right" className="ml-2 w-5 h-5" />
        </Button>

        {/* Hint */}
        <p className="text-xs text-center text-top">
          You can change this later in settings
        </p>
      </div>
    </OnboardingLayout>
  );
}

export default function ChooseUsernamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Icon icon="loader-2" className="w-8 h-8 animate-spin text-mid" /></div>}>
      <UsernameForm />
    </Suspense>
  );
}
