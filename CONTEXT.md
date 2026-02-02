# HeyBio - Project Context

## What
Link-in-bio tool. "Finally, a bio link that looks good."

## Live
https://heybio.vercel.app

## Repo
https://github.com/eitan-roberto/heybio

## Tech
- Next.js 16 (Turbopack)
- Supabase (auth + DB)
- Tailwind + shadcn/ui
- Zustand (state)
- TypeScript

## Design System
- Colors: `--color-top/high/mid/low/bottom` (dark→light)
- Accents: green, pink, orange, yellow, blue
- Font: DM Sans
- Vibe: Bold, playful, WaxyWeb-inspired

## Current State (2026-02-01)
✅ Landing, pricing, signup, login pages
✅ Onboarding flow (username → links → theme → preview)
✅ Theme system (6 free + 6 pro)
✅ Bio page rendering with themes
✅ Supabase auth integration
✅ API to save pages (`/api/pages/create`)

## TODO
- [ ] Fix [username] page Supabase fetch
- [ ] Dashboard - show user's pages
- [ ] Analytics tracking
- [ ] Pro plan/payments

## Dev Notes
- Build: `npm run build`
- Deploy: `npx vercel --prod --token $VERCEL_TOKEN --yes`
- Vercel token in TOOLS.md
