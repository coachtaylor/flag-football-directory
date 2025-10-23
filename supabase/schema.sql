create table if not exists public.cities (
  id bigserial primary key,
  name text not null,
  state text not null,
  slug text unique not null,
  lat numeric,
  lng numeric
);

create table if not exists public.leagues (
  id bigserial primary key,
  city_id bigint references public.cities(id) on delete cascade,
  name text not null,
  website text,
  fees numeric,
  season_start date,
  season_end date,
  divisions text[] default '{}',
  nights text[] default '{}',
  signup_url text,
  verified boolean default false,
  verified_by text,
  created_at timestamptz default now()
);

create table if not exists public.events (
  id bigserial primary key,
  state text not null,
  name text not null,
  start_date date not null,
  end_date date,
  location text,
  divisions text[] default '{}',
  fee numeric,
  website text,
  signup_url text,
  created_at timestamptz default now()
);

create table if not exists public.submissions (
  id bigserial primary key,
  type text not null,
  payload jsonb not null,
  source text,
  status text default 'new',
  created_at timestamptz default now()
);
