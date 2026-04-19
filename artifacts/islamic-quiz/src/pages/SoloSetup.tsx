import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { ArrowRight, Play, Infinity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/lib/store";

const COUNTS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function SoloSetup() {
  const [, setLocation] = useLocation();
  const initSolo = useGameStore(s => s.initSolo);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [isFreePlay, setIsFreePlay] = useState(false);

  const handleStart = () => {
    if (!isFreePlay && !selectedCount) return;
    initSolo(selectedCount ?? 0, "أنت", isFreePlay);
    setLocation("/game");
  };

  const toggleFreePlay = () => {
    setIsFreePlay(prev => !prev);
    if (!isFreePlay) setSelectedCount(null);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col max-w-4xl mx-auto">
      <div className="flex items-center mb-10 pt-4">
        <Link href="/" className="p-3 bg-card border rounded-2xl hover:bg-muted transition-colors mr-auto">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-display font-bold text-primary flex-1 text-center ml-12">
          إعداد اللعبة
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col gap-5"
      >
        {/* Free Play Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={toggleFreePlay}
          className={`w-full rounded-3xl p-6 border-2 text-right transition-all duration-200 flex items-center gap-5 ${
            isFreePlay
              ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
              : "bg-card border-border hover:border-primary/40"
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
            isFreePlay ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            <Infinity className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-xl mb-1">لعب حر</div>
            <div className="text-sm text-muted-foreground leading-relaxed">
              العب بلا حدود — تنتهي اللعبة بأول إجابة خاطئة
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
            isFreePlay ? "bg-primary border-primary" : "border-muted-foreground/40"
          }`}>
            {isFreePlay && <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />}
          </div>
        </motion.button>

        {/* Question Count Card */}
        <div className={`bg-card rounded-3xl p-8 border transition-opacity duration-300 ${isFreePlay ? "opacity-40 pointer-events-none" : ""}`}>
          <h2 className="text-xl font-bold mb-6 text-center text-foreground">اختر عدد الأسئلة</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {COUNTS.map((num) => (
              <button
                key={num}
                onClick={() => { setSelectedCount(num); setIsFreePlay(false); }}
                className={`h-16 rounded-2xl text-2xl font-display font-bold transition-all duration-200 ${
                  selectedCount === num && !isFreePlay
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105 border-2 border-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary border-2 border-transparent"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <Button
          size="lg"
          className="w-full h-16 text-xl rounded-2xl mt-auto"
          disabled={!isFreePlay && !selectedCount}
          onClick={handleStart}
        >
          {isFreePlay
            ? <><Infinity className="w-6 h-6 ml-2" /> ابدأ اللعب الحر</>
            : <><Play className="w-6 h-6 ml-2" /> ابدأ اللعبة</>
          }
        </Button>
      </motion.div>
    </div>
  );
}
