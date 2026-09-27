import type { AnalysisResult } from "../../shared/analysis-types";

type EvidenceViewProps = {
  message: string;
  result: AnalysisResult;
};

export default function EvidenceView({ message, result }: EvidenceViewProps) {
  const chunks: Array<{ text: string; findingIndex?: number }> = [];
  let cursor = 0;

  result.findings.forEach((finding, findingIndex) => {
    if (finding.start < cursor || message.slice(finding.start, finding.end) !== finding.excerpt) return;
    if (finding.start > cursor) chunks.push({ text: message.slice(cursor, finding.start) });
    chunks.push({ text: finding.excerpt, findingIndex });
    cursor = finding.end;
  });
  if (cursor < message.length) chunks.push({ text: message.slice(cursor) });

  return (
    <div className="evidence-layout">
      <div className="submitted-message" aria-label="Analyzed message">
        {chunks.map((chunk, index) =>
          chunk.findingIndex === undefined ? (
            <span key={`text-${index}`}>{chunk.text}</span>
          ) : (
            <mark className={`evidence-mark mark-${result.riskLevel.toLowerCase()}`} key={`mark-${index}`}>
              <span className="evidence-number">{chunk.findingIndex + 1}</span> {chunk.text}
            </mark>
          ),
        )}
      </div>

      {result.findings.length > 0 && (
        <ol className="finding-list" aria-label="Detected tactics">
          {result.findings.map((finding, index) => (
            <li className={`finding finding-${result.riskLevel.toLowerCase()}`} key={`${finding.start}-${finding.end}`}>
              <span className="finding-number" aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <strong>{finding.tactic}</strong>
                <p>{finding.explanation}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
