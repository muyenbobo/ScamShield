---
doc: prd
status: approved
---

# ScamShield — Product Requirements

One line: ScamShield helps people who are unsure about a persuasive, unexpected message understand its risk, the tactics in its wording, and what to do next.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey

1. The user opens ScamShield and sees a short explanation, an empty message box, and an **Analyze** button. No results or sample messages are shown.
2. The user pastes an English text message, email, or DM and selects **Analyze**.
3. While the message is being analyzed, the button shows a spinner and **Analyzing…**, and is disabled. The submitted message cannot be edited until analysis finishes.
4. If analysis succeeds, the page shows a color-coded **Low**, **Medium**, or **High** risk category, the original message with relevant phrases highlighted, explanations connected to those phrases, and one recommendation.
5. The user can select **Analyze another message** to clear the message and result and return to the opening state, with the message box ready for new input.

Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`, `scope.md > The POC Boundary`.

## Screens and Layout

ScamShield is one responsive screen with an opening state and an analysis-result state, not separate pages.

- **Opening state:** a short, clear headline; one large text box; and a visible **Analyze** button. The paste box is the focus. There is no sign-up, navigation menu, example result, or other section.
- **Data-use notice:** before submission, show a calm, visible notice that the message is sent to Google's Gemini API on the free tier, may be used to improve Google's products, and may be processed by human reviewers. Tell users not to paste sensitive personal or financial details.
- **Result state:** at the top, the risk category; then the submitted message in read-only form with relevant phrases highlighted and their explanations visibly associated; then one recommendation at the bottom. On wider screens, the message and explanations may sit side by side; on narrower screens, they stack.
- **Reset action:** **Analyze another message** is visible with the result. Selecting it clears the result and input and returns focus to the empty text box in the opening state.

Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`, `scope.md > Explicitly Cut`.

## Look and Feel

- Calm, clean, unambiguous, and serious but approachable, like a security or banking diagnostic tool rather than an AI chat product.
- Deep blue or navy primary color; off-white or light-gray background; light-mode appearance by default.
- Use green for Low, amber/yellow for Medium, and red for High. Keep the meaning of these colors consistent between the risk indicator and highlighted phrases; include text labels so color is not the only signal.
- Use a highly legible sans-serif such as Inter or a system font, generous spacing, and larger-than-default text for quick reading.
- Avoid purple or gradient AI styling, decorative fonts, mascots, and playful illustrations.
- Keep the risk indicator discrete: its category and color communicate the result, without a numeric score or a finer-grained intensity signal.

Source: `scope.md > The Unique Kernel`, `scope.md > The POC Boundary`.

## Features and Behavior

### Paste and analyze a message

The user can paste English text from an SMS, email, or DM into the single text box and start analysis. ScamShield analyzes the submitted text rather than requiring selection from a built-in example list.

- The message box accepts pasted text. Image or screenshot input is not supported.
- Before submission, display the data-use notice described under `prd.md > Screens and Layout`. Do not imply the message is only processed for this analysis or is not retained by the provider.
- Selecting **Analyze** starts one analysis for the current text.
- While analysis is in progress, show a spinner and **Analyzing…** on the disabled button. Keep the submitted text read-only so the result corresponds to what was submitted and prevent overlapping submissions.
- Do not show a risk result until analysis has completed successfully.

Source: `scope.md > The Core Loop`, `scope.md > The POC Boundary`, `scope.md > Explicitly Cut`.

### Show risk, evidence, and a recommendation

For a completed analysis, show one of three labeled categories: **Low risk**, **Medium risk**, or **High risk**. Use the matching green, amber/yellow, or red treatment. Do not display a numeric score or imply precision within a category.

Redisplay the submitted message as read-only text. Highlight the specific phrases that support the assessment and pair each highlight with a brief, plain-English explanation naming the tactic. The relationship between phrase and explanation must be clear through adjacency or matching colors/markers, not a disconnected generic warning list. Relevant tactics may include false urgency, authority impersonation, unrealistic offers, and suspicious links.

Show one clear recommendation sentence at the bottom of the result. The recommendation should fit the assessment and offer a practical next step.

