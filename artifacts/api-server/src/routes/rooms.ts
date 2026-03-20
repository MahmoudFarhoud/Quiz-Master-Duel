import { Router } from "express";
import { db } from "@workspace/db";
import { roomsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateRoomBody, JoinRoomParams, GetRoomParams } from "@workspace/api-zod";

const router = Router();

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function toRoomResponse(room: typeof roomsTable.$inferSelect) {
  const players = (room.players as any[]) ?? [];
  return {
    code: room.code,
    status: room.status,
    hostName: room.hostName,
    maxPlayers: room.maxPlayers,
    currentPlayerCount: players.length,
    questionCount: room.questionCount,
    customQuestions: (room.customQuestions as any[]) ?? [],
    createdAt: room.createdAt,
  };
}

router.post("/", async (req, res): Promise<void> => {
  try {
    const body = CreateRoomBody.parse(req.body);
    let code = generateCode();
    for (let i = 0; i < 10; i++) {
      const existing = await db.select().from(roomsTable).where(eq(roomsTable.code, code)).limit(1);
      if (existing.length === 0) break;
      code = generateCode();
    }
    const [room] = await db.insert(roomsTable).values({
      code,
      hostName: body.hostName,
      maxPlayers: body.maxPlayers ?? 2,
      questionCount: body.questionCount,
      customQuestions: body.customQuestions ?? [],
      players: [{ name: body.hostName, isHost: true }],
      status: "waiting",
    }).returning();
    res.json(toRoomResponse(room));
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Bad request" });
  }
});

router.get("/:code", async (req, res): Promise<void> => {
  try {
    const { code } = GetRoomParams.parse(req.params);
    const [room] = await db.select().from(roomsTable).where(eq(roomsTable.code, code)).limit(1);
    if (!room) {
      res.status(404).json({ error: "الغرفة مش موجودة" });
      return;
    }
    res.json(toRoomResponse(room));
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Bad request" });
  }
});

router.post("/:code/join", async (req, res): Promise<void> => {
  try {
    const { code } = JoinRoomParams.parse(req.params);
    const body = req.body as { guestName: string; playerId?: string };

    if (!body.guestName?.trim()) {
      res.status(400).json({ error: "الاسم مطلوب" });
      return;
    }

    const [room] = await db.select().from(roomsTable).where(eq(roomsTable.code, code)).limit(1);
    if (!room) {
      res.status(404).json({ error: "الغرفة مش موجودة" });
      return;
    }

    const players = (room.players as any[]) ?? [];

    if (players.length >= room.maxPlayers) {
      res.status(400).json({ error: "الغرفة ممتلية" });
      return;
    }
    if (room.status === "playing") {
      res.status(400).json({ error: "اللعبة بدأت بالفعل" });
      return;
    }

    const newPlayers = [...players, { name: body.guestName, isHost: false, playerId: body.playerId }];
    const newStatus = newPlayers.length >= room.maxPlayers ? "playing" : "waiting";

    const [updated] = await db.update(roomsTable)
      .set({ players: newPlayers, status: newStatus })
      .where(eq(roomsTable.code, code))
      .returning();

    res.json(toRoomResponse(updated));
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Bad request" });
  }
});

export default router;
