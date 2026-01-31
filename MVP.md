# HeyBio MVP Specification

> "Finally, a bio link that looks good."

**Domain:** heybio.co (to verify/purchase)

---

## 🎯 Product Vision

A beautiful, fast, simple link-in-bio tool that helps creators share everything in one place.

**Core positioning:**
- Most beautiful bio pages
- Lightning fast (sub-1s loads)
- Simple — no bloat
- Fair pricing ($4/mo Pro)
- Actionable analytics

---

## 👥 Target Users

- Content creators (Instagram, TikTok, YouTube)
- Musicians & artists
- Small businesses
- Freelancers & consultants
- Anyone who needs one link for multiple destinations

---

## ✅ MVP Features

### 1. Public Bio Page
- Custom URL: `biolink.to/{username}`
- Profile section (name, bio, avatar)
- Unlimited links with auto-detected icons
- Social icons bar
- Theme-based design (colors, fonts, style)
- Mobile-first, fully responsive
- Lightning fast (static generation)

### 2. Onboarding Flow (No Signup First)
1. Enter desired username → check availability
2. Add links (paste URL, auto-detect type)
3. Pick a theme (6 free themes)
4. Sign up to save (email/password or OAuth)
5. Soft Pro upsell after signup

### 3. Dashboard (Authenticated)
- Edit bio page (name, bio, avatar)
- Manage links (add, edit, reorder, delete)
- Change theme
- View analytics (Pro teaser for free users)
- Account settings

### 4. Themes (Free)
6 beautiful, curated themes:
- Clean (light, minimal)
- Soft (warm, rounded)
- Bold (strong colors, sharp)
- Dark (dark mode, sleek)
- Warm (earthy tones)
- Minimal (ultra-simple)

### 5. Analytics (Basic - Free)
- Total page views (last 7 days)
- Total link clicks (last 7 days)
- Simple chart

### 6. Analytics (Pro)
- Views over time (30 days)
- Clicks per link
- Traffic sources (referrers)
- Top performing links
- Insights panel (plain English suggestions)

### 7. Pro Features ($4/mo)
- Premium themes (6 additional)
- Advanced analytics
- Custom domain support
- Remove "Powered by BioLink" badge
- Priority support

### 8. Auth
- Email/password signup
- Google OAuth
- Password reset flow

### 9. Multi-language (i18n)
- All user-facing text translatable
- Language detection (browser) + manual switch
- RTL support (Hebrew, Arabic)
- Start with: English (default)
- Add later: Spanish, Hebrew, Portuguese, etc.
- Internal logs/analytics events stay English

---

## ❌ NOT in MVP

- AI features (auto-generate, smart suggestions)
- Custom domains
- Pro trial (direct upgrade only)
- Selling/payments/tips
- Email/SMS collection
- Scheduling (show/hide links by time)
- Team/collaboration
- Embed widgets (Spotify player, etc.)
- Custom CSS
- Link thumbnails/images
- QR codes (maybe v1.1)
- Multiple pages per account
- Twitter/X OAuth (Google + email only)

---

## 🖥️ Pages & Screens

### Public (No Auth)
| Page | Route | Purpose |
|------|-------|---------|
| Landing | `/` | Hero + CTA to create page |
| Public bio page | `/{username}` | The actual bio page |
| Login | `/login` | Sign in |
| Signup | `/signup` | Create account |
| Pricing | `/pricing` | Free vs Pro comparison |

### Onboarding (No Auth, localStorage)
| Step | Route | Purpose |
|------|-------|---------|
| Choose username | `/new` | Pick your URL |
| Add links | `/new/links` | Add initial links |
| Pick theme | `/new/theme` | Choose style |
| Create account | `/new/save` | Sign up to save |

### Dashboard (Auth Required)
| Page | Route | Purpose |
|------|-------|---------|
| Dashboard home | `/dashboard` | Overview + quick edit |
| Edit page | `/dashboard/edit` | Full page editor |
| Analytics | `/dashboard/analytics` | View stats |
| Settings | `/dashboard/settings` | Account, billing |
| Upgrade | `/dashboard/upgrade` | Pro conversion page |

---

