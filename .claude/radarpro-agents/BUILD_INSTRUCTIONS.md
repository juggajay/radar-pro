# RadarPro Build Instructions

You are building RadarPro, Australia's fastest weather radar Progressive Web App. The design is complete (9 screens approved). The architecture is defined. Your job is to implement this EXACTLY as specified, following all agent guidelines.

## Critical First Steps

**BEFORE WRITING ANY CODE**, read ALL agent files in `.claude/agents/`:

1. `01-radarpro-architect.md` - Project overview, tech stack, file structure
2. `02-design-system-enforcer.md` - Exact design tokens, component specs
3. `03-bom-data-specialist.md` - BOM data sources, APIs, caching
4. `04-pwa-expert.md` - PWA configuration, push notifications
5. `05-seo-strategist.md` - SEO requirements, meta tags, structured data
6. `06-quality-gatekeeper.md` - Quality standards, testing, security

These agents contain critical context that will save you from mistakes. Read them thoroughly.

## Project Context

### Why This App Exists
The Bureau of Meteorology (BOM) spent $96M redesigning their website in October 2025. It was a disaster - slow, confusing, missing features. Users are actively seeking alternatives. This is our window.

### Target Users
- Everyday Australians checking weather
- Farmers needing accurate radar
- Emergency services tracking storms
- Anyone frustrated with BOM's new site

### Revenue Model
- **Free**: Basic radar, 7-day forecast, ads
- **Pro ($4.99/mo or $39.99/yr)**: Ad-free, rain alerts, lightning, unlimited locations

## Tech Stack (Non-negotiable)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Caching | Upstash Redis |
| Payments | Stripe |
| Hosting | Vercel |
| PWA | next-pwa |

## Build Order (Follow Exactly)

### Phase 1: Foundation (Day 1)

```bash
# 1. Initialize project
npx create-next-app@latest radarpro --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
cd radarpro

# 2. Install dependencies
npm install @supabase/supabase-js @upstash/redis stripe lucide-react web-push
npm install -D next-pwa @types/web-push

# 3. Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog input switch

# 4. Create folder structure (see architect agent)
```

**Deliverables:**
- [ ] Next.js 14 project initialized
- [ ] Tailwind configured with design tokens (see design-system-enforcer)
- [ ] shadcn/ui components installed
- [ ] Folder structure created per architect spec
- [ ] Environment variables template created
- [ ] PWA manifest created

### Phase 2: Data Layer (Day 2)

Build the BOM data fetching layer:

**Deliverables:**
- [ ] `lib/bom/client.ts` - HTTP client for BOM
- [ ] `lib/bom/radar.ts` - Radar image fetching
- [ ] `lib/bom/observations.ts` - Weather data fetching
- [ ] `lib/bom/forecast.ts` - Forecast parsing
- [ ] `lib/bom/types.ts` - TypeScript interfaces
- [ ] `data/radars.json` - All 60+ AU radar stations
- [ ] `data/weather-stations.json` - Observation stations
- [ ] `lib/geo/distance.ts` - Haversine formula
- [ ] `lib/geo/nearest.ts` - Find nearest radar to location
- [ ] `lib/cache/redis.ts` - Upstash client
- [ ] `lib/cache/strategies.ts` - TTL configuration

### Phase 3: API Routes (Day 3)

**Deliverables:**
- [ ] `app/api/radar/route.ts` - Get radar image
- [ ] `app/api/radar/animation/route.ts` - Get radar frames
- [ ] `app/api/weather/route.ts` - Current conditions
- [ ] `app/api/forecast/route.ts` - 7-day forecast
- [ ] `app/api/location/route.ts` - Reverse geocoding
- [ ] `app/api/cron/fetch-radar/route.ts` - Pre-fetch popular radars

### Phase 4: Core UI Components (Days 4-5)

Build components per design-system-enforcer specs:

**Radar Components:**
- [ ] `components/radar/RadarViewer.tsx` - Main radar display
- [ ] `components/radar/RadarControls.tsx` - Range selector, play/pause
- [ ] `components/radar/RadarAnimation.tsx` - Frame animation
- [ ] `components/radar/RangeSelector.tsx` - 64/128/256/512km pills

**Weather Components:**
- [ ] `components/weather/CurrentConditions.tsx` - Temp, humidity, wind
- [ ] `components/weather/RainCountdown.tsx` - "Rain in ~12 mins"
- [ ] `components/weather/ForecastHourly.tsx` - Scrollable hour cards
- [ ] `components/weather/ForecastDaily.tsx` - 7-day list

**Location Components:**
- [ ] `components/location/LocationPicker.tsx` - Search modal
- [ ] `components/location/SavedLocations.tsx` - Favorites list
- [ ] `components/location/LocationButton.tsx` - Current location display

**Layout Components:**
- [ ] `components/layout/BottomNav.tsx` - Tab navigation
- [ ] `components/layout/Header.tsx` - Location + settings
- [ ] `components/layout/GlassCard.tsx` - Reusable glass panel

### Phase 5: Pages (Days 6-7)

