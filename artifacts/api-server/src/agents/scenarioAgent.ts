import { generateJSON } from "./gemini.js";

export interface SectorImpact {
  sector: string;
  change: number;
  direction: "up" | "down" | "neutral";
}

export interface ImpactedCompany {
  name: string;
  symbol: string;
  impact: number;
  direction: "up" | "down" | "neutral";
  reason: string;
}

export interface ScenarioAnalysis {
  scenario: string;
  niftyImpact: number;
  sectorImpacts: SectorImpact[];
  impactedCompanies: ImpactedCompany[];
  portfolioImpact: number;
  actionableInsights: string[];
  explanation: string;
  confidence: number;
  timeframe: string;
}

export async function runScenario(
  query: string,
  portfolio: unknown[] = []
): Promise<ScenarioAnalysis> {
  const portfolioContext =
    portfolio.length > 0
      ? `User portfolio: ${JSON.stringify(portfolio)}`
      : "No portfolio provided";

  const prompt = `You are an expert financial scenario analyst for Indian markets. Simulate this what-if scenario.

Scenario: "${query}"
${portfolioContext}

Return ONLY valid JSON (no markdown):
{
  "scenario": "concise scenario description",
  "niftyImpact": number (% change in Nifty50, negative = decline),
  "sectorImpacts": [
    {"sector": "Banking", "change": -2.5, "direction": "down"},
    {"sector": "IT", "change": 1.2, "direction": "up"}
  ],
  "impactedCompanies": [
    {"name": "Reliance Industries", "symbol": "RELIANCE", "impact": -8.5, "direction": "down", "reason": "brief reason"},
    {"name": "HDFC Bank", "symbol": "HDFCBANK", "impact": -3.2, "direction": "down", "reason": "brief reason"}
  ],
  "portfolioImpact": number (% change, 0 if no portfolio),
  "actionableInsights": ["insight1", "insight2", "insight3"],
  "explanation": "plain English explanation for a beginner",
  "confidence": 0-100,
  "timeframe": "short-term (1-3 months) / medium-term (3-12 months) / etc"
}

Be realistic with Indian market context. Include 3-5 sector impacts and 4-6 companies.`;

  return generateJSON<ScenarioAnalysis>(prompt);
}
