import { useState, useRef, useEffect, useCallback } from "react";

export type WsMessage = { type: string; [key: string]: any };

const getWsUrl = (code: string, playerId: string, playerName: string) => {
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  return `${proto}//${host}/ws?code=${encodeURIComponent(code)}&playerId=${encodeURIComponent(playerId)}&playerName=${encodeURIComponent(playerName)}`;
};

export function useWebSocket(
  roomCode: string | null | undefined,
  playerId: string | null | undefined,
  playerName: string | null | undefined
) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Map<string, (data: WsMessage) => void>>(new Map());
  const pendingRef = useRef<WsMessage[]>([]);

  useEffect(() => {
    if (!roomCode || !playerId || !playerName) return;

    const url = getWsUrl(roomCode, playerId, playerName);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      // Flush pending messages
      for (const msg of pendingRef.current) {
        ws.send(JSON.stringify(msg));
      }
      pendingRef.current = [];
    };

    ws.onmessage = (evt) => {
      try {
        const msg: WsMessage = JSON.parse(evt.data);
        const handler = handlersRef.current.get(msg.type);
        if (handler) handler(msg);
        // Also fire the wildcard handler
        const wildcard = handlersRef.current.get("*");
        if (wildcard) wildcard(msg);
      } catch {
        // ignore
      }
    };

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;
    };

    ws.onerror = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
      wsRef.current = null;
      setConnected(false);
    };
  }, [roomCode, playerId, playerName]);

  const emit = useCallback((msg: WsMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      pendingRef.current.push(msg);
    }
  }, []);

  const on = useCallback((event: string, handler: (data: WsMessage) => void) => {
    handlersRef.current.set(event, handler);
    return () => handlersRef.current.delete(event);
  }, []);

  const off = useCallback((event: string) => {
    handlersRef.current.delete(event);
  }, []);

  return { emit, on, off, connected };
}
