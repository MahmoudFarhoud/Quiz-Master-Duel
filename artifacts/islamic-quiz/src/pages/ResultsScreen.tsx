import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import confetti from "canvas-confetti";
import { Trophy, RefreshCcw, Home } from "lucide-react";
import { useGameStore, Player } from "@/lib/store";
import { Button } from "@/components/ui/button";

export default function ResultsScreen() {
  const { players, questions, reset } = useGameStore();
  const [, setLocation] = useLocation();

  const totalQuestions = questions.length;
  const isMultiplayer = players.length > 1;

  // Determine winner
  let winner: Player | null = null;
  let isDraw = false;

  if (isMultiplayer) {
    if (players[0].score > players[1].score) winner = players[0];
    else if (players[1].score > players[0].score) winner = players[1];
    else isDraw = true;
  } else {
    winner = players[0]; // For styling purposes
  }

  useEffect(() => {
    // Fire confetti!
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#fbbf24']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#fbbf24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handlePlayAgain = () => {
    reset();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="z-10 w-full max-w-2xl"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-[3rem] p-8 md:p-12 shadow-2xl text-center">
          
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.5)] mb-6">
            <Trophy className="w-12 h-12 text-yellow-950" />
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-2">
            {isMultiplayer ? (isDraw ? "تعادل!" : `الفائز هو ${winner?.name}!`) : "انتهت اللعبة!"}
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            أجبتم على {totalQuestions} أسئلة
          </p>

          <div className={`grid gap-6 mb-12 ${isMultiplayer ? 'md:grid-cols-2' : 'max-w-sm mx-auto'}`}>
            {players.map(p => (
              <div 
                key={p.id} 
                className={`rounded-3xl p-6 border-2 transition-transform ${
                  p.id === winner?.id && !isDraw ? 'scale-110 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'border-border bg-background'
                }`}
              >
                <div className="text-xl font-bold mb-2">{p.name}</div>
                <div className="text-5xl font-display font-black text-primary mb-2">
                  {p.score} <span className="text-xl text-muted-foreground">نقطة</span>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  معدل النجاح: {Math.round((p.score / (isMultiplayer ? totalQuestions/2 : totalQuestions)) * 100)}%
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-14 px-8 text-lg rounded-2xl" onClick={handlePlayAgain}>
              <RefreshCcw className="w-5 h-5 ml-2" />
              العب مرة تانية
            </Button>
            <Link href="/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-2xl" onClick={reset}>
                <Home className="w-5 h-5 ml-2" />
                الرئيسية
              </Button>
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
