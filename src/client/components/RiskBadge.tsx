import type { RiskLevel } from "../../shared/analysis-types";

type RiskBadgeProps = { riskLevel: RiskLevel };

export default function RiskBadge({ riskLevel }: RiskBadgeProps) {
  return <span className={`risk-badge risk-${riskLevel.toLowerCase()}`}>{riskLevel} risk</span>;
}
