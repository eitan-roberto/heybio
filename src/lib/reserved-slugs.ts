// Slugs that cannot be used as page names — covers actual app routes and system paths
export const RESERVED_SLUGS = [
  // Actual app routes (top-level)
  'new', 'checkout', 'dashboard', 'login', 'signup',
  'pricing', 'terms', 'privacy',
  // System / technical
  'api', 'auth', '_next', 'static', 'favicon',
  // Brand
  'heybio', 'www',
  // Generic reserved
  'admin', 'app', 'settings', 'help', 'support', 'about', 'blog',
  'null', 'undefined',
  // Demo / preview pages
  'demo', 'dark', 'warm',
];
