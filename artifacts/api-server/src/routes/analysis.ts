import { Router, type IRouter } from "express";
import { db, profilesTable, analysisHistoryTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../middlewares/auth.js";
import { analyzeNews } from "../agents/newsAgent.js";
import { runScenario } from "../agents/scenarioAgent.js";
import { getDecision } from "../agents/decisionAgent.js";
import { runSimulation } from "../agents/simulationAgent.js";

const router: IRouter = Router();

async function getUserProfile(userId?: number) {
  if (!userId) return null;
  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, userId))
    .limit(1);
  return profile ?? null;
}

async function saveHistory(userId: number | undefined, type: string, query: string, result: unknown) {
  if (!userId) return;
  await db.insert(analysisHistoryTable).values({
    userId,
    type,
    query,
    result: result as Record<string, unknown>,
  });
}

router.post("/analyze-news", async (req: AuthRequest, res) => {
  const { newsText, userId } = req.body;
  if (!newsText) {
    res.status(400).json({ error: "ValidationError", message: "newsText is required" });
    return;
  }

  const result = await analyzeNews(newsText);
  const uid = req.userId ?? userId;
  await saveHistory(uid, "news", newsText.substring(0, 200), result);

  res.json({
    id: Date.now(),
    ...result,
    createdAt: new Date().toISOString(),
  });
});

router.post("/scenario", async (req: AuthRequest, res) => {
  const { query, userId } = req.body;
  if (!query) {
    res.status(400).json({ error: "ValidationError", message: "query is required" });
    return;
  }

  const uid = req.userId ?? userId;
  const profile = await getUserProfile(uid);
  const portfolio = (profile?.portfolio as unknown[]) ?? [];

  const result = await runScenario(query, portfolio);
  await saveHistory(uid, "scenario", query, result);

  res.json({
    id: Date.now(),
    ...result,
    createdAt: new Date().toISOString(),
  });
});

router.post("/decision", async (req: AuthRequest, res) => {
  const { stockSymbol, newsContext, userId } = req.body;
  if (!stockSymbol) {
    res.status(400).json({ error: "ValidationError", message: "stockSymbol is required" });
    return;
  }

  const uid = req.userId ?? userId;
  const profile = await getUserProfile(uid);
  const riskLevel = profile?.riskLevel ?? "medium";

  const result = await getDecision(stockSymbol, newsContext, riskLevel);
  await saveHistory(uid, "decision", stockSymbol, result);

  res.json({
    id: Date.now(),
    ...result,
    createdAt: new Date().toISOString(),
  });
});

router.post("/simulate", async (req: AuthRequest, res) => {
  const { stockSymbol, amount, years, userId } = req.body;
  if (!stockSymbol || !amount || !years) {
    res.status(400).json({ error: "ValidationError", message: "stockSymbol, amount, and years are required" });
    return;
  }

  const uid = req.userId ?? userId;
  const result = await runSimulation(stockSymbol, Number(amount), Number(years));
  await saveHistory(uid, "simulation", `${stockSymbol} - ₹${amount} for ${years}y`, result);

  res.json({
    id: Date.now(),
    ...result,
    createdAt: new Date().toISOString(),
  });
});

router.get("/history", async (req: AuthRequest, res) => {
  const uid = req.userId;
  if (!uid) {
    res.json({ items: [] });
    return;
  }

  const items = await db
    .select()
    .from(analysisHistoryTable)
    .where(eq(analysisHistoryTable.userId, uid))
    .orderBy(analysisHistoryTable.createdAt);

  res.json({
    items: items.reverse().slice(0, 50).map((item) => ({
      id: item.id,
      type: item.type,
      query: item.query,
      result: item.result,
      createdAt: item.createdAt,
    })),
  });
});

export default router;
