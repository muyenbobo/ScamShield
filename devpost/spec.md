---
doc: spec
status: approved
---

# ScamShield — Technical Spec

## How This Works, In Plain Language

The page is built with React. It keeps the pasted message and the result in the browser only while that page is open. When someone selects **Analyze**, the page sends the message to ScamShield's Express server. The server keeps the Gemini key private, asks Gemini to return a fixed JSON shape, and checks that the quoted evidence really appears in the message before sending a result back.

Vercel hosts the built page and runs the Express app when the browser calls its API. The page and API share one Vercel project and one address. ScamShield does not save a history or use a database. Google's Gemini free tier may use submitted content to improve Google products and may allow human review, so the notice must be visible before submission and demo inputs must be public, fictional, or anonymized.

This uses familiar JavaScript/TypeScript tools and one AI provider. The JSON schema keeps the response shape predictable; server-side checks handle the part a schema cannot guarantee: whether a quoted phrase is genuine evidence.

## The Core Journey Through the System

Implements `prd.md > The Core Journey`, `prd.md > Screens and Layout`, and `prd.md > States and Boundaries`.

1. The user pastes English text into the React text box. React holds it in page memory and shows the Gemini data-use notice before the Analyze action.
2. On **Analyze**, the page rejects empty input locally, disables editing and repeat submissions, and sends `POST /api/analyze` with `{ "message": "..." }`.
3. Express validates the request and calls Gemini's Interactions API with the text, a system instruction describing the English-only scam-analysis behavior, a JSON response schema, and `store: false`. If the message is not English, the model returns the unsupported-language status without assigning scam risk or tactics.
4. The server interprets the response status. Unsupported language and insufficient context return their own non-result states. A completed result is parsed and validated. Every finding excerpt must be an exact substring of the submitted message; the server computes its character offsets. Medium/High without valid evidence, malformed output, or overlapping/invalid highlights fail as one unit.
5. The page renders a labeled Low / Medium / High badge, the exact message with connected phrase highlights and explanations, and one recommendation. Low may have no highlights and never means verified safe.
6. **Analyze another message** clears the input and result and focuses the empty text box. Nothing is stored for later retrieval.

```text
Browser (React page state)
  └─ POST /api/analyze ──> Express on Vercel
                              └─ Interactions API ──> Gemini 3.1 Flash-Lite
                              <── validated result ──┘
  <── display result / clear for next message
```

## Stack

