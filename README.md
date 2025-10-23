# FlagFootballDirectory — Starter

Next.js (App Router) + Supabase scaffold for a flag football directory.
- City pages with ItemList JSON-LD
- Referees pillar + CTAs
- `/submit` intake → Supabase `public.submissions`
- Robots allow GPTBot & OAI-SearchBot

## Quickstart
```bash
npm i
cp .env.example .env.local  # fill values
npm run dev
```

Create Supabase tables:
```
supabase/schema.sql
supabase/seed.sql
```

Routes: `/`, `/leagues/phoenix`, `/leagues/san-diego`, `/referees`, `/submit`

## Applying the Supabase text encoding polyfill

If you encounter runtime errors from Supabase complaining about missing `TextEncoder` or `TextDecoder` globals (common in older Node runtimes), make sure the polyfill is applied before any Supabase code executes:

1. Copy the helper found in `app/polyfills.ts`. It re-exports Node's implementations of `TextEncoder`/`TextDecoder` to the global scope when the runtime does not provide them automatically.
2. Import the helper at the top of `app/layout.tsx` (`import './polyfills'`) so it runs once during application startup.

With those two steps in place, reload the application. The global objects will be defined before Supabase initializes, preventing the `TextEncoder`/`TextDecoder` errors.
