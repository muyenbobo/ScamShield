export type RiskLevel = "Low" | "Medium" | "High";

export type AnalyzeRequest = {
  message: string;
};

export type Finding = {
  excerpt: string;
  tactic: string;
  explanation: string;
  start: number;
  end: number;
};

export type AnalysisResult = {
  riskLevel: RiskLevel;
  findings: Finding[];
  recommendation: string;
};

export type AnalyzeResponse =
  | { status: "complete"; result: AnalysisResult }
  | { status: "unsupported_language" | "insufficient_context" | "analysis_failed" };

export type ModelResponse = {
  status: "complete" | "unsupported_language" | "insufficient_context";
  riskLevel: RiskLevel | null;
  findings: Array<{
    excerpt: string;
    tactic: string;
    explanation: string;
  }>;
  recommendation: string | null;
};