For **Low risk**, use language such as **“No common scam tactics were detected in this message.”** Do not call the message safe or verified. Include a sensible reminder to verify unexpected requests independently or trust and check any remaining concern.

Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`, `scope.md > The POC Boundary`.

### Analyze another message

The result state provides an **Analyze another message** or **Start over** action. Selecting it clears the current risk category, highlights, explanations, recommendation, and pasted text. Return to the opening state and focus the empty text box. Analyses are standalone; there is no saved or recoverable history.

Source: `scope.md > The Core Loop`, `scope.md > Explicitly Cut`.

## States and Boundaries

- **First use / empty input:** show the headline, empty text box, and **Analyze** button. If Analyze is selected with an empty box, do not start analysis; show a calm inline prompt such as **“Paste a message first”** near the box and keep focus in the box. Do not use harsh error styling.
- **Analyzing:** show the spinner and **Analyzing…** button label; disable the button and make the submitted text read-only. A subtle loading indicator near the result area and a short note that analysis usually takes a few seconds may be used. No risk category or partial result is shown.
- **Analysis completed:** show the risk category, evidence highlights and explanations, and one recommendation.
- **Analysis failed or too little context:** show a calm, non-technical message such as **“We couldn't analyze that message. Please try again, or paste a bit more context if it's very short.”** Stay on the same screen, preserve the pasted text, show no risk category or partial result, and return the button to its normal clickable state.
- **Non-English input:** do not attempt an analysis or show a risk result. Explain the English-only limit, for example: **“ScamShield currently only analyzes messages in English. Please paste an English message, or translate this one first.”** Keep the pasted text, stay on the same screen, and return the button to its normal clickable state.
- **No saved history:** starting another analysis clears the previous result and message. Nothing is saved or recoverable.

Source: `scope.md > The POC Boundary`, `scope.md > Explicitly Cut`.

## Product Decisions

- Analyze arbitrary user-pasted messages rather than only curated examples; the examples are for demonstration and checking behavior.
- POC input and output are English-only; multi-language support is later work.
- The risk result is a labeled, color-coded badge for Low / Medium / High. No numeric score, meter, or within-category intensity is shown, to avoid implying unsupported precision.
- A Low result means no common scam tactics were detected, not that a message is safe or verified.
- Each result is a standalone moment. No account, saved history, or persistent results are included.
- The first screen stays focused on paste-and-analyze, with no sign-up, navigation, or example results.
- A visible notice explains Gemini free-tier data handling before anyone submits a message; demo and test submissions use already-public scam content or fictional/anonymized messages.

## What We're Building

- One responsive paste-and-analyze screen with an opening state and result state.
- AI-assisted analysis of arbitrary English text messages, emails, or DMs.
- A color-coded Low / Medium / High result; highlighted evidence phrases; connected, plain-English tactic explanations; and one practical recommendation.
- Calm empty-input, analysis-in-progress, analysis-failure, and unsupported-language behavior that preserves the submitted text where applicable and never presents a partial risk result.
- A way to clear the current analysis and return to the opening state.
- Demo and check the product with a Nigerian-style scam message, a US/UK-style phishing message, and a legitimate message expected to receive Low risk.
- Show the data-use notice before submission and use already-public, fictional, or anonymized demo messages.

Source: `scope.md > What "Working" Looks Like`, `scope.md > The POC Boundary`.

## Deferred From the POC

- Non-English input and explanations: the POC demonstrates the approach in English; validating tactic detection and translating the experience across languages expands the work.
- Broader scam coverage and stronger reliability: the POC aims to be useful on varied messages but does not promise to catch every scam.

## Possible Later Enhancements

Support additional languages after the English experience is established and can be evaluated in those languages. Expand scam coverage and reliability based on further evaluation.

## Non-Goals

- Image or screenshot upload; this POC accepts pasted text only.
- Email inbox or browser integration; the user pastes the message themselves.
- User accounts, saved or persistent history, or recovery of prior results.
- Voice or call-based scam detection; this POC analyzes text.
- Reporting to authorities through an integration; reporting is outside the analysis experience.
- Guaranteed detection of every scam or proof that a message is legitimate; the tool reports detected patterns, not verified truth or authenticity.
- A detector limited to a fixed collection of built-in examples.

Source: `scope.md > Explicitly Cut`, `scope.md > The POC Boundary`.

## Open Questions

None. The risk indicator is a labeled, color-coded badge for Low / Medium / High.
