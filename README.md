# Legacy Sanctum Invitation Protocol

Phase 1 invitation experience plus the Phase 2 founding-member application
beta.

## What this build includes

- Cinematic mobile-first private entry
- Canonical Legacy Sanctum emblem at `/icon.png`
- Narrated or silent entry choice
- Secure token and PIN verification boundary
- Short-lived, signed, HTTP-only invitation session
- Database-driven invitation scenes
- Four-pillar and selected-product scenes
- Coded future member-app preview
- Atlas-ready narration manifest and captions
- Invitation responses and minimal allowlisted events
- Supabase migration with Row Level Security
- Passwordless, invitation-only member access
- Protected Command Center, Vitality, Mindset, Brotherhood, Legacy, and Atlas
  surfaces
- Member-owned objectives, protocol check-ins, reflections, legacy projects,
  curated introduction requests, and event responses
- Responsive member application shell
- Transparent, rules-based Atlas beta guidance without simulated AI

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase publishable key, server secret key, and a 32-character or longer invitation session secret.
3. Apply both files in `supabase/migrations/` to the linked Supabase project,
   in numerical order.
4. Install dependencies with `npm install`.
5. Run `npm run dev`.

Generate a cryptographically random invitation token, six-digit printed PIN,
and their database-safe hashes with:

```bash
npm run invite:secrets
```

Treat the plaintext token and PIN printed by this command as private package
materials. Store only the hashes in Supabase.

The public arrival is available at `/`. Live invitations use
`/invite/[unguessable-token]`.

For an internal, non-production experience preview, set:

```bash
ENABLE_INTERNAL_PREVIEW=true
```

Then open `/preview` in development. The preview route is unavailable in
production and contains no real member data.

The Phase 2 Command Center visual preview is available at `/member-preview`
under the same internal-preview guard. Live member routes begin at `/member`
and require an authenticated, active member linked to `auth.users`.

## Required validation

```bash
npm run lint
npm run typecheck
npm run build
```

## Security notes

- Never commit `.env.local`.
- Never expose `SUPABASE_SECRET_KEY` or `INVITE_SESSION_SECRET`.
- Store only SHA-256 invitation-token hashes and scrypt PIN hashes.
- Public Supabase clients have no direct access policies to invitation data.
- Member data is protected with ownership-based Row Level Security.
- Passwordless access does not create public accounts; the submitted email
  must match an existing invited or active member.
- Brotherhood uses curated introductions rather than unrestricted direct
  messaging.
- Phase 2 Atlas guidance is deterministic and derived from member-owned data.
- The included memory limiter is best-effort local protection. Add a
  distributed production rate limiter before live invitations are issued.
- Approved Atlas audio must be marked reviewed or published before it can be
  returned to a recipient.

See `BUILD_STATUS.md` for current readiness and unresolved launch requirements.
