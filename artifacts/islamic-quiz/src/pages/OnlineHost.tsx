import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";
import { ArrowRight, Loader2, Copy, CheckCircle, Users, Play, Plus, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateRoom } from "@workspace/api-client-react";
import { useGameStore, PLAYER_COLORS, OnlinePlayer } from "@/lib/store";
import { useWebSocket } from "@/hooks/use-websocket";
import { CustomQuestionModal } from "@/components/CustomQuestionModal";
import { Question, quizQuestions } from "@/data/questions";

const AVATAR_COLORS = ['#3b82f6','#f97316','#10b981','#a855f7','#ef4444','#06b6d4','#ec4899','#eab308'];
const COUNTS = [10, 20, 30, 40, 50];
const MAX_PLAYER_OPTIONS = [2, 3, 4, 5, 6, 7, 8];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function OnlineHost() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [count, setCount] = useState(10);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lobbyPlayers, setLobbyPlayers] = useState<{ id: string; name: string }[]>([]);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const myId = useRef("host_" + Date.now());
  const createMutation = useCreateRoom();
  const initOnline = useGameStore(s => s.initOnline);
  const { emit, on, connected } = useWebSocket(roomCode, myId.current, name);

  useEffect(() => {
    if (!roomCode) return;
    setLobbyPlayers([{ id: myId.current, name }]);

    on("playerJoined", (msg) => {
      setLobbyPlayers(prev => {
        if (prev.find(p => p.id === msg.playerId)) return prev;
        return [...prev, { id: msg.playerId, name: msg.playerName }];
      });
    });
    on("playerLeft", (msg) => {
      setLobbyPlayers(prev => prev.filter(p => p.id !== msg.playerId));
    });
  }, [roomCode]);

  const handleCreate = () => {
    if (!name.trim()) return;
    createMutation.mutate({ data: { hostName: name, questionCount: count, maxPlayers } }, {
      onSuccess: (data: any) => {
        setRoomCode(data.code);
      }
    });
  };

  const handleCopy = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleStart = () => {
    if (!roomCode || lobbyPlayers.length < 1) return;

    const pool = shuffle([...quizQuestions]);
    const qs: Question[] = shuffle([...customQuestions, ...pool.slice(0, Math.max(0, count - customQuestions.length))]);

    const players: OnlinePlayer[] = lobbyPlayers.map((p, i) => ({
      id: p.id,
      name: p.name,
      score: 0,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
      finished: false,
    }));

    emit({ type: "game_started", questions: qs, players });

    initOnline({
      roomCode,
      isHost: true,
      myPlayerId: myId.current,
      myPlayerName: name,
      players,
      questions: qs,
    });

    setLocation("/game");
  };

  if (!roomCode) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col max-w-xl mx-auto">
        <div className="flex items-center mb-8 pt-4">
          <Link href="/online" className="p-3 bg-card border rounded-2xl hover:bg-muted transition-colors mr-auto">
            <ArrowRight className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-primary flex-1 text-center ml-12">إنشاء غرفة</h1>
        </div>

        <CustomQuestionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={(q) => setCustomQuestions(prev => [...prev, q])} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-3xl p-8 border shadow-sm space-y-6">
          <div>
            <label className="block font-bold mb-2">اسمك</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="أدخل اسمك..." />
          </div>

          <div>
            <label className="block font-bold mb-3 flex items-center gap-2"><Users className="w-4 h-4" /> عدد اللاعبين المسموح (2-8)</label>
            <div className="grid grid-cols-7 gap-2">
              {MAX_PLAYER_OPTIONS.map(n => (
                <button
                  key={n}
                  onClick={() => setMaxPlayers(n)}
                  className={`h-10 rounded-xl font-bold text-sm transition-all ${maxPlayers === n ? 'bg-primary text-primary-foreground scale-105' : 'bg-muted hover:bg-primary/10'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold mb-3">عدد الأسئلة</label>
            <div className="grid grid-cols-5 gap-2">
              {COUNTS.map(n => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`h-10 rounded-xl font-bold transition-all ${count === n ? 'bg-primary text-primary-foreground scale-105' : 'bg-muted hover:bg-primary/10'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {customQuestions.length > 0 && (
            <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-between">
              <span className="flex items-center gap-2 text-primary font-bold"><List className="w-4 h-4" /> أسئلة مخصصة</span>
              <span className="bg-primary text-white px-3 py-0.5 rounded-full text-sm font-bold">{customQuestions.length}</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 ml-1" /> أضف سؤال
            </Button>
            <Button className="flex-1 h-12" onClick={handleCreate} disabled={createMutation.isPending || !name.trim()}>
              {createMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "إنشاء الغرفة"}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col max-w-xl mx-auto">
      <div className="flex items-center mb-8 pt-4">
        <h1 className="text-2xl font-bold text-primary w-full text-center">انتظار اللاعبين</h1>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
        {/* Room Code */}
        <div className="bg-card rounded-3xl p-8 border shadow-sm text-center">
          <p className="text-muted-foreground mb-3 font-medium">أرسل هذا الكود للمتسابقين:</p>
          <div className="bg-muted rounded-2xl py-6 mb-4">
            <span className="text-6xl font-black tracking-[0.4em] text-primary">{roomCode}</span>
          </div>
          <button onClick={handleCopy} className="flex items-center gap-2 mx-auto text-sm text-muted-foreground hover:text-primary transition-colors">
            {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "تم النسخ!" : "نسخ الكود"}
          </button>
        </div>

        {/* Players Lobby */}
        <div className="bg-card rounded-3xl p-6 border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> اللاعبون في الغرفة
            </h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-sm">
              {lobbyPlayers.length} / {maxPlayers}
            </span>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {lobbyPlayers.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3 bg-muted rounded-xl p-3"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                  >
                    {p.name[0]}
                  </div>
                  <span className="font-medium">{p.name}</span>
                  {p.id === myId.current && <span className="mr-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">أنت (المضيف)</span>}
                </motion.div>
              ))}
            </AnimatePresence>
            {lobbyPlayers.length < maxPlayers && (
              <div className="flex items-center gap-3 border-2 border-dashed border-border rounded-xl p-3 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">في انتظار {maxPlayers - lobbyPlayers.length} لاعب آخر...</span>
              </div>
            )}
          </div>
        </div>

        <Button
          size="lg"
          className="w-full h-14 text-xl rounded-2xl"
          onClick={handleStart}
          disabled={lobbyPlayers.length < 1}
        >
          <Play className="w-6 h-6 ml-2" />
          ابدأ اللعبة ({lobbyPlayers.length} لاعب)
        </Button>
        <p className="text-center text-muted-foreground text-sm">يمكنك البدء بأي عدد من اللاعبين</p>
      </motion.div>
    </div>
  );
}
