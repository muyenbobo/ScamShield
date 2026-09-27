import type { FormEvent } from "react";

type MessageFormProps = {
  message: string;
  isAnalyzing: boolean;
  feedback: { kind: "prompt" | "error"; message: string } | null;
  onMessageChange: (message: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function MessageForm({ message, isAnalyzing, feedback, onMessageChange, onSubmit }: MessageFormProps) {
  return (
    <form className="message-form" onSubmit={onSubmit} aria-busy={isAnalyzing}>
      <label className="field-label" htmlFor="message-input">
        Suspicious message
      </label>
      <textarea
        id="message-input"
        name="message"
        rows={9}
        maxLength={20_000}
        placeholder="Paste the text of an email, SMS, or DM here…"
        value={message}
        readOnly={isAnalyzing}
        onChange={(event) => onMessageChange(event.target.value)}
        aria-describedby={feedback ? `privacy-note ${feedback.kind}-feedback` : "privacy-note"}
      />
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
