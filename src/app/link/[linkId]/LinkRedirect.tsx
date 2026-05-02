'use client';

import { useState, useEffect } from 'react';
import InAppSpy from 'inapp-spy';

interface Props {
  url: string;
  title: string;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  displayName: string | null;
}

export function LinkRedirect({ url, title, avatarUrl, coverImageUrl, displayName }: Props) {
  const [isInApp, setIsInApp] = useState<boolean | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const { isInApp: detected } = InAppSpy();
    setIsInApp(detected);
    setIsIOS(/iPhone|iPad|iPod/.test(navigator.userAgent));
  }, []);

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
            className="px-8 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-opacity"
          >
            Continue (+18)
          </a>
        )}
      </div>
    </div>
  );
}
