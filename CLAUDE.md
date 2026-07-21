# CLAUDE.md — 237Sentinel Web

Conventions and gotchas for future sessions.

## Product rules (shared with the API)

- **Never show "AI-generated" as a verdict.** There are exactly three verdicts:
  VERIFIED / UNCONFIRMED / ALTERED. The copy is in `src/locales/*.json` under
  `verdict.*` and the explanation text comes from the API.
- **Never show a bare confidence percentage.** Confidence is a band
  (low/medium/high). See `result.confidence*` strings.
- **Commits are plain and human.** No attribution trailers, ever.

## Commands

```bash
npm run dev       # dev server on :5173
npm run build     # tsc -b && vite build -> dist/
npm run test      # vitest (verdict-rendering logic)
npm run lint      # tsc --noEmit
```

## Where things live

- `src/config.ts` — `APP_NAME` (the one place the product is named) + `API_BASE_URL`.
- `src/lib/api.ts` — every backend call. Typed against `src/lib/types.ts`.
- `src/lib/explanation.ts` — `pickExplanation()` chooses the EN/FR field; unit-tested.
- `src/components/verdictTheme.ts` — maps each verdict to its colour treatment.
- `src/components/SubmitBox.tsx` — the reusable tool (landing hero + /check).
- `src/pages/Result.tsx` — the result screen; the most important file.

## i18n

Two complete locales, `en` and `fr`. French is not optional — this is Cameroon.
Default fallback is `fr`. Add every new string to BOTH files. Arrays use
`t(key, { returnObjects: true }) as string[]`.

## Design tokens

Tailwind config holds the palette. `sand.*` = warm neutrals; `verified/unconfirmed
/altered` = the verdict colours (green/amber/red) used as MEANING. Fonts:
`font-display` (Fraunces) for headings, `font-sans` (Public Sans) for body. Do
not introduce Inter or a cold blue-grey.

## Accessibility floor (do not regress)

Visible `:focus-visible` outline, reduced-motion media query, AA contrast, colour
is never the only signal (verdict always has text + icon + copy). Test at 360px.

## Gotchas

- The result is passed via router `state` from SubmitBox to avoid a re-fetch;
  `Result.tsx` falls back to `GET /analyze/:id` when opened cold (that stored
  copy has a trimmed registry object — that's expected).
- API base URL comes from `VITE_API_BASE_URL` at build time; set it before
  `npm run build` for production.
