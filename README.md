# 237Sentinel — Web

> **You send us something. We tell you if it's real, and why.**

The React frontend for [237Sentinel](https://github.com/JohnnyPoks/237sentinel-api),
a digital verification platform for Cameroon. The hero of the landing page **is
the tool** — a working submit box, above the fold, usable within seconds of
arriving, no sign-up.

Backend: [`237sentinel-api`](https://github.com/JohnnyPoks/237sentinel-api).

## Stack

React 18 + Vite + TypeScript, Tailwind CSS, React Router, TanStack Query,
react-i18next (EN/FR, both complete). Deploys to Firebase Hosting.

## Run locally

```bash
npm install
cp .env.example .env          # point VITE_API_BASE_URL at your API
npm run dev                    # http://localhost:5173
```

The backend must be running (default `http://localhost:7860`). See the API repo.

## Build & deploy (Firebase Hosting)

```bash
npm run build                  # -> dist/
firebase deploy                # uses firebase.json (SPA rewrites + cache headers)
```

Set `VITE_API_BASE_URL` to the deployed Space URL for the production build. A
GitHub Action (`.github/workflows/deploy.yml`) deploys on push to `main` when a
`FIREBASE_TOKEN` (or `FIREBASE_SERVICE_ACCOUNT`) secret is configured.

## The screens

| Route | What it is |
|---|---|
| `/` | Landing — the submit box is the hero, above the fold |
| `/check` | The submission surface (paste, drag-drop, or file; type auto-detected) |
| `/result/:id` | **The result screen** — three verdict states, the most important screen |
| `/community` | Anonymous report feed + "this happened to me too" |
| `/verify/:slug` | Public organisation profile — their real channels |
| `/organizations` | Searchable registry |
| `/for-organizations` | The pitch: free tier vs protected |
| `/register` | Organisation self-registration |
| `/about`, `/privacy`, `/api-docs` | Public info |
| `/app/dashboard` | Organisation dashboard (API-key auth): alerts, channels, keys |
| `/admin` | Moderation (admin-token auth) |

## The result screen — three states

- **VERIFIED** (green band) — *"This is really them."* + the organisation.
- **UNCONFIRMED** (amber band) — *"We cannot confirm this."* + what the message
  wants + "call a number you already have". The honest, most-common default.
- **ALTERED** (red band) — *"This was altered."* + plain explanation + "do not
  share this".

Every state shows the plain summary, a human "what we checked" line, and one
clear next action. Raw signals live in a collapsed "technical detail" panel,
never first.

## Design

See [DECISIONS.md](DECISIONS.md) for the full rationale. In short: warm neutrals
(not a cold security-dashboard blue-grey), the flag colours **used as the verdict
states** (green/amber/red as meaning, not decoration — no flag graphic), a warm
display serif (Fraunces) over a civic body sans (Public Sans), mobile-first at
360px, AA contrast, visible focus, reduced-motion respected.

## Accessibility

Keyboard focus is always visible, reduced motion is respected, contrast targets
AA, and the app is usable with images off (there are no content images — meaning
is carried by text and colour-plus-text, never colour alone).

## License

MIT — see [LICENSE](LICENSE).
