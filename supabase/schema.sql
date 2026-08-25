-- Ablena Support — core-loop schema.
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
-- Safe to re-run: every statement is idempotent (create-if-not-exists / drop-then-create).

-- ── profiles ────────────────────────────────────────────────────────────
-- One row per signed-up worker, keyed to auth.users. Created by the app on
-- sign-up (see src/context/AuthContext.tsx).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: select own" on public.profiles;
create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- ── participants ────────────────────────────────────────────────────────
-- Reference data (the disability-support clients). Seeded via seed.sql;
-- not writable from the app in this pass.
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age int not null,
  suburb text not null,
  bio text not null,
  needs text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.participants enable row level security;

drop policy if exists "participants: select all" on public.participants;
create policy "participants: select all" on public.participants
  for select using (auth.role() = 'authenticated');

-- ── shifts ──────────────────────────────────────────────────────────────
-- match_score is seeded/static in this pass, not computed by a real
-- matching engine — that's a later piece of work.
create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants (id) on delete cascade,
  category text not null,
  distance_km numeric not null,
  match_score int not null,
  title text not null,
  description text not null,
  tags text[] not null default '{}',
  day_label text not null,
  time_label text not null,
  rate text not null,
  status text not null default 'open' check (status in ('open', 'filled')),
  created_at timestamptz not null default now()
);

alter table public.shifts enable row level security;

drop policy if exists "shifts: select all" on public.shifts;
create policy "shifts: select all" on public.shifts
  for select using (auth.role() = 'authenticated');

-- ── applications ────────────────────────────────────────────────────────
-- Backs both "Apply" (Match Detail) and "my bookings" (Schedule).
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references public.shifts (id) on delete cascade,
  worker_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'applied' check (status in ('applied', 'confirmed')),
  created_at timestamptz not null default now(),
  unique (shift_id, worker_id)
);

alter table public.applications enable row level security;

drop policy if exists "applications: select own" on public.applications;
create policy "applications: select own" on public.applications
  for select using (auth.uid() = worker_id);

drop policy if exists "applications: insert own" on public.applications;
create policy "applications: insert own" on public.applications
  for insert with check (auth.uid() = worker_id);
