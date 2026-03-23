import { generateJSON } from "./gemini.js";

export interface AffectedSector {
  name: string;
  impact: "positive" | "negative" | "neutral";
  magnitude: number;
}

export interface NewsAnalysis {
  keyEvent: string;
  eventType: string;
  affectedSectors: AffectedSector[];
  sentiment: "bullish" | "bearish" | "neutral";
  sentimentScore: number;
  marketImpact: string;
  summary: string;
  riskWarnings: string[];
  confidence: number;
}

export async function analyzeNews(newsText: string): Promise<NewsAnalysis> {
  const prompt = `You are an expert financial analyst. Analyze this financial news and return structured JSON.

News: "${newsText}"

Return ONLY valid JSON (no markdown) with this exact structure:
{
  "keyEvent": "brief title of the key event",
  "eventType": "one of: rate_change|merger|earnings|regulatory|macro|sector|commodity|currency|ipo|default",
  "affectedSectors": [
    {"name": "sector name", "impact": "positive|negative|neutral", "magnitude": 0-100}
  ],
  "sentiment": "bullish|bearish|neutral",
  "sentimentScore": -100 to 100 (negative = bearish, positive = bullish),
  "marketImpact": "detailed description of expected market impact",
  "summary": "2-3 sentence summary for a beginner investor",
  "riskWarnings": ["warning1", "warning2"],
  "confidence": 0-100
}

Be realistic and specific to Indian markets (NSE/BSE). Include 3-5 affected sectors.`;

  return generateJSON<NewsAnalysis>(prompt);
}
