import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { ArrowRight, Loader2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateRoom } from "@workspace/api-client-react";
import { useGameStore } from "@/lib/store";

export default function OnlineHost() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [count, setCount] = useState(20);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  
  const createMutation = useCreateRoom();

  const handleCreate = () => {
    if (!name.trim()) return;
    createMutation.mutate({ data: { hostName: name, questionCount: count } }, {
      onSuccess: (data) => {
        setRoomCode(data.code);
        // In a real app, we'd wait for WebSocket event "player_joined" here
        // For this demo UI, we'll give a fake button to simulate friend joining
      }
    });
  };

  const initOnline = useGameStore(s => s.initOnline);
  
  // Fake simulator for testing frontend flow
  const simulateFriendJoin = () => {
    initOnline(
      roomCode!, 
      true, 
      [
        { id: '1', name: name, score: 0, color: 'blue', lifelines: { fifty: true, skip: true, time: true } },
        { id: '2', name: 'صديقك', score: 0, color: 'orange', lifelines: { fifty: true, skip: true, time: true } }
      ],
      [] // would fetch questions in reality
    );
    setLocation("/game");
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col max-w-xl mx-auto">
      <div className="flex items-center mb-10 pt-4">
        <Link href="/online" className="p-3 bg-card border rounded-2xl hover:bg-muted transition-colors mr-auto">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-display font-bold text-primary flex-1 text-center ml-12">
          إنشاء غرفة
        </h1>
      </div>

      {!roomCode ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-3xl p-8 border shadow-sm space-y-6">
          <div>
            <label className="block font-bold mb-2">اسمك</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="أدخل اسمك..." />
          </div>
          <div>
            <label className="block font-bold mb-2">عدد الأسئلة</label>
            <select 
              value={count} 
              onChange={e => setCount(Number(e.target.value))}
              className="flex h-12 w-full rounded-xl border-2 border-border bg-background px-4 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
            >
              {[10,20,30,40,50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <Button 
            className="w-full h-14 text-lg" 
            onClick={handleCreate}
            disabled={createMutation.isPending || !name.trim()}
          >
            {createMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "إنشاء الغرفة"}
          </Button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-3xl p-8 border shadow-sm text-center space-y-8">
          <h2 className="text-2xl font-bold">تم إنشاء الغرفة!</h2>
          <p className="text-muted-foreground">أرسل هذا الكود لصديقك ليدخل به:</p>
          
          <div className="bg-muted rounded-2xl py-8 flex flex-col items-center justify-center">
            <span className="text-6xl font-display font-black tracking-[0.5em] text-primary">{roomCode}</span>
            <button className="mt-4 text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
              <Copy className="w-4 h-4" /> نسخ الكود
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 text-secondary-foreground font-medium">
            <Loader2 className="w-5 h-5 animate-spin" />
            في انتظار انضمام صديقك...
          </div>

          <Button variant="outline" className="w-full" onClick={simulateFriendJoin}>
            (للتجربة: محاكاة دخول صديق)
          </Button>
        </motion.div>
      )}
    </div>
  );
}
