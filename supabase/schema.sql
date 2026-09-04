-- Ablena Support — core-loop schema.
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
-- Safe to re-run: every statement is idempotent (create-if-not-exists / drop-then-create).
--
-- Written for a project created with "Automatically expose new tables"
-- turned OFF (Supabase's own recommended setting) — so every table below
-- gets an explicit grant to `authenticated`. Without a grant, PostgREST
-- can't reach a table at all regardless of RLS; RLS is what then narrows
-- it down to the signed-in user's own rows.
grant usage on schema public to authenticated;

-- ── profiles ────────────────────────────────────────────────────────────
-- One row per signed-up user (worker OR participant), keyed to auth.users.
-- Created by the app on sign-up (see src/context/AuthContext.tsx).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

-- default 'worker' so the account(s) created before this column existed
-- keep working unchanged.
alter table public.profiles add column if not exists role text not null default 'worker';
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('worker', 'participant'));

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

-- A participant needs to see the *name* of a worker who applied to one of
-- their shifts (Applicants screen) — without this, the embedded profiles
-- join in that query is silently blocked by RLS and comes back null.
drop policy if exists "profiles: select for shift owners" on public.profiles;
create policy "profiles: select for shift owners" on public.profiles
  for select using (
    exists (
      select 1 from public.applications a
      join public.shifts s on s.id = a.shift_id
      join public.participants p on p.id = s.participant_id
      where a.worker_id = profiles.id and p.profile_id = auth.uid()
    )
  );

grant select, insert, update on public.profiles to authenticated;

-- ── participants ────────────────────────────────────────────────────────
-- The disability-support clients — a mix of fictional seed rows (Priya/
-- Tom/Grace, profile_id null) and real signed-up participant accounts
-- (profile_id = their auth uid). Both kinds can be a shift's participant_id.
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age int not null,
  suburb text not null,
  bio text not null,
  needs text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.participants add column if not exists profile_id uuid references public.profiles (id) on delete cascade;
-- Age isn't collected at sign-up (kept minimal) — only the seed rows set it.
alter table public.participants alter column age drop not null;

alter table public.participants enable row level security;

drop policy if exists "participants: select all" on public.participants;
create policy "participants: select all" on public.participants
  for select using (auth.role() = 'authenticated');

drop policy if exists "participants: insert own" on public.participants;
create policy "participants: insert own" on public.participants
  for insert with check (profile_id = auth.uid());

drop policy if exists "participants: update own" on public.participants;
create policy "participants: update own" on public.participants
  for update using (profile_id = auth.uid());

grant select, insert, update on public.participants to authenticated;

-- ── worker_profiles ─────────────────────────────────────────────────────
-- Symmetric to participants: seeded fictional workers (Amara N./Josh R.,
-- profile_id null) plus real signed-up workers who filled in a bio. Read
-- by the participant-side Browse Workers screen.
create table if not exists public.worker_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete cascade,
  name text not null,
  category text not null,
  availability text not null,
  bio text not null default '',
  skills text[] not null default '{}',
  rating numeric not null default 5,
  review_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.worker_profiles enable row level security;

drop policy if exists "worker_profiles: select all" on public.worker_profiles;
create policy "worker_profiles: select all" on public.worker_profiles
  for select using (auth.role() = 'authenticated');

drop policy if exists "worker_profiles: insert own" on public.worker_profiles;
create policy "worker_profiles: insert own" on public.worker_profiles
  for insert with check (profile_id = auth.uid());

drop policy if exists "worker_profiles: update own" on public.worker_profiles;
create policy "worker_profiles: update own" on public.worker_profiles
  for update using (profile_id = auth.uid());

grant select, insert, update on public.worker_profiles to authenticated;

-- ── shifts ──────────────────────────────────────────────────────────────
-- distance_km/match_score are seeded on the fictional demo shifts only —
-- neither is meaningful for a shift a real participant posts directly
-- (distance is worker-relative; match score implies a matching engine
-- that doesn't exist yet), so both are nullable.
create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants (id) on delete cascade,
  category text not null,
  distance_km numeric,
  match_score int,
  title text not null,
  description text not null,
  tags text[] not null default '{}',
  day_label text not null,
  time_label text not null,
  rate text not null,
  status text not null default 'open' check (status in ('open', 'filled')),
  created_at timestamptz not null default now()
);

alter table public.shifts alter column distance_km drop not null;
alter table public.shifts alter column match_score drop not null;

alter table public.shifts enable row level security;

drop policy if exists "shifts: select all" on public.shifts;
create policy "shifts: select all" on public.shifts
  for select using (auth.role() = 'authenticated');

drop policy if exists "shifts: insert own" on public.shifts;
create policy "shifts: insert own" on public.shifts
  for insert with check (
    exists (
      select 1 from public.participants p
      where p.id = shifts.participant_id and p.profile_id = auth.uid()
    )
  );

grant select, insert on public.shifts to authenticated;

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

