import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { ArrowRight, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJoinMatchmaking, useLeaveMatchmaking } from "@workspace/api-client-react";

export default function Matchmaking() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const joinMutation = useJoinMatchmaking();
  const leaveMutation = useLeaveMatchmaking();

  const handleSearch = () => {
    if (!name.trim()) return;
    setIsSearching(true);
    joinMutation.mutate({ data: { playerName: name, playerId: "temp_id_" + Date.now() } }, {
      onSuccess: () => {
        // Simulating matching after 3 seconds for UI demo
        setTimeout(() => {
          setLocation("/game");
        }, 3000);
      },
      onError: () => setIsSearching(false)
    });
  };

  const handleCancel = () => {
    setIsSearching(false);
    // leaveMutation.mutate({ playerId: "temp_id" })
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col max-w-xl mx-auto">
      <div className="flex items-center mb-10 pt-4">
        <Link href="/online" className="p-3 bg-card border rounded-2xl hover:bg-muted transition-colors mr-auto">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-display font-bold text-primary flex-1 text-center ml-12">
          بحث عشوائي
        </h1>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-3xl p-8 border shadow-sm space-y-6">
        {!isSearching ? (
          <>
            <div>
              <label className="block font-bold mb-2">اسمك</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="أدخل اسمك..." />
            </div>
            <Button 
              className="w-full h-14 text-lg" 
              onClick={handleSearch}
              disabled={!name.trim()}
            >
              ابحث عن منافس
            </Button>
          </>
        ) : (
          <div className="text-center py-10 space-y-8">
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping" />
              <div className="absolute inset-2 border-4 border-secondary/40 rounded-full animate-pulse" />
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">جاري البحث عن منافس...</h2>
              <p className="text-muted-foreground">الرجاء الانتظار، قد يستغرق الأمر ثواني معدودة</p>
            </div>

            <Button variant="outline" className="w-full" onClick={handleCancel}>
              <X className="w-4 h-4 ml-2" /> إلغاء البحث
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
