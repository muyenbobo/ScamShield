---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Analyze a pasted message with verified evidence**
  Becomes usable: A local ScamShield page accepts a pasted English message, sends it through Express to Gemini 3.1 Flash-Lite, validates the structured response and exact quoted evidence, and displays a labeled risk category, connected highlights/explanations, and a recommendation.
  Why now: This is the unique kernel from `scope.md`; the first slice includes project setup and proves the full AI-to-highlight path before investing in edge-case polish.
  PRD ref: `prd.md > The Core Journey` (steps 1-4), `prd.md > Paste and analyze a message`, `prd.md > Show risk, evidence, and a recommendation`
  Spec ref: `spec.md > Components > Message Entry and Privacy Notice`, `spec.md > Components > Express Analyze Route`, `spec.md > Components > Gemini Analysis Service`, `spec.md > Components > Result and Evidence View`, `spec.md > Data Model`, `spec.md > File Structure`, `spec.md > External Services and Dependencies > Gemini Interactions API`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Scaffold the Vite/React/TypeScript and Express app, install and lock dependencies, configure the local Vite-to-Express API proxy and Vercel entry, add the privacy notice and paste form, call Gemini with `store: false` and schema-constrained output, validate response shape and exact/non-overlapping excerpts on the server, compute offsets, and render the badge, evidence pairs, and recommendation. Low risk must already say no common tactics were detected, never that a message is safe. Use the calm navy/off-white palette from the start. Keep the API key server-side and do not add persistence.
  Verify (mechanical): Run `npm run build`. With the local server running and the learner's Gemini key configured only in `.env`, POST a fictional English message to `/api/analyze`; confirm the response has one allowed category, recommendation, and only exact non-overlapping excerpts that occur in the submitted message. No test framework is added.
  Learner check: Open `http://localhost:5173`, paste a clearly fictional scam message, analyze it, and see whether the risk badge and each highlighted phrase connect clearly to its explanation and recommendation.
  Commit: `Build ScamShield analysis core`

- [x] **2. Complete the states, reset, and responsive experience**
  Becomes usable: Empty input, loading, unsupported language, insufficient context, provider failures, Low risk, and reset all behave honestly; the same experience remains readable on mobile and desktop.
  Why now: Once the core analysis is real, these behaviors protect users from misleading partial results and make the flow dependable without introducing new product surfaces.
  PRD ref: `prd.md > States and Boundaries`, `prd.md > Analyze another message`, `prd.md > Look and Feel`, `prd.md > Screens and Layout`, `prd.md > Show risk, evidence, and a recommendation`
  Spec ref: `spec.md > Components > Analysis Request State`, `spec.md > Components > Analyze Another Message`, `spec.md > Data Model`, `spec.md > Important Failure Modes`, `spec.md > Look and Feel`
  Build: Add calm empty-input feedback and focus handling; lock the input/button during requests; map unsupported language, insufficient context, and failed requests to distinct non-result states; preserve text on recoverable failures; enforce Low wording and reminder; implement reset and focus; finish responsive layout, accessible labels/focus, and color contrast. Never display partial results on failure.
  Verify (mechanical): Run `npm run build`; use the local app to exercise empty submit, English analysis, a non-English message, a very short message, and reset. Confirm no badge appears for unsupported/failure responses, text is preserved where required, and reset clears and focuses the box.
  Learner check: Try the error and reset cases in the browser, then resize to a narrow phone width. Note whether the text, highlights, labels, and explanations remain easy to follow.
  Commit: `Finish ScamShield states and responsive UI`

- [ ] **3. Prepare Vercel runtime and demo assets (live deployment paused)**
  Status: Runtime configuration, deployment notes, and demo samples are complete, and local mechanical checks pass. Live deployment and URL verification are deferred; they do not block local review or video/submission preparation.
  Local verification (2026-09-29): `npm run build` passed; the local root page loaded; malformed and empty JSON requests returned 400; a fictional bank-alert message returned a validated High result with exact excerpts; French and very short messages returned `unsupported_language` and `insufficient_context`. Live Vercel verification remains pending.
  Becomes usable: ScamShield builds locally with the static frontend and Express analysis function configured for a later one-URL Vercel deployment, and its fictional demo inputs are ready.
  Why now: Prepare the hosting path after the complete local flow works; live deployment can wait while the local review and submission materials are completed.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Paste and analyze a message`, `prd.md > Screens and Layout`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It > Vercel Hobby deployment`, `spec.md > External Services and Dependencies > Vercel Hobby`, `spec.md > Important Failure Modes`, `spec.md > File Structure`
  Build: Write `devpost/demo-messages.md` with clearly fictional Nigeria-grounded and US/UK-style scam messages plus a legitimate control (these are manual demo inputs, never a fixed in-app list). Configure Vite output under `public/`, disable Vite's source `publicDir`, set a 55-second Gemini request timeout with retries disabled, verify `.env` and generated files are ignored, and document Vercel setup with `GEMINI_API_KEY` only as a sensitive server environment variable. Do not put the key in the repository or frontend build. Leave the live deployment paused.
  Verify (mechanical): Local verification passed on 2026-09-29: `npm run build`, `/` page load, invalid-body rejection, fictional scam analysis, unsupported-language response, and insufficient-context response. When deployment resumes, run `npx vercel dev`; confirm the static page loads and `/api/analyze` is reachable, then submit a fictional/anonymized English message and confirm a validated result from the live URL.
  Learner check: Open `http://localhost:5173` in a fresh browser tab, try the fictional scam and legitimate-control messages, check **Analyze another message**, and resize to a narrow phone width. Live URL review remains deferred until deployment resumes.
  Commit: `Support ScamShield on Vercel`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after Slice 1, inspect the real analysis and give feedback on the evidence-to-explanation pairing before edge-case polish.
- [ ] Final kick-the-tires exploration and feedback completed — explore the local app while deployment is paused; after deployment resumes, review the deployed app and report anything broken, confusing, or worth changing.

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [complete after build]
Route and stops: [complete after build]
Edit outcome: [complete after build]
Reflection: [complete after build]
Activity mode: [complete after build]

## Revisions

- 2026-09-30: Reframed Slice 3 as locally verified Vercel preparation; live deployment and URL checks remain deferred and do not block local review or submission preparation.
- 2026-09-29: Broadened Gemini prompt guidance to consider more manipulation tactics and explain their psychological effect, without changing the response schema, validation, or result UI.
- 2026-09-29: Added an optional Clipboard API paste button with a graceful inline fallback; manual paste remains available.
- 2026-09-29 local checks: production build passed; browser checks covered clipboard success, denied/unsupported fallback, and manual entry; fictional scam messages returned authority impersonation, social proof, scarcity, reciprocity, and too-good-to-be-true findings with recommendations; the legitimate control returned Low with no findings and a recommendation. Initial control/evidence failures led to clearer prompt requirements for complete-result recommendations and exact non-overlapping excerpts; retries passed. Schema, validation code, and existing result UI remain unchanged.
