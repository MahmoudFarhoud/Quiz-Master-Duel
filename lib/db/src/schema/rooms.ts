import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const roomsTable = pgTable("rooms", {
  code: text("code").primaryKey(),
  status: text("status").notNull().default("waiting"),
  hostName: text("host_name").notNull(),
  guestName: text("guest_name"),
  questionCount: integer("question_count").notNull().default(10),
  customQuestions: jsonb("custom_questions").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRoomSchema = createInsertSchema(roomsTable).omit({ createdAt: true });
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof roomsTable.$inferSelect;
