import { useState, useRef, useEffect } from "react";

// Mock WebSocket hook since the backend implementation doesn't exist yet
// but UI expects it for online modes.
export function useWebSocket(roomCode?: string | null, playerId?: string) {
  const [connected, setConnected] = useState(false);
  const handlers = useRef<Map<string, (data: any) => void>>(new Map());

  useEffect(() => {
    if (!roomCode || !playerId) return;

    // Simulate connection delay
    const timer = setTimeout(() => {
      setConnected(true);
      console.log(`[WS] Connected to room ${roomCode} as ${playerId}`);
    }, 500);

    return () => {
      clearTimeout(timer);
      setConnected(false);
    };
  }, [roomCode, playerId]);

  const emit = (event: string, data: any) => {
    console.log(`[WS] Emitting ${event}`, data);
    // In a real app, this would send via ws.current.send()
  };

  const on = (event: string, handler: (data: any) => void) => {
    handlers.current.set(event, handler);
  };

  return { emit, on, connected };
}
