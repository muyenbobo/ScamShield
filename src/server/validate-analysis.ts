import type { AnalysisResult, Finding, ModelResponse, RiskLevel } from "../shared/analysis-types";

const riskLevels = new Set<RiskLevel>(["Low", "Medium", "High"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isModelResponse(value: unknown): value is ModelResponse {
  if (!isRecord(value)) return false;

  const status = value.status;
  if (!["complete", "unsupported_language", "insufficient_context"].includes(String(status))) return false;
  if (!(value.riskLevel === null || (typeof value.riskLevel === "string" && riskLevels.has(value.riskLevel as RiskLevel)))) return false;
  if (!Array.isArray(value.findings)) return false;
  if (!(value.recommendation === null || typeof value.recommendation === "string")) return false;

  return value.findings.every(
    (finding) =>
      isRecord(finding) &&
      typeof finding.excerpt === "string" &&
      typeof finding.tactic === "string" &&
      typeof finding.explanation === "string",
  );
}

export function parseModelResponse(text: string): ModelResponse {
  const parsed: unknown = JSON.parse(text);
  if (!isModelResponse(parsed)) throw new Error("Gemini returned an invalid response shape.");

  if (parsed.status !== "complete") {
    if (parsed.riskLevel !== null || parsed.findings.length > 0 || parsed.recommendation !== null) {
      throw new Error("Gemini returned partial analysis for a non-result status.");
    }
    return parsed;
  }

  if (!parsed.riskLevel || !parsed.recommendation?.trim()) {
    throw new Error("Gemini omitted required analysis fields.");
  }
  if ((parsed.riskLevel === "Medium" || parsed.riskLevel === "High") && parsed.findings.length === 0) {
    throw new Error("A Medium or High result needs evidence.");
  }
  if (
    parsed.findings.some(
      (finding) => !finding.excerpt.trim() || !finding.tactic.trim() || !finding.explanation.trim(),
    )
  ) {
    throw new Error("Gemini returned an incomplete evidence item.");
  }

  return parsed;
}

export function validateAndLocateFindings(message: string, findings: ModelResponse["findings"]): Finding[] {
  const located = findings.map((finding) => {
    const start = message.indexOf(finding.excerpt);
    if (start < 0) throw new Error("Gemini quoted text that is not in the submitted message.");
    return { ...finding, start, end: start + finding.excerpt.length };
  });

  located.sort((left, right) => left.start - right.start);
  for (let index = 1; index < located.length; index += 1) {
    if (located[index].start < located[index - 1].end) {
      throw new Error("Gemini returned duplicate or overlapping evidence excerpts.");
    }
  }

  return located;
}

export function toAnalysisResult(modelResponse: ModelResponse, message: string): AnalysisResult {
  if (modelResponse.status !== "complete" || !modelResponse.riskLevel || !modelResponse.recommendation) {
    throw new Error("Cannot create a result from an incomplete response.");
  }

  const findings = validateAndLocateFindings(message, modelResponse.findings);
  return {
    riskLevel: modelResponse.riskLevel,
    findings,
    recommendation:
      modelResponse.riskLevel === "Low"
        ? "Still, verify unexpected requests through an official channel before acting."
        : modelResponse.recommendation,
  };
}
