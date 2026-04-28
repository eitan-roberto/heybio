export function HeyBioBadge({ color }: { color: string }) {
  return (
    <footer className="py-6 text-center">
      <a
        href="https://heybio.co"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
        style={{ color }}
      >
        <span>Made with</span>
        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
        <span>HeyBio</span>
      </a>
    </footer>
  );
}
