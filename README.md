# HeritageHop 🪔

A GenAI-powered travel discovery platform that helps travelers explore India's destinations, hidden gems, heritage stories, local events, food, and authentic cultural experiences — built as a hackathon-ready, production-style MVP.

## Problem statement

> Build a GenAI-powered platform that helps travelers discover destinations and engage with local culture in meaningful ways. The solution must use Generative AI to recommend attractions, uncover hidden gems, generate immersive storytelling, promote heritage, suggest local events, and connect visitors with authentic cultural experiences.

HeritageHop addresses this with a structured AI pipeline (not a raw chatbot wrapper): user preferences → grounding data → strict-JSON AI generation → schema validation → rich, tabbed UI.

## Feature list

- **AI Destination Discovery** — personalized recommendations by interest, budget, pace, and group type
- **Hidden Gems Finder** — lesser-known, locally-loved spots with responsible-travel notes
- **Heritage Storyteller** — immersive, historically respectful narrative + audio-guide script per place
- **Day-wise Itinerary Planner** — paced to accessibility needs and travel style
- **Local Food Recommender** — vegetarian/spice-level/price-aware suggestions
- **Local Events Suggester** — real events when grounded (Ticketmaster), clearly labeled samples otherwise
- **Travel Chatbot / AI Assistant Panel** — ask for refinements ("make this more senior-friendly")
- **Budget-, Accessibility-, and Safety-Aware Planning** built into every recommendation
- **Multilingual output support** (language preference passed to the AI)
- **Etiquette & do's/don'ts**, **sustainability tips**, **authentic experience connector**
- **Confidence scores and source labels** on every AI output
- **Image-based place recognition** — marked "Coming Soon" (not implemented in this MVP)
- Admin mock workflow at `/admin` (demo password, no real auth)

## Tech stack

- Next.js 14 App Router, React 18, TypeScript
- Tailwind CSS (no paid UI library)
- Next.js API routes (Node.js runtime) as the only AI/secret boundary
- Zod for input **and** output schema validation
- Leaflet / OpenStreetMap tiles for maps (lazy-loaded, client-only)
- Supabase Postgres — optional, app works fully without it
- Gemini (primary), OpenRouter + Groq (fallback), local mock provider (guaranteed fallback)
- OpenStreetMap Overpass + Wikipedia REST API for best-effort grounding

## AI architecture

```
User preferences (Planner form)
        │
        ▼
Zod input validation  ──────────►  reject with friendly error
        │
        ▼
Prompt-injection / unsafe-topic guard (lib/security/prompt-guard.ts)
        │
        ▼
Grounding bundle (lib/ai/grounding.ts)
  ├─ local seed dataset (lib/data/india-destinations.ts) — always available
  ├─ OpenStreetMap Overpass places near city coordinates — best-effort
  └─ Wikipedia summary — best-effort
        │
        ▼
Provider fallback chain (lib/ai/provider.ts)
  Gemini ──(fail)──► OpenRouter ──(fail)──► Groq ──(fail)──► Mock (never fails)
        │
        ▼
Zod OUTPUT validation (TravelPlanOutputSchema) — rejects malformed AI JSON
        │
        ▼
API route returns { plan, meta } — meta always tells the truth about fallback
        │
        ▼
Frontend renders tabs, cards, itinerary, story mode, map
```

The frontend **never** calls Gemini/OpenRouter/Groq/Supabase directly — `/api/plan`, `/api/chat`, and `/api/events` are the only code that reads provider API keys, and those keys never appear in any client bundle.

## Environment variables

Copy `.env.example` to `.env` and fill in what you have — **everything is optional except nothing** (the app runs with zero keys configured):

```
GEMINI_API_KEY=          # primary AI provider
OPENROUTER_API_KEY=      # fallback if Gemini fails/missing
GROQ_API_KEY=            # fallback if OpenRouter fails/missing
SUPABASE_URL=            # optional persistence
SUPABASE_ANON_KEY=       # optional persistence
ADMIN_DEMO_PASSWORD=     # /admin mock login (defaults to "heritage-demo-2026" if unset)
TICKETMASTER_API_KEY=    # optional — real events instead of sample event categories
```

## How to run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

