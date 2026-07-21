# 237Sentinel — Web

> **You send us something. We tell you if it's real, and why.**

React frontend for [237Sentinel](https://sentinel237cm.web.app), a digital
verification platform for Cameroon. The landing page **is the tool** — a working
submit box, above the fold, usable in seconds, no sign-up. English or French.

- **Live site:** https://sentinel237cm.web.app
- **Telegram assistant:** https://t.me/Sentinel237Bot
- **API repo:** https://github.com/JohnnyPoks/237sentinel-api

## Stack

React 18 + Vite + TypeScript, Tailwind, React Router, TanStack Query,
react-i18next (EN/FR, both complete). Deploys to Firebase Hosting.

## Run locally

```bash
npm install
cp .env.example .env          # set VITE_API_BASE_URL to your API
npm run dev                   # http://localhost:5173
```

The backend must be running (default `http://localhost:7860`) — see the API repo.

## Build & deploy (Firebase Hosting)

```bash
npm run build                 # -> dist/  (set VITE_API_BASE_URL for production)
firebase deploy               # or: npm run deploy
```

Project: `sentinel237cm` (see [`.firebaserc`](.firebaserc)). `VITE_API_BASE_URL`
points the build at the deployed API.

## The result screen — three states

**VERIFIED** (green) "This is really them." · **UNCONFIRMED** (amber) "We cannot
confirm this." · **ALTERED** (red) "This was altered." Each shows a plain
summary, a human "what we checked" line, and one clear next action; raw signals
sit in a collapsed panel. Design rationale (warm neutrals, flag colours as the
verdict states, Fraunces + Public Sans, mobile-first at 360px) is in
[DECISIONS.md](DECISIONS.md).

## License

MIT — see [LICENSE](LICENSE).
