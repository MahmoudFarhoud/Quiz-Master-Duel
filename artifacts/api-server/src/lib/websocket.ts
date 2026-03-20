import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

interface GameClient {
  ws: WebSocket;
  roomCode: string;
  playerId: string;
  playerName: string;
  isHost: boolean;
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

function sendTo(playerId: string, roomCode: string, message: object) {
  const client = getRoomClients(roomCode).find(c => c.playerId === playerId);
  if (client && client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify(message));
  }
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/api/ws" });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const roomCode = url.searchParams.get("code") ?? "";
    const playerId = url.searchParams.get("playerId") ?? "";
    const playerName = url.searchParams.get("playerName") ?? "";
    const isHostParam = url.searchParams.get("isHost") === "true";

    if (!roomCode || !playerId) {
      ws.close(1008, "Missing code or playerId");
      return;
    }

    if (!clients.has(roomCode)) {
      clients.set(roomCode, []);
    }

    // Remove existing connection for same playerId (reconnect)
    const existing = clients.get(roomCode)!;
    const oldIdx = existing.findIndex(c => c.playerId === playerId);
    if (oldIdx !== -1) existing.splice(oldIdx, 1);

    const client: GameClient = { ws, roomCode, playerId, playerName, isHost: isHostParam };
    clients.get(roomCode)!.push(client);

    // Send the new joiner a snapshot of all current players
    const currentPlayers = getRoomClients(roomCode).map(c => ({
      id: c.playerId,
      name: c.playerName,
      isHost: c.isHost,
    }));
    ws.send(JSON.stringify({
      type: "room_state",
      players: currentPlayers,
      playerCount: currentPlayers.length,
    }));

    // Tell everyone else this player joined
    broadcast(roomCode, {
      type: "playerJoined",
      playerId,
      playerName,
      isHost: isHostParam,
      playerCount: getRoomClients(roomCode).length,
    }, playerId);

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        // Relay to all others (exclude sender)
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