-- A participant can see (and confirm) applicants on shifts THEY posted.
drop policy if exists "applications: select for own shifts" on public.applications;
create policy "applications: select for own shifts" on public.applications
  for select using (
    exists (
      select 1 from public.shifts s
      join public.participants p on p.id = s.participant_id
      where s.id = applications.shift_id and p.profile_id = auth.uid()
    )
  );

drop policy if exists "applications: update for own shifts" on public.applications;
create policy "applications: update for own shifts" on public.applications
  for update using (
    exists (
      select 1 from public.shifts s
      join public.participants p on p.id = s.participant_id
      where s.id = applications.shift_id and p.profile_id = auth.uid()
    )
  );

grant select, insert, update on public.applications to authenticated;

-- ── conversations ───────────────────────────────────────────────────────
-- One thread per (worker, participant) pair, not per-shift. Real accounts
-- only — a seeded fictional participant/worker (profile_id null) has no
-- auth identity to message, so the app disables the Message button for
-- those. worker_name/participant_name are captured at creation time (they
-- already equal profiles.full_name for real signups) so the list/header
-- screens don't need an extra profiles join or RLS policy to show them.
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  worker_profile_id uuid not null references public.profiles (id) on delete cascade,
  participant_profile_id uuid not null references public.profiles (id) on delete cascade,
  worker_name text not null,
  participant_name text not null,
  last_message_body text,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (worker_profile_id, participant_profile_id)
);

alter table public.conversations enable row level security;

drop policy if exists "conversations: select own" on public.conversations;
create policy "conversations: select own" on public.conversations
  for select using (auth.uid() in (worker_profile_id, participant_profile_id));

drop policy if exists "conversations: insert own" on public.conversations;
create policy "conversations: insert own" on public.conversations
  for insert with check (auth.uid() in (worker_profile_id, participant_profile_id));

drop policy if exists "conversations: update own" on public.conversations;
create policy "conversations: update own" on public.conversations
  for update using (auth.uid() in (worker_profile_id, participant_profile_id));

grant select, insert, update on public.conversations to authenticated;

-- ── messages ────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

drop policy if exists "messages: select for my conversations" on public.messages;
create policy "messages: select for my conversations" on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and auth.uid() in (c.worker_profile_id, c.participant_profile_id)
    )
  );

drop policy if exists "messages: insert for my conversations" on public.messages;
create policy "messages: insert for my conversations" on public.messages
  for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and auth.uid() in (c.worker_profile_id, c.participant_profile_id)
    )
  );

grant select, insert on public.messages to authenticated;

-- ── worker_verifications ────────────────────────────────────────────────
-- One row per screening/credential check per worker. select-all mirrors
-- worker_profiles/participants — a verification badge is a public trust
-- signal, meant to be visible to anyone browsing the marketplace, not
-- just the owning worker.
create table if not exists public.worker_verifications (
  id uuid primary key default gen_random_uuid(),
  worker_profile_id uuid not null references public.worker_profiles (id) on delete cascade,
  label text not null,
  status text not null default 'not_started' check (status in ('verified', 'in_review', 'upload_needed', 'not_started')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (worker_profile_id, label)
);

alter table public.worker_verifications enable row level security;

drop policy if exists "worker_verifications: select all" on public.worker_verifications;
create policy "worker_verifications: select all" on public.worker_verifications
  for select using (auth.role() = 'authenticated');

drop policy if exists "worker_verifications: insert own" on public.worker_verifications;
create policy "worker_verifications: insert own" on public.worker_verifications
  for insert with check (
    exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_verifications.worker_profile_id and wp.profile_id = auth.uid()
    )
  );

drop policy if exists "worker_verifications: update own" on public.worker_verifications;
create policy "worker_verifications: update own" on public.worker_verifications
  for update using (
    exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_verifications.worker_profile_id and wp.profile_id = auth.uid()
    )
  );

grant select, insert, update on public.worker_verifications to authenticated;

-- ── reviews ─────────────────────────────────────────────────────────────
-- One review per confirmed booking. worker_profiles.rating/review_count
-- are left untouched, plain columns — the app computes a live average
-- from these rows on single-worker views instead of granting anyone but
-- the worker themself write access to worker_profiles.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.applications (id) on delete cascade,
  worker_profile_id uuid not null references public.worker_profiles (id) on delete cascade,
  author_profile_id uuid not null references public.profiles (id) on delete cascade,
  author_name text not null,
  stars int not null check (stars between 1 and 5),
  text text not null default '',
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "reviews: select all" on public.reviews;
create policy "reviews: select all" on public.reviews
  for select using (auth.role() = 'authenticated');

drop policy if exists "reviews: insert for confirmed bookings" on public.reviews;
create policy "reviews: insert for confirmed bookings" on public.reviews
  for insert with check (
    author_profile_id = auth.uid()
    and exists (
      select 1
      from public.applications a
      join public.shifts s on s.id = a.shift_id
      join public.participants p on p.id = s.participant_id
      join public.worker_profiles wp on wp.profile_id = a.worker_id
      where a.id = reviews.application_id
        and a.status = 'confirmed'
        and p.profile_id = auth.uid()
        and wp.id = reviews.worker_profile_id
    )
  );

grant select, insert on public.reviews to authenticated;
