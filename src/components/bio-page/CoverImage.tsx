'use client';

import Image from 'next/image';

interface CoverBackgroundProps {
  imageUrl: string;
  isPreview?: boolean;
}

export function CoverBackground({ imageUrl, isPreview = false }: CoverBackgroundProps) {
  return (
    <div className={`${isPreview ? 'absolute' : 'fixed'} inset-0 z-0`}>
      <Image
        src={imageUrl}
        alt=""
        fill
        className="object-cover"
        style={{
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
        }}
        sizes="100vw"
        priority
        unoptimized={isPreview}
      />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}

interface CoverBannerProps {
  imageUrl: string;
  /** Theme background color used for the fade gradient */
  fadeColor?: string;
}

export function CoverBanner({ imageUrl, fadeColor = '#000000' }: CoverBannerProps) {
  const solidColor = fadeColor.startsWith('linear')
    ? (fadeColor.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)/)?.[0] ?? '#000000')
    : fadeColor;

  return (
    <div className="relative w-full overflow-hidden rounded-t-3xl" style={{ height: '44vh' }}>
      <Image
        src={imageUrl}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 512px) 100vw, 512px"
        priority
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${solidColor}, transparent)`,
        }}
      />
    </div>
  );
}
