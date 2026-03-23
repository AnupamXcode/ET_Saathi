import { pgTable, serial, integer, text, json, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const analysisHistoryTable = pgTable("analysis_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id),
  type: varchar("type", { length: 50 }).notNull(),
  query: text("query").notNull(),
  result: json("result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalysisHistorySchema = createInsertSchema(analysisHistoryTable).omit({ id: true, createdAt: true });
export type InsertAnalysisHistory = z.infer<typeof insertAnalysisHistorySchema>;
export type AnalysisHistory = typeof analysisHistoryTable.$inferSelect;
