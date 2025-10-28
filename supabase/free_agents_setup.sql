-- Create storage bucket for free agent media
insert into storage.buckets (id, name, public)
values ('free-agent-media', 'free-agent-media', true)
on conflict (id) do nothing;

-- Allow public read access
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'free-agent-media' );

-- Allow authenticated users to upload
create policy "Authenticated users can upload"
on storage.objects for insert
with check (
  bucket_id = 'free-agent-media' 
  and auth.role() = 'authenticated'
);

-- Allow users to update their own uploads
create policy "Users can update own uploads"
on storage.objects for update
using ( bucket_id = 'free-agent-media' and auth.role() = 'authenticated' );

-- Allow users to delete their own uploads
create policy "Users can delete own uploads"
on storage.objects for delete
using ( bucket_id = 'free-agent-media' and auth.role() = 'authenticated' );

-- Optional: Create a dedicated free_agents table (instead of using submissions)
-- Uncomment if you want a separate table for free agents

/*
create table if not exists public.free_agents (
  id bigserial primary key,
  user_id uuid references auth.users(id),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  instagram text,
  city text not null,
  state text not null,
  age_category text not null check (age_category in ('ADULT', 'YOUTH')),
  age int,
  gender text not null,
  position text,
  skill_level text not null check (skill_level in ('beginner', 'intermediate', 'advanced', 'elite')),
  experience text,
  availability text[] default '{}',
  looking_for text[] default '{}',
  travel_distance text,
  bio text,
  photo_urls text[] default '{}',
  video_urls text[] default '{}',
  status text default 'active' check (status in ('active', 'inactive', 'pending')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.free_agents enable row level security;

-- Allow public read access to active free agents
create policy "Public can view active free agents"
on public.free_agents for select
using (status = 'active');

-- Allow authenticated users to insert
create policy "Authenticated users can create free agent profiles"
on public.free_agents for insert
with check (auth.role() = 'authenticated');

-- Allow users to update their own profiles
create policy "Users can update own profiles"
on public.free_agents for update
using (auth.uid() = user_id);

-- Create index for common queries
create index if not exists idx_free_agents_age_category on public.free_agents(age_category);
create index if not exists idx_free_agents_state on public.free_agents(state);
create index if not exists idx_free_agents_skill_level on public.free_agents(skill_level);
create index if not exists idx_free_agents_status on public.free_agents(status);
*/

