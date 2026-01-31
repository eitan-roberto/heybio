'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, X, Loader2 } from 'lucide-react';
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

export default function ChooseUsernamePage() {
  const router = useRouter();
  const { initDraft } = useOnboardingStore();
  
  const [username, setUsername] = useState('');
  const [validationState, setValidationState] = useState<ValidationState>('idle');

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
        return { text: 'Checking availability...', color: 'text-gray-500' };
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
          <div className="flex items-center bg-white rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-gray-900/10 focus-within:border-gray-300 transition-all overflow-hidden">
            <span className="pl-4 text-gray-400 text-lg select-none">heybio.co/</span>
            <Input
              type="text"
              placeholder="yourname"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className="flex-1 border-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-300"
              maxLength={30}
              autoFocus
            />
            <div className="pr-4">
              {validationState === 'checking' && (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              )}
              {validationState === 'available' && (
                <Check className="w-5 h-5 text-green-500" />
              )}
              {(validationState === 'taken' || validationState === 'invalid') && (
                <X className="w-5 h-5 text-red-500" />
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
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>

        {/* Hint */}
        <p className="text-xs text-center text-gray-400">
          You can change this later in settings
        </p>
      </div>
    </OnboardingLayout>
  );
}
