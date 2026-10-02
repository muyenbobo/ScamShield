import { useState, type FormEvent } from "react";
import type { AnalysisResult, AnalyzeResponse } from "../shared/analysis-types";
import EvidenceView from "./components/EvidenceView";
import MessageForm from "./components/MessageForm";
import RiskBadge from "./components/RiskBadge";

export default function App() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "prompt" | "error"; message: string } | null>(null);
  const [showIntroAnimation, setShowIntroAnimation] = useState(true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) {
      setFeedback({ kind: "prompt", message: "Paste a message first." });
      document.querySelector<HTMLTextAreaElement>("#message-input")?.focus();
      return;
    }

    setFeedback(null);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const payload = (await response.json()) as AnalyzeResponse;

      if (payload.status === "unsupported_language") {
        setFeedback({
          kind: "error",
          message: "ScamShield currently only analyzes messages in English. Please paste an English message, or translate this one first.",
        });
        return;
      }
      if (payload.status === "insufficient_context") {
        setFeedback({
          kind: "error",
          message: "We couldn't analyze that message. Please try again, or paste a bit more context if it's very short.",
        });
        return;
      }
      if (!response.ok || payload.status !== "complete") {
        throw new Error("Analysis did not complete.");
      }
      setResult(payload.result);
    } catch {
      setFeedback({
        kind: "error",
        message: "We couldn't analyze that message. Please try again, or paste a bit more context if it's very short.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  function startOver() {
    setMessage("");
    setResult(null);
    setFeedback(null);
    requestAnimationFrame(() => document.querySelector<HTMLTextAreaElement>("#message-input")?.focus());
  }

  return (
    <main className="page-shell">
      <section className="scamshield-card" aria-labelledby="page-title">
        {!result && (
          <>
            <div
              className={showIntroAnimation ? "opening-content opening-content-enter" : "opening-content"}
              onAnimationEnd={() => setShowIntroAnimation(false)}
            >
              <h1 id="page-title">Paste a suspicious message. We’ll tell you what’s really going on.</h1>
              <p className="trust-note">Powered by AI pattern analysis — not a lookup list.</p>
              <MessageForm
                message={message}
                isAnalyzing={isAnalyzing}
                feedback={feedback}
                onMessageChange={(nextMessage) => {
                  setMessage(nextMessage);
                  if (feedback) setFeedback(null);
                }}
                onSubmit={handleSubmit}
              />
            </div>
          </>
        )}

        {isAnalyzing && (
          <p className="loading-note" role="status">
            Your message is being checked. This usually takes a few seconds.
          </p>
        )}

        {result && (
          <section className="result-panel result-panel-enter" aria-live="polite" aria-labelledby="result-title">
            <div className="result-heading">
              <div>
                <p className="eyebrow">Analysis complete</p>
                <h2 id="result-title">What we noticed</h2>
              </div>
              <RiskBadge riskLevel={result.riskLevel} />
            </div>

            {result.riskLevel === "Low" && result.findings.length === 0 && (
              <p className="low-summary">No common scam tactics were detected in this message.</p>
            )}

            <EvidenceView message={message} result={result} />

            <div className="recommendation">
              <span className="recommendation-label">What to do next</span>
              <p>{result.recommendation}</p>
            </div>
            <p className="result-caveat">This analysis can miss scams and cannot verify who sent a message.</p>
            <button className="secondary-button" type="button" onClick={startOver}>
              Analyze another message
            </button>
          </section>
        )}

      </section>
    </main>
  );
}
