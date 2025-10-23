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
