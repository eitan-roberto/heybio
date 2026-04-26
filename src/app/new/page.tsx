'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from '@/components/onboarding';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { RESERVED_SLUGS } from '@/lib/reserved-slugs';
import { cn } from '@/lib/utils';

type State = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

function UsernameForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { initDraft } = useOnboardingStore();

  const [username, setUsername] = useState('');
  const [state,    setState]    = useState<State>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ?u= pre-fill from landing page
  useEffect(() => {
    const u = searchParams.get('u');
    if (!u || u.length < 3) return;
    const cleaned = u.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(cleaned);
    check(cleaned);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const check = async (value: string) => {
    if (value.length < 3 || RESERVED_SLUGS.includes(value)) {
      setState(value.length > 0 && value.length < 3 ? 'invalid' : RESERVED_SLUGS.includes(value) ? 'invalid' : 'idle');
      return;
    }
    setState('checking');
    try {
      const res  = await fetch(`/api/check-username?username=${encodeURIComponent(value)}`);
      const data = await res.json();
      setState(data.available ? 'available' : 'taken');
      if (data.available) {
        initDraft(value);
        setTimeout(() => router.push('/new/links'), 400);
      }
    } catch {
      setState('idle');
    }
  };

  const handleChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(cleaned);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!cleaned) { setState('idle'); return; }
    if (cleaned.length < 3) { setState('invalid'); return; }
    if (RESERVED_SLUGS.includes(cleaned)) { setState('invalid'); return; }
    setState('checking');
    debounceRef.current = setTimeout(() => check(cleaned), 500);
  };

  const handleContinue = () => {
    if (state !== 'available') return;
    initDraft(username);
    router.push('/new/links');
  };

  const hint = {
    idle:      null,
    checking:  null,
    available: { text: `heybio.co/${username} is yours!`, ok: true  },
    taken:     { text: 'Already taken — try another',    ok: false },
    invalid:   { text: username.length > 0 && username.length < 3 ? 'At least 3 characters' : 'Letters, numbers and _ only', ok: false },
  }[state];

  return (
    <OnboardingLayout step={1} title="Claim your link" subtitle="Choose a unique username" showBack={false}>
      <div className="space-y-4">
        {/* Input */}
        <div className={cn(
          'flex items-center rounded-2xl border-2 transition-colors overflow-hidden bg-white',
          state === 'available' ? 'border-green' : state === 'taken' || state === 'invalid' ? 'border-orange' : 'border-low focus-within:border-top'
        )}>
          <span className="pl-4 pr-1 text-mid text-base select-none whitespace-nowrap">heybio.co/</span>
          <input
            type="text"
            placeholder="yourname"
            value={username}
            onChange={(e) => handleChange(e.target.value)}
            maxLength={30}
            autoFocus
            autoCapitalize="none"
            autoCorrect="off"
            className="flex-1 h-12 pr-4 text-base text-top font-semibold outline-none bg-transparent placeholder:text-mid"
          />
          <div className="pr-4 flex items-center">
            {state === 'checking'  && <Icon icon="loader-2" className="w-4 h-4 text-mid animate-spin" />}
            {state === 'available' && <Icon icon="check"   className="w-4 h-4 text-green"            />}
            {(state === 'taken' || state === 'invalid') && <Icon icon="x" className="w-4 h-4 text-orange" />}
          </div>
        </div>

        {hint && (
          <p className={cn('text-sm', hint.ok ? 'text-green-700' : 'text-orange')}>
            {hint.text}
          </p>
        )}

        <Button
          onClick={handleContinue}
          disabled={state !== 'available'}
          loading={state === 'checking'}
          size="lg"
          className="w-full"
        >
          Continue
          <Icon icon="arrow-right" className="w-4 h-4" />
        </Button>

        <p className="text-xs text-center text-mid">You can change this later</p>
      </div>
    </OnboardingLayout>
  );
}

export default function ChooseUsernamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Icon icon="loader-2" className="w-6 h-6 animate-spin text-mid" />
      </div>
    }>
      <UsernameForm />
    </Suspense>
  );
}
