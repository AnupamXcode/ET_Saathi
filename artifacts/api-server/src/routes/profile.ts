import { Router, type IRouter } from "express";
import { db, profilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../middlewares/auth.js";

const router: IRouter = Router();

router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res) => {
  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, req.userId!))
    .limit(1);

  if (!profile) {
    res.status(404).json({ error: "NotFound", message: "Profile not found" });
    return;
  }

  res.json({
    id: profile.id,
    userId: profile.userId,
    riskLevel: profile.riskLevel,
    investmentGoal: profile.investmentGoal,
    portfolio: profile.portfolio ?? [],
    totalInvested: profile.totalInvested,
    updatedAt: profile.updatedAt,
  });
});

router.put("/", async (req: AuthRequest, res) => {
  const { riskLevel, investmentGoal, portfolio } = req.body;

  const [updated] = await db
    .update(profilesTable)
    .set({
      ...(riskLevel !== undefined && { riskLevel }),
      ...(investmentGoal !== undefined && { investmentGoal }),
      ...(portfolio !== undefined && { portfolio }),
      updatedAt: new Date(),
    })
    .where(eq(profilesTable.userId, req.userId!))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "NotFound", message: "Profile not found" });
    return;
  }

  res.json({
    id: updated.id,
    userId: updated.userId,
    riskLevel: updated.riskLevel,
    investmentGoal: updated.investmentGoal,
    portfolio: updated.portfolio ?? [],
    totalInvested: updated.totalInvested,
    updatedAt: updated.updatedAt,
  });
});

export default router;
