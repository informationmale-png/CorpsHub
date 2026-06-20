-- CorpsHub database schema. Paste this into Supabase → SQL Editor → Run.

-- 1. PROFILES — one row per fellow, linked to the auth user.
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  cohort text default '',
  host_org text default '',
  sector text default '',
  bio text default '',
  avatar_url text default '',
  linkedin_url text default '',
  website text default '',
  created_at timestamptz not null default now()
);
-- If the table already existed, add the newer profile columns:
alter table profiles add column if not exists avatar_url text default '';
alter table profiles add column if not exists linkedin_url text default '';
alter table profiles add column if not exists website text default '';

-- 2. PROJECTS — what a fellow built.
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  one_liner text not null default '',
  problem text not null default '',
  solution text not null default '',
  setup_needs text not null default '',
  setup_time text not null default '',        -- 'Under 1 day' | '1-3 days' | '1 week+'
  difficulty text not null default 'Beginner',-- Beginner | Intermediate | Advanced
  sector text not null default '',
  org_size text not null default '',          -- Small | Medium | Large
  note_to_next text not null default '',
  github_url text default '',
  verified boolean not null default false,    -- "Verified by Anthropic" badge
  created_at timestamptz not null default now()
);

-- 3. REVIEWS — nonprofit feedback on a project.
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  author_name text not null default '',
  org_name text not null default '',
  rating int not null check (rating between 1 and 5),
  body text not null default '',
  created_at timestamptz not null default now()
);

-- 4. DEPLOYMENTS — each time an org deploys a project (powers impact numbers).
create table if not exists deployments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  org_name text not null default '',
  state text default '',
  hours_saved int not null default 0,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row when a new user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---- Row Level Security ----
alter table profiles    enable row level security;
alter table projects    enable row level security;
alter table reviews     enable row level security;
alter table deployments enable row level security;

-- Everyone can read everything (public library).
create policy "public read profiles"    on profiles    for select using (true);
create policy "public read projects"     on projects     for select using (true);
create policy "public read reviews"      on reviews      for select using (true);
create policy "public read deployments"  on deployments  for select using (true);

-- Fellows manage their own profile.
create policy "own profile upsert" on profiles for insert with check (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);

-- Fellows create their own projects and edit only their own.
create policy "create own project" on projects for insert with check (auth.uid() = author_id);
create policy "update own project" on projects for update using (auth.uid() = author_id);
create policy "delete own project" on projects for delete using (auth.uid() = author_id);

-- Any signed-in user can post reviews and log deployments.
create policy "auth insert reviews"     on reviews     for insert with check (auth.role() = 'authenticated');
create policy "auth insert deployments" on deployments for insert with check (auth.role() = 'authenticated');

-- ---- Storage: public "avatars" bucket for profile pictures ----
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Anyone can view avatars; a fellow can upload/replace only files under their own user-id folder.
create policy "avatars public read" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "avatars own insert" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatars own update" on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatars own delete" on storage.objects
  for delete using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
