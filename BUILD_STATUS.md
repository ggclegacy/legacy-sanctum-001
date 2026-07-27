# Legacy Sanctum Build Status

## Phase 1 — Invitation Protocol

Completed:

- Next.js App Router foundation with strict TypeScript, Tailwind CSS, and ESLint
- Canonical `icon.png` preserved and served from `/icon.png`
- Mobile-first cinematic universal arrival
- Printed Legacy Access Code verification from the shared home page
- Permanent `LS-NS-000` founder preview with isolated activity
- Personalized `LS-BV-001` founding-member presentation
- Atlas-guided or silent entry choice with approved-audio readiness
- Signed HTTP-only invitation session
- Database-driven reusable scene engine
- Founding-member recognition, pillars, products, response, and completion
  scenes
- Guided interactive member-platform teaser with six simulated touchpoints:
  Command Center, Atlas, Vitality, Mindset, Brotherhood, and Legacy
- Supabase migration with Row Level Security
- Internal non-production visual preview

## Phase 2 — Founding-Member Beta

Completed:

- Invitation-only, passwordless Supabase Auth entry
- Server-rendered member session validation and protected routes
- Secure member-to-auth-account linking after callback
- Responsive member application shell
- Command Center
- Vitality protocol and member-entered daily check-ins
- Mindset reflections and private archive
- Curated Brotherhood directory, introduction requests, and event responses
- Legacy project creation and tracking
- Atlas guidance beta derived transparently from member-owned records
- Active objectives across Vitality, Mindset, Brotherhood, and Legacy
- Ownership-based RLS policies for all Phase 2 member data
- Safe unavailable states when credentials are absent
- Development-only Command Center preview with no real member data

## Current structure

```text
src/app/
  page.tsx             Universal arrival and Legacy Access Code entry
  api/invitations/
    access/             Server-side access-code recognition
  invite/[token]/       Phase 1 private induction
  sign-in/              Invitation-only passwordless access
  auth/callback/        Session exchange and member linking
  member/               Protected Phase 2 application
    vitality/
    mindset/
    brotherhood/
    legacy/
    atlas/
  member-preview/       Development-only visual QA

src/components/
  invitation/           Cinematic invitation scenes
  member/               Phase 2 shell and member surfaces
  preview/              Phase 1 member-app reveal

supabase/migrations/
  0001_invitation_protocol.sql
  0002_member_beta.sql
  0003_universal_access_codes.sql
```

## Deliberately outside Phase 2

- Public enrollment
- Paid memberships or billing
- Full invitation administration dashboard
- Live generative AI coaching
- Synthetic Atlas voice or fake narration
- Member direct messaging
- Wearable integrations
- Medical diagnosis, clinical recommendations, or invented wellness scores
- Broad social feed or generic community features

## Unresolved launch requirements

- Supabase publishable key
- Supabase server secret key
- Invitation session secret
- All migrations applied to the live Supabase project
- Live access-code hashes and approved invitation content inserted in Supabase
- Production site URL and Supabase Auth redirect allowlist
- Production Vercel environment variables
- Approved founding-member records and verified email addresses
- Approved member protocol assignments
- Approved directory visibility and member profile copy
- Approved event data
- Final privacy, data retention, acceptance, and wellness disclaimers
- Production-grade distributed rate limiter for invitation verification
- End-to-end testing against live Supabase Auth and RLS

## Security boundary

The app never exposes plaintext access codes to the browser bundle. The initial
founder and Blair experiences are server-only launch records so the invitation
can be reviewed before live Supabase credentials are connected. Once a matching
Supabase record exists, it takes precedence and activates persistent events and
responses. Member records remain protected through ownership-based Row Level
Security.

## Recommended Phase 3

Validate Phase 1 and Phase 2 with the first approved founding members before
expanding scope. The next operational build should prioritize a private
administration system for invitation creation, member onboarding, protocol
assignment, curated introductions, content approval, QR export, revocation,
and Atlas briefing review.
