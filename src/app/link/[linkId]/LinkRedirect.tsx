'use client';

import { useState, useEffect } from 'react';
import InAppSpy from 'inapp-spy';

interface Props {
  url: string;
  title: string;
  linkId: string;
  pageId: string;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  displayName: string | null;
}

function trackEvent(eventType: string, linkId: string, pageId: string, properties: Record<string, string>) {
  fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventType, linkId, pageId, properties }),
  }).catch(() => {});
}

function getBrowserContext(inApp: boolean, ua: string): string {
  if (!inApp) return 'external';
  if (/iPhone|iPad|iPod/.test(ua)) return 'inapp_ios';
  if (/Android/.test(ua)) return 'inapp_android';
  return 'inapp_other';
}

export function LinkRedirect({ url, title, linkId, pageId, avatarUrl, coverImageUrl, displayName }: Props) {
  const [isInApp, setIsInApp] = useState<boolean | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const { isInApp: detected } = InAppSpy();
    const ua = navigator.userAgent;
    setIsInApp(detected);
    setIsIOS(/iPhone|iPad|iPod/.test(ua));
    const browser_context = getBrowserContext(detected, ua);
    trackEvent('nsfw_gate_viewed', linkId, pageId, { browser_context });
  }, [linkId, pageId]);

  const bgImage = coverImageUrl || avatarUrl;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {bgImage && (
        <div
          className="absolute inset-0 bg-center bg-cover scale-110"
          style={{ backgroundImage: `url(${bgImage})`, filter: 'blur(24px)' }}
        />
      )}
      <div className="absolute inset-0 bg-black/75" />

      {/* iOS in-app only: bubble flush at top pointing to 3-dots area */}
      {isInApp && isIOS && (
        <div className="fixed top-5 right-4 z-50 max-w-[200px]">
          <div className="relative bg-white rounded-2xl px-4 py-3 shadow-2xl">
            <div className="absolute -top-2 right-5 w-4 h-4 bg-white rotate-45" />
            <p className="text-black text-xs leading-relaxed">
              Tap <strong>⋯</strong> and select <strong>Open in external browser</strong>
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-xs mx-auto">
        {avatarUrl && (
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 mb-5">
            <img src={avatarUrl} alt={displayName ?? ''} className="w-full h-full object-cover" />
          </div>
        )}

        <img src="/icons/hidden.svg" alt="" className="w-10 h-10 invert opacity-50 mb-4" />

        <h1 className="text-white text-2xl font-bold mb-2">+18 Content</h1>
        <p className="text-white/50 text-sm mb-5">Please follow the instructions to enter the link.</p>

        {isInApp === null && (
          <div className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        )}

        {isInApp === true && (
          <div className="bg-white/10 rounded-2xl p-5 w-full flex flex-col gap-5 text-left">
            <div className="flex items-center gap-4">
              <img src="/icons/three-dots-menu.svg" alt="" className="w-6 h-6 invert opacity-70 flex-shrink-0" />
              <span className="text-white text-base leading-snug">
                Tap the <strong>three dots</strong> top or bottom right
              </span>
            </div>
            <div className="w-full h-px bg-white/15" />
            <div className="flex items-center gap-4">
              <img src="/icons/open-in-browser.svg" alt="" className="w-6 h-6 invert opacity-70 flex-shrink-0" />
              <span className="text-white text-base leading-snug">
                Choose <strong>Open in external browser</strong>
              </span>
            </div>
          </div>
        )}

        {isInApp === false && (
          <a
            href={url}
            onClick={() => trackEvent('nsfw_continue_clicked', linkId, pageId, { browser_context: 'external' })}
            className="px-8 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-opacity"
          >
            Continue (+18)
          </a>
        )}
      </div>
    </div>
  );
}
