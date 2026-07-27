create extension if not exists pgcrypto;

do $$
begin
  create type public.member_type as enum (
    'founding_member',
    'invited_member',
    'partner',
    'ambassador'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.member_status as enum (
    'invited',
    'active',
    'inactive',
    'archived'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.invite_status as enum (
    'draft',
    'ready',
    'sent',
    'opened',
    'verified',
    'accepted',
    'declined',
    'completed',
    'expired',
    'revoked',
    'locked'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.narration_status as enum (
    'draft',
    'approved',
    'generated',
    'reviewed',
    'published',
    'retired'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.invite_response_type as enum (
    'accepted',
    'feedback',
    'conversation_requested',
    'product_recipient_only'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text,
  display_name text not null check (char_length(display_name) between 1 and 160),
  member_number text not null unique check (char_length(member_number) between 1 and 16),
  member_type public.member_type not null default 'invited_member',
  status public.member_status not null default 'invited',
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete restrict,
  public_token_hash text not null unique check (char_length(public_token_hash) = 64),
  pin_hash text not null check (pin_hash like 'scrypt$%'),
  status public.invite_status not null default 'draft',
  expires_at timestamptz,
  max_attempts integer not null default 6 check (max_attempts between 1 and 20),
  failed_attempts integer not null default 0 check (failed_attempts >= 0),
  locked_at timestamptz,
  first_opened_at timestamptz,
  verified_at timestamptz,
  accepted_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists invites_member_id_idx on public.invites(member_id);
create index if not exists invites_status_idx on public.invites(status);
create index if not exists invites_expires_at_idx on public.invites(expires_at);

create table if not exists public.invite_content (
  invite_id uuid primary key references public.invites(id) on delete cascade,
  custom_headline text,
  why_selected text not null,
  founder_message text not null,
  vision_message text not null,
  founding_member_message text not null,
  closing_message text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_purpose text not null,
  image_path text,
  usage_note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invite_products (
  invite_id uuid not null references public.invites(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  display_order integer not null default 0 check (display_order >= 0),
  selection_reason text not null,
  custom_usage_note text,
  primary key (invite_id, product_id)
);

create index if not exists invite_products_order_idx
  on public.invite_products(invite_id, display_order);

create table if not exists public.narration_segments (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid not null references public.invites(id) on delete cascade,
  scene_key text not null check (
    scene_key in (
      'recognition',
      'founder',
      'selection',
      'pillars',
      'products',
      'platform',
      'founding',
      'response',
      'completion'
    )
  ),
  script text not null,
  audio_path text,
  duration_ms integer check (duration_ms is null or duration_ms > 0),
  voice_version text,
  status public.narration_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (invite_id, scene_key)
);

create table if not exists public.invite_events (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid not null references public.invites(id) on delete cascade,
  anonymous_session_id uuid,
  event_type text not null check (
    event_type in (
      'invite_opened',
      'pin_verified',
      'experience_started',
      'scene_viewed',
      'scene_completed',
      'audio_enabled',
      'audio_muted',
      'audio_skipped',
      'invitation_accepted',
      'feedback_submitted',
      'conversation_requested',
      'experience_completed'
    )
  ),
  scene_key text check (
    scene_key is null or scene_key in (
      'recognition',
      'founder',
      'selection',
      'pillars',
      'products',
      'platform',
      'founding',
      'response',
      'completion'
    )
  ),
  created_at timestamptz not null default now()
);

create index if not exists invite_events_invite_created_idx
  on public.invite_events(invite_id, created_at desc);

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid not null references public.invites(id) on delete cascade,
  response_type public.invite_response_type not null,
  message text check (message is null or char_length(message) <= 2000),
  preferred_contact_method text not null default 'none' check (
    preferred_contact_method in ('email', 'phone', 'either', 'none')
  ),
  created_at timestamptz not null default now()
);

create index if not exists responses_invite_created_idx
  on public.responses(invite_id, created_at desc);

create unique index if not exists responses_one_acceptance_per_invite_idx
  on public.responses(invite_id)
  where response_type = 'accepted';

alter table public.members enable row level security;
alter table public.invites enable row level security;
alter table public.invite_content enable row level security;
alter table public.products enable row level security;
alter table public.invite_products enable row level security;
alter table public.narration_segments enable row level security;
alter table public.invite_events enable row level security;
alter table public.responses enable row level security;

comment on table public.invites is
  'Private invitation records. Browser clients have no direct policy access.';
comment on column public.invites.public_token_hash is
  'SHA-256 hash of a cryptographically random URL-safe token. Never store plaintext.';
comment on column public.invites.pin_hash is
  'Scrypt hash encoded as scrypt$N$r$p$salt$key. Never store plaintext.';
comment on table public.narration_segments is
  'Only reviewed or published Atlas audio may be returned to a verified recipient.';
