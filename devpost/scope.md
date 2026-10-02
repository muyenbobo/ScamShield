---
doc: scope
status: approved
---

# ScamShield

One line: ScamShield helps people make sense of suspicious messages by showing their risk and explaining the tactics in the text.

## The Unique Kernel
ScamShield highlights the specific words or phrases that make a message suspicious, names the manipulation tactics in plain English, and suggests what to do next. Its AI analysis should work on messages people paste in, rather than depending on a fixed set of known scam examples.

## Who It's For
Someone who receives a persuasive, unexpected message and feels unsure whether to trust it or how to explain what seems off. For example, the learner's friend received an email from a supposed US widow offering $18.5 million for charity funds. Today, a recipient may pause and second-guess themselves without being able to identify the tactics.

## The Core Loop
The user pastes a suspicious text, email, or DM. ScamShield returns a risk level, highlights and explains tactics visible in the message, and gives one clear recommendation for what to do next.

## Inspiration & Identity
No specific product or visual reference established. The tone and visual direction remain open for the PRD.

## Why This Matters to the Learner
The learner is based in Nigeria and wants to show that ScamShield can recognize tactics across regions, including Nigerian bank alert and NIN/BVN-style examples and US/UK-style phishing. They also want to build a reliable habit of planning with an AI agent before coding.

## What "Working" Looks Like
In a short demo, ScamShield analyzes a user-pasted scam message and shows high risk with highlighted, plain-English tactic explanations and a next-step recommendation; analyzes a legitimate message and shows low risk; and handles examples representing Nigerian and US/UK scam patterns. These examples demonstrate the behavior but do not limit what users can paste.

## The POC Boundary
- Accept a message pasted by the user, rather than only offering preloaded examples.
- Use an AI model to reason about message language and structure, including tactics such as false urgency, authority claims, unrealistic offers, and suspicious links.
- Return a risk assessment, tactic highlights with plain-English explanations, and a one-line recommendation.
- Demonstrate the result with Nigerian-style and US/UK-style scam messages plus a legitimate control message.
- Show a clear notice before submission explaining that messages are sent to Google's AI on the free tier, may be used to improve Google's products, and may be processed by human reviewers; tell people not to paste sensitive personal or financial details.
- Use already-public scam content or fictional/anonymized messages for demo and testing; do not submit sensitive real messages.
- Aim for useful analysis of varied messages; the proof does not need to catch every scam or be bulletproof.

## Later
Broader scam coverage and stronger reliability beyond what the proof of concept can demonstrate.

Browser extension or email/SMS client integration, so analysis can happen where someone actually receives a message rather than requiring them to already suspect it and paste it into a separate tool. This POC validates the core detection and explanation approach; point-of-receipt integration is the natural next step for real-world adoption.

## Explicitly Cut
- Detection guaranteed to catch every scam: the learner said the first version need not be bulletproof, and universal coverage is beyond this proof of concept.
- A detector limited to matching a fixed set of curated examples: it would not prove the core use case of analyzing real messages people paste in.
- Image or screenshot upload; the proof of concept accepts pasted text only.
- Email inbox or browser integration; users provide the message themselves.
- User accounts or saved, persistent history; the proof of concept analyzes messages without storing a personal history.
- Voice or call-based scam detection; the proof of concept focuses on text messages.
- Reporting scams to authorities through an integration; reporting is outside the core analysis experience.
