# Legacy Sanctum Invitation Protocol

Phase 1 invitation experience plus the Phase 2 founding-member application
beta.

## What this build includes

- Cinematic mobile-first private entry
- Canonical Legacy Sanctum emblem at `/icon.png`
- One universal QR destination at `/`
- Server-verified Legacy Access Code entry
- Permanent founder preview mode through `LS-NS-000`
- Personalized founding-member presentations
- Atlas-guided or silent entry choice
- Short-lived, signed, HTTP-only invitation session
- Database-driven invitation scenes
- Four-pillar and selected-product scenes
- Guided interactive future member-app teaser with six simulated touchpoints
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
3. Apply all files in `supabase/migrations/` to the linked Supabase project,
   in numerical order.
4. Install dependencies with `npm install`.
5. Run `npm run dev`.

The public arrival is available at `/`. Every printed QR code should point to
that same URL. The recipient enters the Legacy Access Code printed inside the
package, and the server loads his personalized experience.

`LS-NS-000` is the permanent founder preview code. It runs the complete
experience with a visible Preview Mode marker and never records responses or
analytics. The earlier token-and-PIN route remains available for compatibility
while existing invitation records are migrated.

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
- Store only SHA-256 access-code or invitation-token hashes and scrypt PIN
  hashes.
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
