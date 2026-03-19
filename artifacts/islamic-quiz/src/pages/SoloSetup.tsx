import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/lib/store";

const COUNTS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function SoloSetup() {
  const [, setLocation] = useLocation();
  const initSolo = useGameStore(s => s.initSolo);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);

  const handleStart = () => {
    if (!selectedCount) return;
    initSolo(selectedCount);
    setLocation("/game");
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
        className="flex-1 flex flex-col"
      >
        <div className="bg-card rounded-3xl p-8 border shadow-sm flex-1">
          <h2 className="text-xl font-bold mb-8 text-center text-foreground">اختر عدد الأسئلة</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
            {COUNTS.map((num) => (
              <button
                key={num}
                onClick={() => setSelectedCount(num)}
                className={`h-16 rounded-2xl text-2xl font-display font-bold transition-all duration-200 ${
                  selectedCount === num 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105 border-2 border-primary/20' 
                    : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary border-2 border-transparent'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="mt-auto">
            <Button 
              size="lg" 
              className="w-full h-16 text-xl rounded-2xl" 
              disabled={!selectedCount}
              onClick={handleStart}
            >
              <Play className="w-6 h-6 ml-2" />
              ابدأ اللعبة
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