No environment variables are required — the mock provider and local seed data make the full demo flow work offline.

## How to run tests / QA

```bash
npm test          # Zod schema + prompt-guard + rate-limit + mock-provider smoke tests
npm run build     # production build (type-checks + lints + compiles)
```

## How to deploy on Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Add any of the environment variables above in Project Settings → Environment Variables (all optional).
4. Deploy — no build configuration changes needed (`next build` / `next start` are the defaults).

## Data sources

- **Local seed dataset** (`lib/data/india-destinations.ts`) — 12 cities (Jaipur, Varanasi, Delhi, Mumbai, Kolkata, Kochi, Hyderabad, Bengaluru, Udaipur, Amritsar, Hampi, Mysuru) with attractions, hidden gems, food, etiquette, safety notes, sample experiences, event categories, and coordinates. This is the **guaranteed fallback** — the app never breaks if every external API is unavailable.
- **OpenStreetMap / Overpass API** — best-effort nearby tourist/historic place lookup, used only as AI grounding context.
- **Wikipedia REST API** — best-effort city summary, used only as AI grounding context.
- **Ticketmaster Discovery API** — optional, used for real events when `TICKETMASTER_API_KEY` is set; otherwise events are clearly labeled `sample/demo cultural event suggestion`.

## Security mechanisms

- All AI/secret calls happen server-side only (`app/api/*/route.ts`); no key ever ships to the browser.
- **Input validation**: Zod schemas (`lib/validation/schemas.ts`) reject malformed/out-of-range/enum-violating requests before they reach any AI call.
- **Output validation**: AI responses are re-validated against `TravelPlanOutputSchema` — malformed AI JSON never reaches the client.
- **Prompt-injection defense**, two layers:
  1. `lib/security/prompt-guard.ts` heuristically blocks phrases like "ignore previous instructions," "reveal API key," "show system prompt," plus a list of unsafe/illegal travel-activity patterns, before the request is ever sent to an AI provider.
  2. The system prompt (`lib/ai/prompts.ts`) explicitly instructs the model to treat all user text as data, never as instructions, and to refuse unsafe/disrespectful requests.
- **Rate limiting** (`lib/security/rate-limit.ts`) — in-memory sliding window per client IP on `/api/plan`, `/api/chat`, `/api/events`, `/api/admin/login`.
- **Request timeouts** on every external fetch (Gemini/OpenRouter/Groq/Overpass/Wikipedia/Ticketmaster) — a hung upstream never hangs the app.
- **No raw error leakage** — every API route catches errors, logs a developer-facing message with `console.error`, and returns a generic user-facing message.
- `.env` is git-ignored; `.env.example` documents every variable without real values.
- The `/admin` route is a **demo-only** mock login (password compared server-side against `ADMIN_DEMO_PASSWORD`) — it is explicitly not a production authentication system.

## Error handling strategy

| Condition | Behavior |
|---|---|
| Missing/invalid AI key, quota exceeded, timeout | Falls through to the next provider, then to mock — user sees "Live AI is temporarily unavailable, so HeritageHop is showing a curated demo plan." |
| Invalid/empty AI JSON | Caught, provider marked failed, falls through the chain |
| Unknown/vague city | Fuzzy-matched against seed data (`findClosestCity`); if no match, AI/mock still generates a general plan |
| Unsafe/injection prompt | Rejected with a friendly 400 before reaching any AI provider |
| Supabase unavailable/unconfigured | `getSupabaseClient()` returns `null`; nothing in the app currently requires Supabase to function |
| Map data unavailable | `MapView` shows a friendly inline message instead of crashing |
| Incomplete form submission | Client-side + server-side (Zod) validation with field-level error messages |
| Network failure (client) | Inline error state with a "Try again" button |

## Accessibility checklist