- **TypeScript + Node.js 24 LTS** — one language across browser and server, with types for the shared request/result contract. Use a current Node 24 release locally and configure Vercel for Node 24. [Vercel Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- **React 19 + Vite** — React handles the focused single-screen states and inline highlights; Vite serves the development page and builds static assets into `public/`. Vite's `publicDir` will be disabled so its source public folder is not copied into its own build output. [React](https://react.dev/), [Vite build](https://vite.dev/guide/build), [Vite build options](https://vite.dev/config/build-options)
- **`@vitejs/plugin-react`, `tsx`, and `concurrently`** — Vite's React integration plus a simple local TypeScript runner and one command to run Vite and Express together. [Vite React plugin](https://github.com/vitejs/vite-plugin-react), [tsx](https://tsx.is/), [concurrently](https://github.com/open-cli-tools/concurrently)
- **Express 5** — the familiar Node API layer validates input, calls Gemini, verifies excerpts, and returns a small JSON response. Vercel recognizes a default-exported app in `src/index.ts` as an Express function. [Express](https://expressjs.com/), [Express on Vercel](https://vercel.com/docs/frameworks/backend/express)
- **Google GenAI JavaScript SDK (`@google/genai`)** — calls Gemini's Interactions API from the server. Keep package versions current and compatible when initializing the project, then commit `package-lock.json` so installs are repeatable. [SDK and Interactions quickstart](https://ai.google.dev/gemini-api/docs/get-started)
- **No database, authentication, or client-side API key** — none supports the agreed proof of concept; the API key stays in server environment variables.

Versions above are the supported major lines selected for the plan. Exact package versions are to be resolved and recorded in the lockfile during the build; check Gemini model access and the chosen package's Interactions API support before implementation.

## Where It Runs and How Someone Tries It

### Local development

Requirements: Node.js 24 LTS, npm, and a Gemini API key from Google AI Studio. From the project root:

```powershell
npm install
Copy-Item .env.example .env
# Add GEMINI_API_KEY to .env using a local editor; never commit the real value.
npm run dev
```

Open `http://localhost:5173`. The Vite development server proxies `/api` requests to the local Express process. The `dev` script runs Vite and the TypeScript Express entry together; no production build is required for local iteration.

### Vercel Hobby deployment

The learner chose one Vercel project for both the React static build and Express function. Vite builds into the root `public/` directory; Vercel serves those static files and the Express app handles `/api/analyze`. `express.static()` is not used. Add `GEMINI_API_KEY` as a sensitive server environment variable in Vercel Project Settings, never with a `VITE_` prefix. Use the Express framework preset, Node.js 24, and `npm run build`. The Express integration deploys the app as one function; Vercel's current Hobby Fluid Compute limit is longer than this proof of concept needs, so cap the Gemini request at 55 seconds with retries disabled and use the existing failure message if it times out.

Vercel Hobby is currently a free plan for personal, non-commercial projects. With Fluid Compute, its current default and maximum function duration are 300 seconds; the Gemini SDK's 55-second client timeout keeps analysis failures responsive without relying on a per-function timeout setting the Express integration does not apply from this project's `vercel.json`. Revisit the hosting plan if the project becomes commercial. [Hobby plan](https://vercel.com/docs/plans/hobby), [function duration settings](https://vercel.com/docs/functions/configuring-functions/duration).

For the required recording, run the local app, submit a clearly fictional Nigerian-style scam, an international phishing example, and a legitimate control message, then show their result states and the reset. Never submit a real friend's message or personal/financial details. Deployment is useful for sharing, but the demo video and public GitHub repository are still separate required submission items.

## Look and Feel

Implements `prd.md > Look and Feel` and `prd.md > Screens and Layout`.

- One responsive, light-mode screen: warm off-white/light gray surface, navy primary controls, generous spacing, and a legible system sans-serif (Inter may be self-hosted if practical; otherwise use system fonts).
- Keep the opening state limited to the short headline, large paste box, visible Gemini data-use notice, and Analyze button. Show no result until analysis succeeds.
- Use a clearly labeled badge: Low is green, Medium amber, High red. Use matching category colors for evidence markers/highlights and keep a text label so color is never the only cue.
- Keep loading, empty, unsupported-language, and failure copy calm and direct. No gradients, mascots, or chat styling.

## Components

### Message Entry and Privacy Notice

Implements `prd.md > Screens and Layout`, `prd.md > Paste and analyze a message`, and `prd.md > States and Boundaries`.

The opening view owns the message textarea, visible notice, empty-input prompt, and Analyze button. The notice states that text is sent to Google's Gemini AI on the free tier, may be used to improve Google products, and may be processed by human reviewers. It says not to paste sensitive personal/financial information, real account numbers, or passwords. On submit, capture the exact text and make the box read-only until the request finishes.

The message entry also offers a **Paste from clipboard** button that uses the browser Clipboard API to fill the textarea. If clipboard access is unsupported or denied, show a small inline message and leave keyboard, context-menu, and long-press pasting available. Clipboard paste is optional convenience and does not replace manual paste.

### Analysis Request State

Implements `prd.md > Paste and analyze a message` and `prd.md > States and Boundaries`.

The page calls same-origin `POST /api/analyze`, changes the button to a disabled spinner plus **Analyzing...**, and preserves the submitted text. Empty input stays local and shows **Paste a message first** with focus returned to the box. On any failed request, restore the normal button and keep the message.

### Express Analyze Route

Implements `prd.md > Paste and analyze a message`, `prd.md > Show risk, evidence, and a recommendation`, and `prd.md > States and Boundaries`.

`POST /api/analyze` accepts `{ message: string }`. Express checks the shape and non-empty content, calls the Gemini service, validates the structured response and exact evidence, then returns only the fields the UI needs. It does not write the message, result, key, or raw model response to application logs or persistent storage. The Vite local proxy avoids separate-origin CORS setup.

### Gemini Analysis Service

Implements `prd.md > Paste and analyze a message`, `prd.md > Show risk, evidence, and a recommendation`, and `prd.md > States and Boundaries`.

The system instruction asks the model to detect supported language and meaningful context first. For non-English input it must return the unsupported-language status without scam classification; otherwise it returns one discrete risk category, specific verbatim, non-overlapping evidence excerpts with tactic names and plain-English explanations, and one non-empty practical recommendation even for Low. It asks the model to consider a broad range of relevant tactics—including authority impersonation, social proof, scarcity, reciprocity, and too-good-to-be-true offers—without forcing them into every result. Explanations connect the evidence to why the tactic may influence a reader, while avoiding unsupported claims. It emphasizes that Low means no common tactics detected, never proof of safety. The model response is constrained to the shared JSON schema; it does not receive prior interaction IDs or conversation history. Use `gemini-3.1-flash-lite` to stay within the learner's no-card budget requirement.

### Result and Evidence View

Implements `prd.md > Show risk, evidence, and a recommendation`.

Render the original message as read-only text. Use server-computed offsets to create inline highlights and connect each one to its corresponding named tactic/explanation by matching marker/color and adjacency. Render untrusted text as React text nodes (never as HTML). Show no number or gradient meter. A Low result with no evidence shows the approved no-common-tactics wording and a light independent-verification recommendation.

### Analyze Another Message

Implements `prd.md > Analyze another message`.

The reset control clears current input, result, and errors, returns to the opening view, and focuses the empty textarea. No result or text survives a page reload or navigation.

## Data Model

There is no database. The submitted text and result live only in React page memory and the current request. They are cleared by reset, reload, or leaving the page. The Express function handles data in memory during one request and must not write it to logs or files. Gemini's request uses `store: false`, which opts out of storing the interaction for retrieval; it does not opt out of free-tier content-use terms, hence the notice.

### Browser-to-server request

```ts
type AnalyzeRequest = { message: string };
```

### Internal model response

```ts
type ModelResponse = {
  status: "complete" | "unsupported_language" | "insufficient_context";
  riskLevel: "Low" | "Medium" | "High" | null;
  findings: Array<{
    excerpt: string;
    tactic: string;
    explanation: string;
  }>;
  recommendation: string | null;
};
```

For `unsupported_language` and `insufficient_context`, risk level and recommendation are null and findings are empty. For `complete`, all fields are present; a Low response may have zero findings, while Medium/High must have at least one. The server validates the JSON shape and every exact excerpt against the submitted string, rejects duplicates/overlapping ranges, and adds `{ start, end }` character offsets. If one excerpt is invalid, discard the entire result. The browser receives a discriminated response: `{ status: "complete", result: { riskLevel, findings: [{ excerpt, tactic, explanation, start, end }], recommendation } }` or `{ status: "unsupported_language" | "insufficient_context" | "analysis_failed" }`.

## File Structure

```text
ScamShield/
├── src/
│   ├── index.ts                  # Default-exported Express app; Vercel entry point
│   ├── dev.ts                    # Starts the same Express app for local development
│   ├── server/
│   │   ├── analyze-route.ts      # Request validation, orchestration, response mapping
│   │   ├── gemini.ts             # Gemini SDK client, prompt, and structured request
│   │   └── validate-analysis.ts  # Runtime schema and exact-excerpt/range validation
│   ├── shared/
│   │   └── analysis-types.ts     # Request/result types shared by client and server
│   └── client/
│       ├── main.tsx              # React entry point
│       ├── App.tsx               # Opening/result/error/loading state and reset
│       ├── styles.css            # Calm palette, responsive layout, accessible focus
│       └── components/
│           ├── MessageForm.tsx   # Text box, privacy notice, Analyze action
│           ├── RiskBadge.tsx     # Labeled discrete Low/Medium/High indicator
│           └── EvidenceView.tsx  # Inline phrase highlights and paired explanations
├── devpost/
│   ├── learner-profile.md        # Learner context for later curriculum skills
│   ├── scope.md                  # Approved project boundary
│   ├── prd.md                    # Approved product behavior
│   ├── demo-messages.md          # Fictional Nigeria, US/UK, and legitimate examples
│   └── spec.md                   # This technical blueprint
├── index.html                    # Vite page shell
├── vite.config.ts                # React plugin, /api proxy, output to public/
├── vercel.json                   # Express framework preset and build command
├── package.json                  # Scripts and runtime/development dependencies
├── package-lock.json             # Resolved dependency versions
├── tsconfig.json                 # TypeScript settings
├── .env.example                  # Placeholder variable names, no secrets
├── .gitignore                    # Excludes .env and generated files
└── README.md                     # Setup, local run, environment, and deployment steps
```

`public/` is generated by `npm run build` and ignored by Git if generated output is reproducible during Vercel builds. The source `publicDir` is disabled in Vite, avoiding a copy-into-itself build. The checked-in source tree remains the source of truth.

## External Services and Dependencies

### Gemini Interactions API

The backend uses `@google/genai` and `ai.interactions.create`, which calls `POST https://generativelanguage.googleapis.com/v1beta/interactions`. The SDK receives `GEMINI_API_KEY` from the server environment; REST authentication uses `x-goog-api-key`.

Request fields: `model: "gemini-3.1-flash-lite"`, `system_instruction` with the analysis instructions, `input` with only the submitted message, `store: false`, and `response_format` with `type: "text"`, `mime_type: "application/json"`, and the JSON schema for `ModelResponse`. Read `interaction.output_text`, parse JSON, then run explicit runtime shape checks and excerpt checks. Expected model shape is the `ModelResponse` above; the API returns an interaction with a completed status and model-output text step. No tools, search grounding, or multi-turn context are needed.

Gemini 3.1 Flash-Lite is currently listed as a stable model with structured-output support and a free standard API tier. It is supported by the Interactions API. Quotas remain project/model-specific and can change; inspect live limits in AI Studio before the demo. [Interactions API overview](https://ai.google.dev/gemini-api/docs/interactions-overview), [JavaScript setup and schema request examples](https://ai.google.dev/gemini-api/docs/get-started), [Gemini 3.1 Flash-Lite model details](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite), [pricing](https://ai.google.dev/gemini-api/docs/pricing), [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits).

**Data handling:** `store: false` prevents storing an interaction for later API retrieval; it is not a privacy guarantee. Under Google's unpaid-service terms, prompts and outputs may be used to improve products and may be reviewed by humans. The product notice must accurately disclose this, and users should not paste sensitive details. [Gemini API terms](https://ai.google.dev/gemini-api/terms).

### Vercel Hobby

One Vercel project serves the Vite build from `public/` and runs Express as a Node.js function. Put `GEMINI_API_KEY` in Vercel's sensitive server-side environment settings for Preview and Production; do not expose it through Vite variables. Vercel Express compiles the default-exported app as one function, so `vercel.json` uses the Express framework preset and build command rather than a per-file duration glob. `@google/genai` sets a 55-second request timeout with retries disabled; the app maps a timeout to its generic failure state. The Vercel Hobby Fluid Compute function ceiling is currently 300 seconds. For local development, use Vite and the Express dev process; Vercel also documents `vercel dev` for projects configured with the platform. Static files belong in `public/**`; `express.static()` is ignored. [Express on Vercel](https://vercel.com/docs/frameworks/backend/express), [Vercel environment variables](https://vercel.com/docs/environment-variables), [Vercel function duration settings](https://vercel.com/docs/functions/configuring-functions/duration).

## Important Failure Modes

- **Empty input** → handled in the page; show the calm inline prompt and focus the box. No API call.
- **Unsupported language or too little context** → return a typed non-result response; show the PRD's corresponding plain-English message, preserve the input, and show no badge or partial result.
- **Gemini timeout/quota/network failure, malformed JSON, or invalid evidence** → return `analysis_failed`; show the calm generic message, preserve the input, and show no partial result. Any Medium/High result with no valid evidence fails as a unit; Low can complete with no findings.
- **Gemini request reaches its 55-second client timeout** → the server returns `analysis_failed`; the page shows the generic failure message. Vercel may allow a longer function invocation, but the model request ends first.

## What Was Simplified and Why

- **One prompt and one model call per message** instead of a multi-agent or multi-step analysis pipeline — the POC only needs a clear result and a few exact supporting excerpts.
- **In-memory single-page state** instead of accounts, database, saved analyses, or history — matches the approved privacy and scope boundary.
- **Typed JSON plus exact string validation** instead of a custom scoring engine — preserves the AI's language reasoning while preventing fabricated excerpts from being highlighted.
- **Same-origin API** instead of separate frontend/backend hosts — one Vercel deployment and no CORS configuration.
- **No user rate-limit service or abuse dashboard** — extra infrastructure is outside this solo POC. The public anonymous endpoint can consume the free-tier quota; check quota availability before demonstrations and do not treat this as production abuse protection.

## Decisions and Open Issues

- **Learner choice — React + Express, one language, Vercel Hobby:** uses the learner's existing JS/TS skills and keeps the key on the server; accepted tradeoff is configuring a serverless deployment rather than using a traditional always-on Express host.
- **Learner choice — Vite output in Vercel `public/`:** Vercel serves static assets and runs the Express app from the same project; `express.static()` will not serve the frontend there.
- **Learner choice — Gemini 3.1 Flash-Lite, free tier, and Interactions API:** selected to honor the no-card budget requirement while retaining structured output and stateless requests. Google's free-tier data handling and variable quotas remain disclosed in the interface.
- **Learner choice — category-only badge:** labeled Low/Medium/High and color-coded, with no numeric or continuous intensity.
- **Learner choice — result as one validated unit:** any invalid excerpt rejects the full result; Medium/High require evidence, while Low may have none.
- **Resolved learning uncertainty:** a JSON schema controls response shape, but it cannot prove the text excerpt is real. Server-side substring checks and offset calculation make the evidence safe to render. During the build, confirm the current SDK's `output_text` field and `store: false` behavior with a fictional test input before wiring the UI.
- **Implementation details derived from the PRD:** same-origin `/api/analyze`, React memory-only state, no logging/persistence, runtime validation, and Vite proxy are implementation choices for the approved requirements.
- **Open issues:** none carried from `prd.md > Open Questions`. Verify current Node/package versions, model access, quota, and Vercel deployment behavior when the build begins.
