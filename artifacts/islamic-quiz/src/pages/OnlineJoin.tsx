import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { ArrowRight, Loader2, LogIn, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJoinRoom } from "@workspace/api-client-react";
import { useGameStore, PLAYER_COLORS, OnlinePlayer } from "@/lib/store";

const AVATAR_COLORS = ['#3b82f6','#f97316','#10b981','#a855f7','#ef4444','#06b6d4','#ec4899','#eab308'];
import { useWebSocket } from "@/hooks/use-websocket";
import { Question } from "@/data/questions";

export default function OnlineJoin() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [joinedRoom, setJoinedRoom] = useState<{ code: string; hostName: string; maxPlayers: number } | null>(null);
  const [lobbyPlayers, setLobbyPlayers] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const myId = useRef("guest_" + Date.now());
  const joinMutation = useJoinRoom();
  const initOnline = useGameStore(s => s.initOnline);

  const { emit, on, connected } = useWebSocket(
    joinedRoom?.code ?? null,
    myId.current,
    name
  );

  useEffect(() => {
    if (!joinedRoom) return;

    // Add myself to lobby
    setLobbyPlayers([{ id: myId.current, name }]);

    on("playerJoined", (msg) => {
      setLobbyPlayers(prev => {
        if (prev.find(p => p.id === msg.playerId)) return prev;
        return [...prev, { id: msg.playerId, name: msg.playerName }];
      });
    });

    on("game_started", (msg) => {
      const players: OnlinePlayer[] = msg.players ?? [];
      const questions: Question[] = msg.questions ?? [];
      initOnline({
        roomCode: joinedRoom.code,
        isHost: false,
        myPlayerId: myId.current,
        myPlayerName: name,
        players,
        questions,
      });
      setLocation("/game");
    });
  }, [joinedRoom]);

  const handleJoin = () => {
    if (!name.trim() || !code.trim()) return;
    setError(null);
    joinMutation.mutate(
      { code: code.trim(), data: { guestName: name, playerId: myId.current } },
      {
        onSuccess: (data) => {
          setJoinedRoom({ code: data.code, hostName: data.hostName, maxPlayers: data.maxPlayers });
        },
        onError: (err: any) => {
          setError(err?.response?.data?.error ?? "كود الغرفة غير صحيح أو الغرفة ممتلئة");
        }
      }
    );
  };

  // In lobby — waiting for host to start
  if (joinedRoom) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col max-w-xl mx-auto">
        <div className="flex items-center mb-8 pt-4">
          <h1 className="text-2xl font-bold text-primary w-full text-center">انتظار بدء اللعبة</h1>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-card rounded-3xl p-6 border shadow-sm text-center">
            <div className="text-4xl mb-3">🎮</div>
            <h2 className="text-xl font-bold mb-1">انضممت للغرفة!</h2>
            <p className="text-muted-foreground">كود الغرفة: <span className="font-black text-primary text-xl tracking-widest">{joinedRoom.code}</span></p>
          </div>

          <div className="bg-card rounded-3xl p-6 border shadow-sm">
            <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" /> اللاعبون في الغرفة
            </h2>
            <div className="space-y-2">
              {lobbyPlayers.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 bg-muted rounded-xl p-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-${PLAYER_COLORS[i % PLAYER_COLORS.length]}-500`}>
                    {p.name[0]}
                  </div>
                  <span className="font-medium">{p.name}</span>
                  {p.id === myId.current && <span className="mr-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">أنت</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>في انتظار المضيف ليبدأ اللعبة...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col max-w-xl mx-auto">
      <div className="flex items-center mb-8 pt-4">
        <Link href="/online" className="p-3 bg-card border rounded-2xl hover:bg-muted transition-colors mr-auto">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-primary flex-1 text-center ml-12">الانضمام لغرفة</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-3xl p-8 border shadow-sm space-y-6">
        <div>
          <label className="block font-bold mb-2">اسمك</label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="أدخل اسمك..." />
        </div>
        <div>
          <label className="block font-bold mb-2">كود الغرفة</label>
          <Input
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="0000"
            className="text-center text-3xl tracking-[0.5em] font-black h-16"
            maxLength={4}
            inputMode="numeric"
          />
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive rounded-xl p-3 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <Button
          className="w-full h-14 text-lg"
          onClick={handleJoin}
          disabled={joinMutation.isPending || !name.trim() || code.length < 4}
        >
          {joinMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <><LogIn className="w-5 h-5 ml-2" /> دخول الغرفة</>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
