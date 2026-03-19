import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { roomsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { JoinMatchmakingBody, LeaveMatchmakingParams } from "@workspace/api-zod";

const router: IRouter = Router();

interface QueueEntry {
  playerId: string;
  playerName: string;
  joinedAt: number;
}

interface MatchResult {
  roomCode: string;
  isHost: boolean;
  assignedAt: number;
}

const matchmakingQueue: QueueEntry[] = [];
const matchResults = new Map<string, MatchResult>();

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function cleanOldResults() {
  const cutoff = Date.now() - 5 * 60 * 1000;
  for (const [id, result] of matchResults.entries()) {
    if (result.assignedAt < cutoff) matchResults.delete(id);
  }
}

router.post("/queue", async (req, res) => {
  try {
    cleanOldResults();
    const body = JoinMatchmakingBody.parse(req.body);

    // Already matched?
    if (matchResults.has(body.playerId)) {
      const result = matchResults.get(body.playerId)!;
      return res.json({
        status: "matched",
        roomCode: result.roomCode,
        isHost: result.isHost,
        playerId: body.playerId,
      });
    }

    // Already in queue (re-poll)
    const existingIdx = matchmakingQueue.findIndex(q => q.playerId === body.playerId);
    if (existingIdx !== -1) {
      return res.json({ status: "queued", roomCode: null, playerId: body.playerId });
    }

    // Try to match
    if (matchmakingQueue.length > 0) {
      const opponent = matchmakingQueue.shift()!;
      if (opponent.playerId === body.playerId) {
        matchmakingQueue.unshift(opponent);
        matchmakingQueue.push({ playerId: body.playerId, playerName: body.playerName, joinedAt: Date.now() });
        return res.json({ status: "queued", roomCode: null, playerId: body.playerId });
      }

      let code = generateCode();
      for (let i = 0; i < 10; i++) {
        const existing = await db.select().from(roomsTable).where(eq(roomsTable.code, code)).limit(1);
        if (existing.length === 0) break;
        code = generateCode();
      }

      await db.insert(roomsTable).values({
        code,
        hostName: opponent.playerName,
        maxPlayers: 2,
        questionCount: 10,
        customQuestions: [],
        players: [
          { name: opponent.playerName, playerId: opponent.playerId },
          { name: body.playerName, playerId: body.playerId },
        ],
        status: "playing",
      });

      // body (second player) is isHost (generates and starts the game)
      matchResults.set(opponent.playerId, { roomCode: code, isHost: false, assignedAt: Date.now() });
      matchResults.set(body.playerId, { roomCode: code, isHost: true, assignedAt: Date.now() });

      return res.json({
        status: "matched",
        roomCode: code,
        isHost: true,
        playerId: body.playerId,
      });
    }

    matchmakingQueue.push({ playerId: body.playerId, playerName: body.playerName, joinedAt: Date.now() });
    res.json({ status: "queued", roomCode: null, playerId: body.playerId });
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Bad request" });
  }
});

router.delete("/queue/:playerId", (req, res) => {
  try {
    const { playerId } = LeaveMatchmakingParams.parse(req.params);
    const idx = matchmakingQueue.findIndex(q => q.playerId === playerId);
    if (idx !== -1) matchmakingQueue.splice(idx, 1);
    matchResults.delete(playerId);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Bad request" });
  }
});

export default router;
