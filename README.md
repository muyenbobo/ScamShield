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

## Privacy

Messages are sent from the Express server to Gemini 3.1 Flash-Lite using `store: false`. Google's free-tier terms may allow submitted content to be used to improve Google products and reviewed by humans. Don't paste sensitive personal or financial details, account numbers, or passwords. Demo with fictional or already-public messages only.

ScamShield reports patterns it detects; Low risk is not a guarantee that a message is genuine.
