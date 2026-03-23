// Shared Types mirroring the OpenAPI schema

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface PortfolioStock {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice?: number;
  allocation?: number;
}

export interface UserProfile {
  id: number;
  userId: number;
  riskLevel: "low" | "medium" | "high";
  investmentGoal?: string;
  portfolio: PortfolioStock[];
  totalInvested?: number;
  updatedAt?: string;
}

export interface AffectedSector {
  name: string;
  impact: "positive" | "negative" | "neutral";
  magnitude: number;
}

export interface NewsAnalysisResult {
  id?: number;
  keyEvent: string;
  eventType: string;
  affectedSectors: AffectedSector[];
  sentiment: "bullish" | "bearish" | "neutral";
  sentimentScore: number;
  marketImpact: string;
  summary: string;
  riskWarnings?: string[];
  confidence: number;
  createdAt?: string;
}

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

export interface ScenarioResult {
  id?: number;
  scenario: string;
  niftyImpact: number;
  sectorImpacts: SectorImpact[];
  impactedCompanies: ImpactedCompany[];
  portfolioImpact?: number;
  actionableInsights: string[];
  explanation: string;
  confidence: number;
  timeframe?: string;
  createdAt?: string;
}

export interface DecisionResult {
  id?: number;
  stock: string;
  recommendation: "buy" | "hold" | "avoid";
  confidence: number;
  riskLevel: "low" | "medium" | "high";
  targetPrice?: number;
  stopLoss?: number;
  timeHorizon?: string;
  reasons: string[];
  explanation: string;
  warnings?: string[];
  createdAt?: string;
}

export interface SimulationDataPoint {
  year: number;
  investedValue: number;
  notInvestedValue: number;
}

export interface SimulationResult {
  id?: number;
  stock: string;
  initialAmount: number;
  projectedValue: number;
  notInvestedValue: number;
  annualReturn: number;
  totalReturn: number;
  dataPoints: SimulationDataPoint[];
  assumptions: string[];
  explanation: string;
  createdAt?: string;
}

export interface HistoryItem {
  id: number;
  type: "news" | "scenario" | "decision" | "simulation";
  query: string;
  result?: any;
  createdAt: string;
}
