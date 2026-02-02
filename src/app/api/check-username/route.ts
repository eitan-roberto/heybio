import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Reserved slugs that cannot be used
const RESERVED_SLUGS = [
  'admin', 'api', 'app', 'dashboard', 'login', 'signup', 'new', 
  'settings', 'help', 'support', 'about', 'pricing', 'blog',
  'terms', 'privacy', 'heybio', 'www', 'null', 'undefined',
  'auth', 'api', 'static', '_next', 'favicon'
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username')?.toLowerCase().trim();

  if (!username) {
    return NextResponse.json(
      { available: false, error: 'Username required' },
      { status: 400 }
    );
  }

  // Validate format (3-30 chars, alphanumeric + underscore)
  const validRegex = /^[a-zA-Z0-9_]{3,30}$/;
  if (!validRegex.test(username)) {
    return NextResponse.json({
      available: false,
      error: 'Username must be 3-30 characters (letters, numbers, underscores)'
    });
  }

  // Check reserved
  if (RESERVED_SLUGS.includes(username)) {
    return NextResponse.json({
      available: false,
      error: 'This username is reserved'
    });
  }

  // Check if exists in Supabase
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', username)
      .single();

    if (data) {
      return NextResponse.json({
        available: false,
        error: 'This username is already taken'
      });
    }

    return NextResponse.json({ available: true });
  } catch {
    return NextResponse.json({ available: true }); // Assume available on error
  }
}
