do $$
begin
  create type public.pillar_key as enum (
    'vitality',
    'mindset',
    'brotherhood',
    'legacy'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.record_status as enum (
    'planned',
    'active',
    'completed',
    'paused',
    'archived'
  );
exception
  when duplicate_object then null;
end $$;

alter table public.members
  add column if not exists auth_user_id uuid unique
    references auth.users(id) on delete set null,
  add column if not exists headline text,
  add column if not exists location_label text,
  add column if not exists industry text,
  add column if not exists current_focus text,
  add column if not exists profile_visible boolean not null default true,
  add column if not exists onboarding_completed_at timestamptz,
  add column if not exists last_active_at timestamptz;

create index if not exists members_auth_user_id_idx
  on public.members(auth_user_id);

create or replace function public.current_member_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select id
  from public.members
  where auth_user_id = (select auth.uid())
    and status = 'active'
  limit 1
$$;

revoke all on function public.current_member_id() from public;
grant execute on function public.current_member_id() to authenticated;

create table if not exists public.member_preferences (
  member_id uuid primary key references public.members(id) on delete cascade,
  timezone text not null default 'America/Chicago',
  narration_enabled boolean not null default true,
  email_updates boolean not null default true,
  weekly_review_day smallint not null default 0
    check (weekly_review_day between 0 and 6),
  updated_at timestamptz not null default now()
);

create table if not exists public.member_objectives (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  pillar public.pillar_key not null,
  title text not null check (char_length(title) between 1 and 180),
  status public.record_status not null default 'active',
  target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists member_objectives_member_status_idx
  on public.member_objectives(member_id, status, created_at desc);

create table if not exists public.protocols (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  description text not null check (char_length(description) between 1 and 500),
  pillar public.pillar_key not null default 'vitality',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.protocol_items (
  id uuid primary key default gen_random_uuid(),
  protocol_id uuid not null references public.protocols(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  guidance text check (guidance is null or char_length(guidance) <= 500),
  cadence text not null default 'daily'
    check (cadence in ('daily', 'weekly', 'as_needed')),
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now()
);

create index if not exists protocol_items_protocol_order_idx
  on public.protocol_items(protocol_id, display_order);

create table if not exists public.member_protocols (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  protocol_id uuid not null references public.protocols(id) on delete restrict,
  status public.record_status not null default 'active',
  starts_on date not null default current_date,
  ends_on date,
  created_at timestamptz not null default now(),
  unique (member_id, protocol_id)
);

create index if not exists member_protocols_member_status_idx
  on public.member_protocols(member_id, status);

create table if not exists public.protocol_checkins (
  id uuid primary key default gen_random_uuid(),
  member_protocol_id uuid not null
    references public.member_protocols(id) on delete cascade,
  protocol_item_id uuid not null
    references public.protocol_items(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  checkin_date date not null default current_date,
  completed boolean not null default true,
  note text check (note is null or char_length(note) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (member_protocol_id, protocol_item_id, checkin_date)
);

create index if not exists protocol_checkins_member_date_idx
  on public.protocol_checkins(member_id, checkin_date desc);

create table if not exists public.member_reflections (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  reflection_type text not null default 'daily'
    check (reflection_type in ('daily', 'weekly', 'decision')),
  prompt text not null check (char_length(prompt) between 1 and 300),
  response text not null check (char_length(response) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists member_reflections_member_created_idx
  on public.member_reflections(member_id, created_at desc);

create table if not exists public.legacy_projects (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 180),
  domain text not null check (
    domain in ('business', 'family', 'wealth', 'service', 'leadership', 'other')
  ),
  purpose text check (purpose is null or char_length(purpose) <= 1000),
  status public.record_status not null default 'active',
  target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists legacy_projects_member_status_idx
  on public.legacy_projects(member_id, status, created_at desc);

create table if not exists public.member_directory_profiles (
  member_id uuid primary key references public.members(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 160),
  member_number text not null check (char_length(member_number) between 1 and 16),
  headline text,
  expertise text[] not null default '{}',
  seeking text[] not null default '{}',
  offering text[] not null default '{}',
  is_visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.introduction_requests (
  id uuid primary key default gen_random_uuid(),
  requester_member_id uuid not null
    references public.members(id) on delete cascade,
  target_member_id uuid not null
    references public.members(id) on delete cascade,
  reason text not null check (char_length(reason) between 12 and 1000),
  status text not null default 'requested'
    check (status in ('requested', 'reviewing', 'introduced', 'declined', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (requester_member_id <> target_member_id)
);

create index if not exists introduction_requests_requester_idx
  on public.introduction_requests(requester_member_id, created_at desc);
create index if not exists introduction_requests_target_idx
  on public.introduction_requests(target_member_id, created_at desc);

create table if not exists public.member_events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 180),
  summary text not null check (char_length(summary) between 1 and 1000),
  starts_at timestamptz not null,
  location_label text,
  is_virtual boolean not null default false,
  status text not null default 'scheduled'
    check (status in ('draft', 'scheduled', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.event_rsvps (
  event_id uuid not null references public.member_events(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  status text not null default 'attending'
    check (status in ('attending', 'interested', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (event_id, member_id)
);

alter table public.member_preferences enable row level security;
alter table public.member_objectives enable row level security;
alter table public.protocols enable row level security;
alter table public.protocol_items enable row level security;
alter table public.member_protocols enable row level security;
alter table public.protocol_checkins enable row level security;
alter table public.member_reflections enable row level security;
alter table public.legacy_projects enable row level security;
alter table public.member_directory_profiles enable row level security;
alter table public.introduction_requests enable row level security;
alter table public.member_events enable row level security;
alter table public.event_rsvps enable row level security;

create policy "members can read their own profile"
  on public.members for select to authenticated
  using (id = (select public.current_member_id()));

create policy "members manage their preferences"
  on public.member_preferences for all to authenticated
  using (member_id = (select public.current_member_id()))
  with check (member_id = (select public.current_member_id()));

create policy "members manage their objectives"
  on public.member_objectives for all to authenticated
  using (member_id = (select public.current_member_id()))
  with check (member_id = (select public.current_member_id()));

create policy "active members can read protocols"
  on public.protocols for select to authenticated
  using ((select public.current_member_id()) is not null and is_active);

create policy "active members can read protocol items"
  on public.protocol_items for select to authenticated
  using ((select public.current_member_id()) is not null);

create policy "members read their protocol assignments"
  on public.member_protocols for select to authenticated
  using (member_id = (select public.current_member_id()));

create policy "members manage their checkins"
  on public.protocol_checkins for all to authenticated
  using (member_id = (select public.current_member_id()))
  with check (member_id = (select public.current_member_id()));

create policy "members manage their reflections"
  on public.member_reflections for all to authenticated
  using (member_id = (select public.current_member_id()))
  with check (member_id = (select public.current_member_id()));

create policy "members manage their legacy projects"
  on public.legacy_projects for all to authenticated
  using (member_id = (select public.current_member_id()))
  with check (member_id = (select public.current_member_id()));

create policy "active members can read visible directory profiles"
  on public.member_directory_profiles for select to authenticated
  using (
    (select public.current_member_id()) is not null
    and (is_visible or member_id = (select public.current_member_id()))
  );

create policy "members manage their directory profile"
  on public.member_directory_profiles for all to authenticated
  using (member_id = (select public.current_member_id()))
  with check (member_id = (select public.current_member_id()));

create policy "members read related introduction requests"
  on public.introduction_requests for select to authenticated
  using (
    requester_member_id = (select public.current_member_id())
    or target_member_id = (select public.current_member_id())
  );

create policy "members request curated introductions"
  on public.introduction_requests for insert to authenticated
  with check (requester_member_id = (select public.current_member_id()));

create policy "active members read scheduled events"
  on public.member_events for select to authenticated
  using (
    (select public.current_member_id()) is not null
    and status in ('scheduled', 'completed')
  );

create policy "members manage their rsvps"
  on public.event_rsvps for all to authenticated
  using (member_id = (select public.current_member_id()))
  with check (member_id = (select public.current_member_id()));

comment on function public.current_member_id() is
  'Returns the active member attached to the current authenticated Supabase user.';
comment on table public.member_objectives is
  'Member-owned priorities; these are not performance scores.';
comment on table public.protocol_checkins is
  'Member-entered completion records. Not medical data or clinical guidance.';
comment on table public.introduction_requests is
  'Curated introduction requests. Phase 2 intentionally does not provide direct messaging.';
