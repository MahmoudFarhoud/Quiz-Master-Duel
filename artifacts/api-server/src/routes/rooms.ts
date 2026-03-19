import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { roomsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateRoomBody, JoinRoomBody, JoinRoomParams, GetRoomParams } from "@workspace/api-zod";

const router: IRouter = Router();

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

router.post("/", async (req, res) => {
  try {
    const body = CreateRoomBody.parse(req.body);
    let code = generateCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await db.select().from(roomsTable).where(eq(roomsTable.code, code)).limit(1);
      if (existing.length === 0) break;
      code = generateCode();
      attempts++;
    }
    const [room] = await db.insert(roomsTable).values({
      code,
      hostName: body.hostName,
      questionCount: body.questionCount,
      customQuestions: body.customQuestions ?? [],
      status: "waiting",
    }).returning();
    res.json({
      code: room.code,
      status: room.status,
      hostName: room.hostName,
      guestName: room.guestName ?? null,
      questionCount: room.questionCount,
      customQuestions: (room.customQuestions as any[]) ?? [],
      createdAt: room.createdAt,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Bad request" });
  }
});

router.get("/:code", async (req, res) => {
  try {
    const { code } = GetRoomParams.parse(req.params);
    const [room] = await db.select().from(roomsTable).where(eq(roomsTable.code, code)).limit(1);
    if (!room) {
      return res.status(404).json({ error: "الغرفة مش موجودة" });
    }
    res.json({
      code: room.code,
      status: room.status,
      hostName: room.hostName,
      guestName: room.guestName ?? null,
      questionCount: room.questionCount,
      customQuestions: (room.customQuestions as any[]) ?? [],
      createdAt: room.createdAt,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Bad request" });
  }
});

router.post("/:code/join", async (req, res) => {
  try {
    const { code } = JoinRoomParams.parse(req.params);
    const body = JoinRoomBody.parse(req.body);
    const [room] = await db.select().from(roomsTable).where(eq(roomsTable.code, code)).limit(1);
    if (!room) {
      return res.status(404).json({ error: "الغرفة مش موجودة" });
    }
    if (room.guestName) {
      return res.status(400).json({ error: "الغرفة ممتلية" });
    }
    const [updated] = await db.update(roomsTable)
      .set({ guestName: body.guestName, status: "playing" })
      .where(eq(roomsTable.code, code))
      .returning();
    res.json({
      code: updated.code,
      status: updated.status,
      hostName: updated.hostName,
      guestName: updated.guestName ?? null,
      questionCount: updated.questionCount,
      customQuestions: (updated.customQuestions as any[]) ?? [],
      createdAt: updated.createdAt,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Bad request" });
  }
});

export default router;
