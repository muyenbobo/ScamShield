import { useState, type FormEvent } from "react";

type MessageFormProps = {
  message: string;
  isAnalyzing: boolean;
  feedback: { kind: "prompt" | "error"; message: string } | null;
  onMessageChange: (message: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function MessageForm({ message, isAnalyzing, feedback, onMessageChange, onSubmit }: MessageFormProps) {
  const [clipboardFeedback, setClipboardFeedback] = useState<string | null>(null);

  async function pasteFromClipboard() {
    setClipboardFeedback(null);
    try {
      if (!navigator.clipboard?.readText) throw new Error("Clipboard access is unavailable.");
      const clipboardText = await navigator.clipboard.readText();
      onMessageChange(clipboardText);
    } catch {
      setClipboardFeedback("Couldn't access clipboard — please paste manually.");
    }
  }

  return (
    <form className="message-form" onSubmit={onSubmit} aria-busy={isAnalyzing}>
      <div className="field-header">
        <label className="field-label" htmlFor="message-input">
          Suspicious message
        </label>
        <button className="clipboard-button" type="button" onClick={pasteFromClipboard} disabled={isAnalyzing}>
          Paste from clipboard
        </button>
      </div>
      <textarea
        id="message-input"
        name="message"
        rows={9}
        maxLength={20_000}
        placeholder="Paste the text of an email, SMS, or DM here…"
        value={message}
        readOnly={isAnalyzing}
        onChange={(event) => {
          setClipboardFeedback(null);
          onMessageChange(event.target.value);
        }}
        aria-describedby={[
          "privacy-note",
          feedback ? `${feedback.kind}-feedback` : null,
          clipboardFeedback ? "clipboard-feedback" : null,
        ].filter(Boolean).join(" ")}
      />
      {clipboardFeedback && (
        <p className="inline-message" id="clipboard-feedback" role="status">
          {clipboardFeedback}
        </p>
      )}

      {feedback && (
        <p
          className={`inline-message ${feedback.kind === "error" ? "inline-error" : ""}`}
          id={`${feedback.kind}-feedback`}
          role={feedback.kind === "prompt" ? "status" : "alert"}
        >
          {feedback.message}
        </p>
      )}
      <p className="privacy-note" id="privacy-note">
        Your message is sent to Google’s Gemini AI for analysis. On the free tier, it may be used to improve Google
        products and may be reviewed by people. Please don’t include sensitive personal or financial details, account
        numbers, or passwords.
      </p>
      <button className="primary-button" type="submit" disabled={isAnalyzing}>
        {isAnalyzing ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Analyzing…
          </>
        ) : (
          "Analyze"
        )}
      </button>
    </form>
  );
}