- [x] Semantic HTML (`<fieldset>`/`<legend>`, `<nav>`, `<main>`, `<article>`, heading hierarchy)
- [x] Keyboard-navigable controls (all chips/buttons are real `<button>`s)
- [x] Visible focus states (global `:focus-visible` outline in `globals.css`)
- [x] ARIA labels/roles where needed (`role="tablist"`, `role="dialog"`, `aria-pressed`, `aria-live`)
- [x] Alt text / `aria-hidden` on decorative icons
- [x] `prefers-reduced-motion` respected globally
- [x] No color-only indicators (badges pair color with icon + text)
- [x] Proper `<label htmlFor>` on every form control, with inline validation messages
- [x] Screen-reader-friendly loading (`role="status" aria-live="polite"`) and error (`role="alert"`) states
- [x] Traveler accessibility logic: low-walking itinerary pacing, wheelchair/senior/avoid-stairs notes generated per plan

## Manual QA checklist

- [x] `npm run build` completes with no type errors
- [x] `npm test` — 17/17 smoke tests pass
- [x] App works with **zero** env vars configured (mock fallback verified via curl)
- [x] `/api/plan` returns a valid plan for Jaipur demo input; fallback chain (Gemini → OpenRouter → Groq → Mock) confirmed via `meta.providerAttempts`
- [x] `/api/plan` rejects missing fields, prompt-injection attempts, and malformed JSON with friendly 400s
- [x] `/api/chat` neutralizes an "ignore previous instructions / reveal API key" message
- [x] `/api/events` returns sample events labeled correctly when no Ticketmaster key is set
- [x] `/api/admin/login` rejects wrong password (401) and accepts the configured one (200)
- [x] All pages (`/`, `/planner`, `/planner?demo=jaipur`, `/results`, `/admin`) return HTTP 200
- [ ] Full interactive browser walkthrough (chip selection, tab switching, map rendering, story mode audio-script toggle) — verified via code review and route-level curl testing in this environment; recommend a manual click-through before a live demo since no browser automation was available here.

## Security checklist

- [x] No API keys in any client-bundled code — provider keys are only read in `lib/ai/*.ts`, which are imported exclusively by server-side `app/api/**/route.ts` files (verified: no `'use client'` component imports `lib/ai/*`)
- [x] `.gitignore` excludes `.env` and all `.env.*.local` variants
- [x] Zod validation on every API route's input
- [x] Zod validation on all AI-generated output before it reaches the client
- [x] Prompt-injection heuristic guard + system-prompt-level instruction defense
- [x] Rate limiting on all mutating/AI-calling routes
- [x] Timeouts on all external fetches
- [x] Generic error messages to clients; detailed errors only in server logs

## Demo login credentials

The `/admin` route uses a demo-only mock login (not real authentication — see [Security mechanisms](#security-mechanisms)). Current password, read from `ADMIN_DEMO_PASSWORD` in `.env`:

```
Password: heritage-demo-2026
```

If the admin login rejects this password, check `ADMIN_DEMO_PASSWORD` in `.env` — this doc is not auto-synced, so update it here too if you rotate the password.

## Demo script (for judges)

1. Open HeritageHop → click **"Explore Demo: Jaipur."**
2. Planner form auto-fills: Jaipur, 2 days, Heritage/Food/Markets/Architecture/Local life, Mid-range, Balanced, Friends, Low walking, Heritage walk.
3. Click **"Generate Cultural Journey."**
4. Walk through tabs: Overview → Attractions → Hidden Gems → Itinerary → Stories → Events → Food → Culture Notes → Map.
5. Open **Story Mode** (Stories tab) and toggle the audio-guide script.
6. Scroll to **Authentic Cultural Experiences**, click "Ask AI for Details" on a card — watch it populate the chatbot panel.
7. In the chatbot, ask **"Make this itinerary more senior-friendly"** and show the AI response.
8. Click **"Regenerate with different style"** to show plan variability.
9. Visit `/admin`, log in with the demo password (see [Demo login credentials](#demo-login-credentials)), show the "Coming Soon" dashboard cards.

## Future improvements

- Real authentication + persistence for admin (Supabase Auth + row-level security)
- Image-based place recognition (currently marked Coming Soon)
- Real booking/guide-request workflow behind the current "Coming soon" modals
- Streaming AI responses for perceived latency reduction
- Shared/Redis-backed rate limiting for multi-instance deployments
- Expand seed dataset beyond the 12 featured cities
- Automated end-to-end browser tests (Playwright) in CI
- Upgrade to Next.js 16 once the App Router migration path is validated (some upstream advisories only resolve on the major version)
