import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

interface GameClient {
  ws: WebSocket;
  roomCode: string;
  playerId: string;
  playerName: string;
}

const clients = new Map<string, GameClient[]>();

function getRoomClients(roomCode: string): GameClient[] {
  return clients.get(roomCode) ?? [];
}

function broadcast(roomCode: string, message: object, excludePlayerId?: string) {
  const roomClients = getRoomClients(roomCode);
  const data = JSON.stringify(message);
  for (const client of roomClients) {
    if (excludePlayerId && client.playerId === excludePlayerId) continue;
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(data);
    }
  }
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/api/ws" });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const roomCode = url.searchParams.get("code") ?? "";
    const playerId = url.searchParams.get("playerId") ?? "";
    const playerName = url.searchParams.get("playerName") ?? "";

    if (!roomCode || !playerId) {
      ws.close(1008, "Missing code or playerId");
      return;
    }

    const client: GameClient = { ws, roomCode, playerId, playerName };

    if (!clients.has(roomCode)) {
      clients.set(roomCode, []);
    }
    clients.get(roomCode)!.push(client);

    broadcast(roomCode, {
      type: "playerJoined",
      playerId,
      playerName,
      playerCount: getRoomClients(roomCode).length,
    }, playerId);

    ws.send(JSON.stringify({
      type: "connected",
      roomCode,
      playerId,
      playerCount: getRoomClients(roomCode).length,
    }));

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        broadcast(roomCode, { ...msg, fromPlayerId: playerId }, playerId);
      } catch {
        // ignore malformed messages
      }
    });

    ws.on("close", () => {
      const roomClients = clients.get(roomCode);
      if (roomClients) {
        const idx = roomClients.findIndex(c => c.playerId === playerId);
        if (idx !== -1) roomClients.splice(idx, 1);
        if (roomClients.length === 0) {
          clients.delete(roomCode);
        } else {
          broadcast(roomCode, {
            type: "playerLeft",
            playerId,
            playerName,
            playerCount: roomClients.length,
          });
        }
      }
    });
  });

  return wss;
}
