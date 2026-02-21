'use client';

interface SvgIconProps {
  icon: string;
  folder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SvgIcon({ icon, folder = 'icons', className = 'w-6 h-6', style }: SvgIconProps) {
  const url = `url(/${folder}/${icon}.svg)`;

  return (
    <div
      className={`shrink-0 ${className}`}
      style={{
        backgroundColor: 'currentColor',
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: 'cover',
        WebkitMaskSize: 'cover',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        ...style,
      }}
    />
  );
}
