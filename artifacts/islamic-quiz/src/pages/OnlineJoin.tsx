import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { ArrowRight, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJoinRoom } from "@workspace/api-client-react";
import { useGameStore } from "@/lib/store";

export default function OnlineJoin() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  
  const joinMutation = useJoinRoom();
  const initOnline = useGameStore(s => s.initOnline);

  const handleJoin = () => {
    if (!name.trim() || !code.trim()) return;
    
    joinMutation.mutate({ code, data: { guestName: name } }, {
      onSuccess: (data) => {
        // Mock successful join
        initOnline(
          data.code, 
          false, 
          [
            { id: '1', name: data.hostName, score: 0, color: 'blue', lifelines: { fifty: true, skip: true, time: true } },
            { id: '2', name: name, score: 0, color: 'orange', lifelines: { fifty: true, skip: true, time: true } }
          ],
          [] // would fetch real Qs
        );
        setLocation("/game");
      },
      onError: () => {
        alert("كود الغرفة غير صحيح أو الغرفة ممتلئة");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col max-w-xl mx-auto">
      <div className="flex items-center mb-10 pt-4">
        <Link href="/online" className="p-3 bg-card border rounded-2xl hover:bg-muted transition-colors mr-auto">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-display font-bold text-primary flex-1 text-center ml-12">
          الانضمام لغرفة
        </h1>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-3xl p-8 border shadow-sm space-y-6">
        <div>
          <label className="block font-bold mb-2">اسمك</label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="أدخل اسمك..." />
        </div>
        <div>
          <label className="block font-bold mb-2">كود الغرفة</label>
          <Input 
            value={code} 
            onChange={e => setCode(e.target.value.toUpperCase())} 
            placeholder="مثال: ABCD" 
            className="text-center text-2xl tracking-[0.3em] font-display font-bold uppercase"
            maxLength={6}
          />
        </div>
        <Button 
          className="w-full h-14 text-lg" 
          onClick={handleJoin}
          disabled={joinMutation.isPending || !name.trim() || !code.trim()}
        >
          {joinMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : (
            <><LogIn className="w-5 h-5 ml-2" /> دخول الغرفة</>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
