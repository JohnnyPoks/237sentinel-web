# DECISIONS.md — 237Sentinel Web

## Design direction

The brief was emphatic: **do not build a generic dark-slate security dashboard.**
`#0F172A` + emerald is the reflexive answer for "cybersecurity product" and reads
as templated. The audience is an ordinary Cameroonian on a mid-range Android on a
slow connection — not a SOC analyst. So:

- **Warm neutrals, not cold blue-grey.** The base is a warm sand/cream
  (`#FBF7F0`) with a warm near-black ink (`#2B2621`). It should feel like a civic
  institution that cares, not a hacker console.
- **The flag colours ARE the verdict states.** Green = VERIFIED, amber =
  UNCONFIRMED, red = ALTERED. The national identity is expressed through
  *function*, not paint. There is no flag graphic anywhere.
- **One signature element:** the full-width, bold verdict band at the top of the
  result screen, set in the display serif. Everything else is quiet.

## Typography (justified, per the brief)

- **Display: Fraunces.** A warm, high-contrast serif with optical sizing. It gives
  the product institutional gravitas *and* human warmth — like a letter from
  someone who takes your safety seriously, not a system alert.
- **Body: Public Sans.** Literally designed (by the US Web Design System) for
  public-sector interfaces: highly legible at small sizes on cheap screens, open
  apertures, no personality tax on the reader. Perfect for a civic-trust product
  where clarity is safety. Not Inter (the brief explicitly warned against it).
- Both are loaded from Google Fonts with limited weights and `display=swap`, so a
  slow connection falls back to system fonts rather than blocking text.

## The aesthetic risk (taken deliberately)

**Using a warm serif (Fraunces) as the primary display face for a
security/verification product.** Security tools never do this — they reach for
cold geometric sans to signal "technical rigour". The risk is that it reads as
"soft" for a fraud tool. The bet is the opposite: warmth plus authority is
exactly what earns trust from a frightened parent, and it differentiates hard
from every templated security UI. It directly serves the tie-breaker question —
*would a Cameroonian parent who just got a scary message about their child's exams
understand this and feel steadied by it?*

## Architecture choices

- **Result passed via router state** from the submit box to the result screen, so
  the common path never re-fetches. Cold-loading `/result/:id` falls back to the
  API's stored copy.
- **Dashboard sub-pages consolidated.** The brief lists `/app/channels`,
  `/app/alerts`, `/app/api-keys`, `/app/settings` as separate routes; they are
  implemented as tabs within `/app/dashboard` to ship the functionality without
  four near-identical shells. Splitting them later is trivial.
- **Auth is API-key based**, stored in `localStorage`, matching the backend's
  organisation auth. No password/identity stack was added — out of scope for this
  build and noted as future work.
- **TanStack Query** for all server state (caching, loading, mutations) so the UI
  stays declarative.

## Accessibility

Visible focus rings, `prefers-reduced-motion` honoured, AA contrast on all
verdict bands (colours were darkened from the naive green/amber/red to pass), and
colour is never the sole signal — every verdict carries an icon and copy too.
Mobile-first; the primary test width is 360px.
