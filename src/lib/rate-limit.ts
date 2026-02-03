import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter
// For production, use Redis or similar

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const RATE_LIMITS: Record<string, { limit: number; window: number }> = {
  // General API
  default: { limit: 100, window: 60 * 1000 }, // 100 requests per minute
  
  // Auth endpoints - stricter
  '/api/checkout': { limit: 10, window: 60 * 1000 }, // 10 per minute
  '/api/webhooks/lemonsqueezy': { limit: 100, window: 60 * 1000 }, // Webhooks can be higher
  
  // Analytics tracking - generous
  '/api/analytics/view': { limit: 1000, window: 60 * 1000 },
  '/api/analytics/click': { limit: 1000, window: 60 * 1000 },
};

export function rateLimit(request: NextRequest): NextResponse | null {
  const ip = request.ip || 'anonymous';
  const path = request.nextUrl.pathname;
  
  // Skip rate limiting for static assets
  if (path.startsWith('/_next') || path.startsWith('/static') || path.includes('.')) {
    return null;
  }
  
  const config = RATE_LIMITS[path] || RATE_LIMITS.default;
  const key = `${ip}:${path}`;
  const now = Date.now();
  
  const entry = rateLimitMap.get(key);
  
  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.window,
    });
    return null;
  }
  
  if (entry.count >= config.limit) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }
  
  entry.count++;
  return null;
}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);