## 📊 Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  createdAt: Date;
  plan: 'free' | 'pro';
  stripeCustomerId?: string;
}
```

### Page
```typescript
interface Page {
  id: string;
  userId: string;
  slug: string;              // username/URL
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  theme: ThemeId;
  createdAt: Date;
  updatedAt: Date;
}
```

### Link
```typescript
interface Link {
  id: string;
  pageId: string;
  title: string;
  url: string;
  icon?: string;             // auto-detected or manual
  order: number;
  isActive: boolean;
  createdAt: Date;
}
```

### SocialIcon
```typescript
interface SocialIcon {
  id: string;
  pageId: string;
  platform: SocialPlatform;  // instagram, twitter, youtube, etc.
  url: string;
  order: number;
}
```

### PageView (Analytics)
```typescript
interface PageView {
  id: string;
  pageId: string;
  timestamp: Date;
  referrer?: string;
  country?: string;
  device?: 'mobile' | 'desktop' | 'tablet';
}
```

### LinkClick (Analytics)
```typescript
interface LinkClick {
  id: string;
  linkId: string;
  pageId: string;
  timestamp: Date;
  referrer?: string;
}
```

---

## 🎨 Theme Structure

```typescript
interface Theme {
  id: string;
  name: string;
  isPro: boolean;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    linkBg: string;
    linkText: string;
    linkHover: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  style: 'minimal' | 'card' | 'outline' | 'filled';
}
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth (Google + Email/Password) |
| Storage | Supabase Storage (avatars) |
| State | Zustand |
| Payments | LemonSqueezy (supports Israel payouts) |
| Analytics | Custom (Supabase tables) |
| i18n | next-intl |
| Hosting | Vercel |
| Domain | heybio.co (TBD) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/              # i18n wrapper
│   │   ├── (marketing)/       # Landing, pricing
│   │   │   ├── page.tsx       # Landing page
│   │   │   └── pricing/
│   │   ├── (auth)/            # Login, signup
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (onboarding)/      # New page flow
│   │   │   └── new/
│   │   │       ├── page.tsx   # Step 1: username
│   │   │       ├── links/     # Step 2: add links
│   │   │       ├── theme/     # Step 3: pick theme
│   │   │       └── save/      # Step 4: create account
│   │   ├── (dashboard)/       # Authenticated area
│   │   │   └── dashboard/
│   │   │       ├── page.tsx   # Dashboard home
│   │   │       ├── edit/
│   │   │       ├── analytics/
│   │   │       └── settings/
│   │   └── layout.tsx
│   ├── [username]/            # Public bio pages (no locale prefix)
│   │   └── page.tsx
│   └── api/                   # API routes
│       ├── pages/
│       ├── links/
│       ├── analytics/
│       └── webhooks/
├── components/
│   ├── ui/                    # shadcn components
│   ├── bio-page/              # Bio page components
│   ├── dashboard/             # Dashboard components
│   ├── onboarding/            # Onboarding components
│   └── marketing/             # Landing page components
├── services/
│   ├── pageService.ts
│   ├── linkService.ts
│   ├── analyticsService.ts
│   ├── logService.ts
│   └── paymentService.ts      # LemonSqueezy
├── hooks/
│   ├── usePage.ts
│   ├── useLinks.ts
│   ├── useAnalytics.ts
│   └── useAuth.ts
├── lib/
│   ├── supabase/
│   ├── lemonsqueezy/
│   ├── utils.ts
│   └── themes.ts
├── locales/                   # i18n translations
│   ├── en.json                # English (default)
│   └── ...                    # Add more languages
├── types/
│   └── index.ts
├── stores/
│   ├── onboardingStore.ts     # localStorage during onboarding
│   └── uiStore.ts
└── config/
    ├── themes.ts              # Theme definitions
    └── constants.ts
```

---

## 🚀 Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Project setup (Next.js, Tailwind, shadcn)
- [ ] Supabase setup (database, auth)
- [ ] Basic auth flow (signup, login, logout)
- [ ] Database schema + migrations
- [ ] Services setup (log, analytics stubs)

### Phase 2: Bio Page (Week 2)
- [ ] Public bio page component
- [ ] Theme system (6 free themes)
- [ ] Link rendering with auto-icons
- [ ] Social icons bar
- [ ] Mobile responsive
- [ ] Performance optimization (static gen)

### Phase 3: Onboarding (Week 3)
- [ ] Username availability check
- [ ] Onboarding flow (4 steps)
- [ ] localStorage draft storage
- [ ] Connect to auth on final step
- [ ] Transfer draft to database

### Phase 4: Dashboard (Week 4)
- [ ] Dashboard layout
- [ ] Edit page (name, bio, avatar)
- [ ] Link management (CRUD, reorder)
- [ ] Theme picker
- [ ] Settings page

### Phase 5: Analytics (Week 5)
- [ ] Track page views
- [ ] Track link clicks
- [ ] Basic analytics dashboard (free)
- [ ] Pro analytics (if time)
- [ ] Insights panel (stretch)

### Phase 6: Pro & Payments (Week 6)
- [ ] Stripe integration
- [ ] Pro upgrade flow
- [ ] Billing portal
- [ ] Premium themes unlock
- [ ] Remove badge for Pro

### Phase 7: Polish & Launch (Week 7)
- [ ] Landing page
- [ ] Pricing page
- [ ] SEO optimization
- [ ] Performance audit
- [ ] Bug fixes
- [ ] Soft launch

---

## 📈 Success Metrics

| Metric | Target (Month 1) |
|--------|------------------|
| Signups | 500+ |
| Pages created | 400+ |
| Free → Pro conversion | 5-10% |
| Page load time | < 1 second |
| Uptime | 99.9% |

---

## 🔗 Project Links

- **Repo:** eitan-roberto/heybio
- **Production:** heybio.co (TBD)
- **Staging:** TBD
- **Supabase:** TBD
- **LemonSqueezy:** TBD

---

## ✅ Resolved Decisions

- **Domain:** heybio.co (to verify/purchase)
- **Custom domains:** NOT in MVP (v1.1)
- **Pro trial:** NO trial, direct upgrade
- **Payments:** LemonSqueezy (Israel payouts ✅)
- **Auth:** Google OAuth + Email/password only
- **i18n:** Yes, all user-facing text translatable

## 📝 Open Questions

1. **Free theme count:** 6 enough? More?
2. **Initial languages:** English only, or launch with more?

---

*Last updated: 2026-01-31*