**Deliverables:**
- [ ] `app/page.tsx` - Main radar view (Screen 1)
- [ ] `app/layout.tsx` - Root layout with providers
- [ ] `app/forecast/page.tsx` - Forecast view (Screen 2)
- [ ] `app/settings/page.tsx` - Settings (Screen 4)
- [ ] `app/pro/page.tsx` - Pro upgrade (Screen 5)
- [ ] `app/radar/[city]/page.tsx` - City-specific SEO pages
- [ ] `app/onboarding/page.tsx` - Welcome (Screen 6)
- [ ] `app/onboarding/location/page.tsx` - Location permission (Screen 7)
- [ ] `app/onboarding/notifications/page.tsx` - Notification permission (Screen 8)

### Phase 6: PWA & Notifications (Day 8)

**Deliverables:**
- [ ] `public/manifest.json` - PWA manifest
- [ ] `next.config.js` - PWA configuration
- [ ] `lib/push/vapid.ts` - VAPID setup
- [ ] `lib/push/notifications.ts` - Send push helper
- [ ] `app/api/push/subscribe/route.ts` - Subscribe endpoint
- [ ] `hooks/usePushSubscription.ts` - Client-side hook
- [ ] `hooks/useInstallPrompt.ts` - PWA install prompt
- [ ] `components/pwa/InstallPrompt.tsx` - Install banner
- [ ] `components/pwa/OfflineIndicator.tsx` - Connection status

### Phase 7: Monetization (Day 9)

**Deliverables:**
- [ ] Supabase auth setup
- [ ] User preferences table
- [ ] Subscription management
- [ ] `app/api/stripe/webhook/route.ts` - Stripe webhooks
- [ ] `app/api/stripe/checkout/route.ts` - Create checkout session
- [ ] Pro feature gating (client + server)

### Phase 8: SEO & Polish (Day 10)

**Deliverables:**
- [ ] `app/sitemap.ts` - Dynamic sitemap
- [ ] `app/robots.ts` - Robots.txt
- [ ] Meta tags on all pages (per SEO strategist)
- [ ] Structured data (JSON-LD)
- [ ] Open Graph images for city pages
- [ ] 50+ city pages generated

### Phase 9: Testing & Launch Prep (Days 11-12)

**Deliverables:**
- [ ] Unit tests for utilities
- [ ] Component tests for critical UI
- [ ] E2E tests for critical paths
- [ ] Lighthouse audit > 90 all categories
- [ ] Security audit passed
- [ ] Error boundaries implemented
- [ ] Loading states for all async operations

## Design Requirements

### Match These Screens Exactly

All 9 approved designs must be implemented pixel-perfect:

1. **Main Radar View** - Full-screen radar, glass bottom panel, range selector
2. **Forecast View** - Horizontal hourly scroll, 7-day list
3. **Location Search** - Modal with search, saved locations, popular cities
4. **Settings** - Grouped sections, toggles, Pro upgrade highlight
5. **Pro Upgrade** - Gradient header, feature list, pricing cards
6. **Onboarding: Welcome** - Centered layout, feature bullets
7. **Onboarding: Location** - Map illustration, permission request
8. **Onboarding: Notifications** - Notification preview, permission request
9. **Severe Weather Alert** - Red/orange urgency, warning details

### Design System (Mandatory)

Use ONLY these design tokens (from `02-design-system-enforcer.md`):

```typescript
// Colors
background: '#0a0a0f'
background-secondary: '#12121a'
accent: '#3b82f6'
text-primary: '#ffffff'
text-secondary: '#a0a0b0'

// Components
// Glass cards: bg-white/5 backdrop-blur-md rounded-2xl border border-white/10
// Primary button: bg-accent hover:bg-accent-hover text-white rounded-xl py-3
// Bottom nav: fixed bottom-0, bg-background-secondary/80 backdrop-blur-lg
```

## Rules (Non-negotiable)

1. **Match Design Exactly** - Use design-system-enforcer tokens, no improvisation
2. **Cache Everything** - Follow BOM specialist TTL recommendations
3. **Type Everything** - No `any` types, strict TypeScript
4. **Test as You Go** - Write tests for each feature
5. **Mobile First** - Base styles are mobile, scale up with `lg:`
6. **Follow Structure** - Use exact file paths from architect agent
7. **SEO Matters** - Every page needs meta tags and structured data

## When Stuck

1. Re-read the relevant agent file
2. Check the design mockups
3. Ask for clarification - don't guess
4. Don't skip requirements - they're there for a reason

## Quality Gates

Before considering ANY phase complete:

```bash
npm run lint        # No errors
npm run type-check  # No errors
npm run test        # All passing
npm run build       # Successful
```

## Success Criteria

The app is DONE when:

- [ ] All 9 screens implemented matching designs exactly
- [ ] Radar loads in < 2 seconds from Sydney
- [ ] PWA installable with offline radar viewing
- [ ] Push notifications working on iOS and Android
- [ ] Stripe payments processing correctly
- [ ] Lighthouse scores: Performance > 90, PWA > 90, SEO > 90, A11y > 90
- [ ] No TypeScript errors
- [ ] All tests passing
- [ ] 50+ city pages indexed by Google

## Environment Variables

Create `.env.local` with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Push Notifications (generate with: npx web-push generate-vapid-keys)
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

# Cron Secret
CRON_SECRET=

# Optional
NEXT_PUBLIC_GA_ID=
SENTRY_DSN=
```

## Final Notes

This is a time-sensitive project. Every day we delay, the BOM outrage fades and users forget. Build fast, but build right.

The agents contain everything you need. Trust them. Follow them. Don't deviate.

Good luck. Ship it. 🚀
