# ScamShield

ScamShield helps people understand common scam tactics in a pasted English message. It highlights exact phrases, explains the tactics, and suggests what to do next.

## Run locally

Requirements: Node.js 24 and npm.

```powershell
npm install
Copy-Item .env.example .env
```

Add a Gemini API key to `.env` as `GEMINI_API_KEY`. Keep the real key private and never commit `.env`.

```powershell
npm run dev
```

Open `http://localhost:5173`.

## Deploy to Vercel

Vercel serves the Vite build from `public/` and runs the default-exported Express app in `src/index.ts` as a function. The Gemini request has a 55-second timeout with retries disabled; a timeout follows the app's normal analysis-failure path.

```powershell
npx vercel dev
```

The first CLI run may ask you to sign in and link or create a Vercel project. For a deployment, use `npx vercel` for a preview or `npx vercel --prod` for production. In the Vercel project settings, add `GEMINI_API_KEY` as a server environment variable for the environments you deploy to, then redeploy. Do not prefix it with `VITE_` or commit it to this repository.

## Privacy

Messages are sent from the Express server to Gemini 3.1 Flash-Lite using `store: false`. Google's free-tier terms may allow submitted content to be used to improve Google products and reviewed by humans. Don't paste sensitive personal or financial details, account numbers, or passwords. Demo with fictional or already-public messages only.

ScamShield reports patterns it detects; Low risk is not a guarantee that a message is genuine.

## Why not just ask a chat AI?

ScamShield checks each quoted phrase on the server against the submitted message before showing it, returns a consistent structured response, and connects each highlighted phrase in the UI to its explanation.

## How this was tested

A small manual sanity check sent six fictional scam messages and three legitimate messages through the local API once each. All nine returned complete responses: the scams were rated High and the legitimate messages Low with no findings. Every returned excerpt matched the submitted text and was non-overlapping; no `analysis_failed` responses occurred. This is a small manual check, not a formal accuracy evaluation.

## Screenshots

Screenshot images will be added in [`docs/screenshots/`](docs/screenshots/).
