import { generateJSON } from "./gemini.js";

export interface SimulationDataPoint {
  year: number;
  investedValue: number;
  notInvestedValue: number;
}

export interface SimulationAnalysis {
  stock: string;
  initialAmount: number;
  projectedValue: number;
  notInvestedValue: number;
  annualReturn: number;
  totalReturn: number;
  dataPoints: SimulationDataPoint[];
  assumptions: string[];
  explanation: string;
}

export async function runSimulation(
  stockSymbol: string,
  amount: number,
  years: number
): Promise<SimulationAnalysis> {
  const prompt = `You are a financial simulator. Calculate realistic investment projections for Indian markets.

Stock: ${stockSymbol}
Investment Amount: ₹${amount}
Time Period: ${years} years

Return ONLY valid JSON (no markdown):
{
  "stock": "${stockSymbol}",
  "initialAmount": ${amount},
  "projectedValue": realistic projected value after ${years} years,
  "notInvestedValue": value if kept in savings account (assume 4% savings rate),
  "annualReturn": estimated annual return % (realistic for this stock),
  "totalReturn": total return % over ${years} years,
  "dataPoints": [
    {"year": 0, "investedValue": ${amount}, "notInvestedValue": ${amount}},
    // one entry per year up to year ${years}
  ],
  "assumptions": ["assumption1", "assumption2", "assumption3"],
  "explanation": "simple explanation a beginner can understand"
}

Use realistic historical return estimates for Indian stocks. 
Include appropriate disclaimers.
Generate data points for each year from 0 to ${years}.`;

  return generateJSON<SimulationAnalysis>(prompt);
}
