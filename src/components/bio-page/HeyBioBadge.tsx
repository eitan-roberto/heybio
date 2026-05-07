import LogoFull from '@/../public/logos/logo-full.svg';

interface HeyBioBadgeProps {
  color: string;
  fontFamily?: string;
}

export function HeyBioBadge({ color, fontFamily }: HeyBioBadgeProps) {
  return (
    <footer className="py-6 text-center" style={{ opacity: 0.4 }}>
      <a
        href="https://heybio.co"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-col items-center gap-1 transition-opacity hover:opacity-[0.65]"
        style={{ color, fontFamily }}
      >
        <span className="text-[10px] tracking-wide">Made with</span>
        <LogoFull className="h-6 w-auto" />
      </a>
    </footer>
  );
}
