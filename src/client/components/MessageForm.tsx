import type { FormEvent } from "react";

type MessageFormProps = {
  message: string;
  isAnalyzing: boolean;
  onMessageChange: (message: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function MessageForm({ message, isAnalyzing, onMessageChange, onSubmit }: MessageFormProps) {
  return (
    <form className="message-form" onSubmit={onSubmit}>
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
        aria-describedby="privacy-note"
      />
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
