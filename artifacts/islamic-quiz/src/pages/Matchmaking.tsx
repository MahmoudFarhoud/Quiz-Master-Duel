import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { ArrowRight, Loader2, X, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameStore, PLAYER_COLORS, OnlinePlayer } from "@/lib/store";
import { useWebSocket } from "@/hooks/use-websocket";
import { Question, quizQuestions } from "@/data/questions";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Matchmaking() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<"idle" | "searching" | "found">("idle");
  const [matchedRoom, setMatchedRoom] = useState<string | null>(null);
  const [amHost, setAmHost] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myId = useRef("mm_" + Date.now());
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);
  const initOnline = useGameStore(s => s.initOnline);

  const { on, emit, connected } = useWebSocket(matchedRoom, myId.current, name);

  // Poll until matched
  useEffect(() => {
    if (phase !== "searching") return;

    const poll = async () => {
      try {
        const res = await fetch("/api/matchmaking/queue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerName: name, playerId: myId.current }),
        });
        const data = await res.json();
        if (data.status === "matched" && data.roomCode) {
          if (pollRef.current) clearInterval(pollRef.current);
          setMatchedRoom(data.roomCode);
          setAmHost(data.isHost === true);
          setPhase("found");
        }
      } catch {
        setError("حدث خطأ في الاتصال");
        setPhase("idle");
      }
    };

    poll();
    pollRef.current = setInterval(poll, 2000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [phase]);

  // Once matched and connected to WebSocket:
  // - If amHost: generate questions and send game_started
  // - If not host: listen for game_started
  useEffect(() => {
    if (!matchedRoom || !connected) return;
    if (startedRef.current) return;

    if (amHost) {
      startedRef.current = true;
      // Small delay so the other player's WebSocket can connect
      const timer = setTimeout(() => {
        const players: OnlinePlayer[] = [
          { id: myId.current, name, score: 0, color: PLAYER_COLORS[0], finished: false },
          // Opponent will be added via playerJoined but we just init with us for now
        ];

        // Listen for opponent's playerJoined to add them
        on("playerJoined", (msg) => {
          // Will be handled in store via addOnlinePlayer
          players.push({ id: msg.playerId, name: msg.playerName, score: 0, color: PLAYER_COLORS[1], finished: false });
        });

        const questions: Question[] = shuffle([...quizQuestions]).slice(0, 10);
        const finalPlayers: OnlinePlayer[] = [
          { id: myId.current, name, score: 0, color: PLAYER_COLORS[0], finished: false },
          { id: "opponent", name: "منافس", score: 0, color: PLAYER_COLORS[1], finished: false },
        ];

        emit({ type: "game_started", questions, players: finalPlayers });

        initOnline({
          roomCode: matchedRoom,
          isHost: true,
          myPlayerId: myId.current,
          myPlayerName: name,
          players: finalPlayers,
          questions,
        });
        setLocation("/game");
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      on("game_started", (msg) => {
        if (startedRef.current) return;
        startedRef.current = true;
        const players: OnlinePlayer[] = msg.players ?? [];
        const questions: Question[] = msg.questions ?? [];

        const updatedPlayers = players.map((p: OnlinePlayer) =>
          p.id === myId.current ? { ...p, name } : p
        );

        initOnline({
          roomCode: matchedRoom,
          isHost: false,
          myPlayerId: myId.current,
          myPlayerName: name,
          players: updatedPlayers,
          questions,
        });
        setLocation("/game");
      });
      return undefined;
    }
  }, [matchedRoom, connected, amHost]);

  const handleSearch = () => {
    if (!name.trim()) return;
    setError(null);
    startedRef.current = false;
    setPhase("searching");
  };

  const handleCancel = async () => {
    if (pollRef.current) clearInterval(pollRef.current);
    try {
      await fetch(`/api/matchmaking/queue/${myId.current}`, { method: "DELETE" });
    } catch { }
    setPhase("idle");
    setMatchedRoom(null);
    startedRef.current = false;
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col max-w-xl mx-auto">
      <div className="flex items-center mb-8 pt-4">
        <Link href="/online" className="p-3 bg-card border rounded-2xl hover:bg-muted transition-colors mr-auto">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-primary flex-1 text-center ml-12">بحث عشوائي 1v1</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-3xl p-8 border shadow-sm">
        {phase === "idle" && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="text-6xl mb-4">⚔️</div>
              <h2 className="text-xl font-bold mb-2">تحدّ منافس عشوائي</h2>
              <p className="text-muted-foreground text-sm">سيتم مطابقتك مع لاعب آخر يبحث الآن</p>
            </div>
            <div>
              <label className="block font-bold mb-2">اسمك</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="أدخل اسمك..." />
            </div>
            {error && <div className="bg-destructive/10 text-destructive rounded-xl p-3 text-sm text-center">{error}</div>}
            <Button className="w-full h-14 text-lg" onClick={handleSearch} disabled={!name.trim()}>
              <Swords className="w-5 h-5 ml-2" />
              ابحث عن منافس
            </Button>
          </div>
        )}

        {phase === "searching" && (
          <div className="text-center py-8 space-y-8">
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping" style={{ animationDuration: "2s" }} />
              <div className="absolute inset-3 border-4 border-primary/30 rounded-full animate-pulse" />
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">جاري البحث...</h2>
              <p className="text-muted-foreground">مرحباً <span className="text-primary font-bold">{name}</span>! ننتظر منافسك</p>
              <p className="text-xs text-muted-foreground mt-1">سيبدأ التحدي تلقائياً فور العثور على منافس</p>
            </div>
            <Button variant="outline" className="w-full" onClick={handleCancel}>
              <X className="w-4 h-4 ml-2" /> إلغاء البحث
            </Button>
          </div>
        )}

        {phase === "found" && (
          <div className="text-center py-8 space-y-6">
            <div className="text-6xl mb-2">🎯</div>
            <h2 className="text-2xl font-bold text-green-600">تم العثور على منافس!</h2>
            {amHost
              ? <p className="text-muted-foreground">جاري تحضير اللعبة...</p>
              : <p className="text-muted-foreground">ينتظر بدء اللعبة...</p>
            }
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
