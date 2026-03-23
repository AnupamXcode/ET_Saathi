import { generateJSON } from "./gemini.js";

export interface DecisionAnalysis {
  stock: string;
  recommendation: "buy" | "hold" | "avoid";
  confidence: number;
  riskLevel: "low" | "medium" | "high";
  targetPrice: number;
  stopLoss: number;
  timeHorizon: string;
  reasons: string[];
  explanation: string;
  warnings: string[];
}

export async function getDecision(
  stockSymbol: string,
  newsContext = "",
  riskLevel = "medium"
): Promise<DecisionAnalysis> {
  const prompt = `You are an expert stock analyst for Indian markets. Provide an investment decision.

Stock: ${stockSymbol}
${newsContext ? `News Context: ${newsContext}` : ""}
User Risk Level: ${riskLevel}

Return ONLY valid JSON (no markdown):
{
  "stock": "${stockSymbol}",
  "recommendation": "buy|hold|avoid",
  "confidence": 0-100,
  "riskLevel": "low|medium|high",
  "targetPrice": realistic target price in INR (use realistic estimates for Indian stocks),
  "stopLoss": realistic stop loss price in INR,
  "timeHorizon": "e.g. 3-6 months",
  "reasons": ["reason1", "reason2", "reason3", "reason4"],
  "explanation": "simple 2-3 sentence explanation a beginner can understand",
  "warnings": ["warning1", "warning2"]
}

Be conservative and realistic. Never make exaggerated promises. Include risk disclaimers.`;

  return generateJSON<DecisionAnalysis>(prompt);
}
