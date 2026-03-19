import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { roomsTable } from "@workspace/db";
import { JoinMatchmakingBody, LeaveMatchmakingParams } from "@workspace/api-zod";

const router: IRouter = Router();

interface QueueEntry {
  playerId: string;
  playerName: string;
  joinedAt: number;
}

const matchmakingQueue: QueueEntry[] = [];

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

router.post("/queue", async (req, res) => {
  try {
    const body = JoinMatchmakingBody.parse(req.body);
    const existingIdx = matchmakingQueue.findIndex(q => q.playerId === body.playerId);
    if (existingIdx !== -1) {
      matchmakingQueue.splice(existingIdx, 1);
    }
    if (matchmakingQueue.length > 0) {
      const opponent = matchmakingQueue.shift()!;
      const code = generateCode();
      await db.insert(roomsTable).values({
        code,
        hostName: opponent.playerName,
        guestName: body.playerName,
        questionCount: 10,
        customQuestions: [],
        status: "playing",
      });
      return res.json({
        status: "matched",
        roomCode: code,
        playerId: body.playerId,
      });
    }
    matchmakingQueue.push({
      playerId: body.playerId,
      playerName: body.playerName,
      joinedAt: Date.now(),
    });
    res.json({
      status: "queued",
      roomCode: null,
      playerId: body.playerId,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Bad request" });
  }
});

router.delete("/queue/:playerId", (req, res) => {
  try {
    const { playerId } = LeaveMatchmakingParams.parse(req.params);
    const idx = matchmakingQueue.findIndex(q => q.playerId === playerId);
    if (idx !== -1) {
      matchmakingQueue.splice(idx, 1);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Bad request" });
  }
});

export default router;
