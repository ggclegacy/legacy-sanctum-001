alter table public.invites
  add column if not exists access_code_hash text unique
    check (
      access_code_hash is null
      or char_length(access_code_hash) = 64
    );

create index if not exists invites_access_code_hash_idx
  on public.invites(access_code_hash)
  where access_code_hash is not null;

comment on column public.invites.access_code_hash is
  'SHA-256 hash of the printed Legacy Access Code. The plaintext code is never stored.';
