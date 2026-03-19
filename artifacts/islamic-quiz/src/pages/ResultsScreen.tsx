import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import confetti from "canvas-confetti";
import { Trophy, RefreshCcw, Home, Star, Medal } from "lucide-react";
import { useGameStore, Player } from "@/lib/store";
import { Button } from "@/components/ui/button";

const PLAYER_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue: {
    bg: "from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30",
    border: "border-blue-300 dark:border-blue-700",
    text: "text-blue-700 dark:text-blue-300",
    badge: "bg-blue-500",
  },
  orange: {
    bg: "from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30",
    border: "border-orange-300 dark:border-orange-700",
    text: "text-orange-700 dark:text-orange-300",
    badge: "bg-orange-500",
  },
  green: {
    bg: "from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30",
    border: "border-emerald-300 dark:border-emerald-700",
    text: "text-emerald-700 dark:text-emerald-300",
    badge: "bg-emerald-500",
  },
};

export default function ResultsScreen() {
  const { players, questions, mode, reset } = useGameStore();
  const [, setLocation] = useLocation();

  const totalQuestions = questions.length;
  const isMultiplayer = players.length > 1;

  let winner: Player | null = null;
  let isDraw = false;

  if (isMultiplayer) {
    if (players[0].score > players[1].score) winner = players[0];
    else if (players[1].score > players[0].score) winner = players[1];
    else isDraw = true;
  }

  useEffect(() => {
    const end = Date.now() + 3500;
    const fire = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#10b981', '#fbbf24', '#3b82f6'] });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#10b981', '#fbbf24', '#f97316'] });
      if (Date.now() < end) requestAnimationFrame(fire);
    };
    fire();
  }, []);

  const handlePlayAgain = () => {
    reset();
    setLocation("/");
  };

  // Sort players by score (descending) for the leaderboard
  const sortedPlayers = isMultiplayer ? [...players].sort((a, b) => b.score - a.score) : players;

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[80px]" />
        <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[80px]" />
      </div>

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="z-10 w-full max-w-2xl"
      >
        <div className="bg-card/90 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl">

          {/* Trophy */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
              className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(234,179,8,0.4)] mb-5"
            >
              <Trophy className="w-12 h-12 text-yellow-950" />
            </motion.div>

            {isMultiplayer ? (
              isDraw ? (
                <>
                  <h1 className="text-4xl font-black text-foreground mb-1">تعادل!</h1>
                  <p className="text-muted-foreground text-lg">نتيجة متساوية 🤝</p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-black text-foreground mb-1">🎉 الفائز هو</h1>
                  <p className={`text-3xl font-black ${PLAYER_COLORS[winner!.color]?.text}`}>{winner!.name}!</p>
                </>
              )
            ) : (
              <>
                <h1 className="text-4xl font-black text-foreground mb-1">انتهت اللعبة!</h1>
                <p className="text-muted-foreground">أجبت على {totalQuestions} سؤال</p>
              </>
            )}
          </div>

          {/* Scores */}
          <div className={`grid gap-4 mb-8 ${isMultiplayer ? 'grid-cols-1 sm:grid-cols-2' : 'max-w-xs mx-auto'}`}>
            {sortedPlayers.map((p, rank) => {
              const colors = PLAYER_COLORS[p.color] ?? PLAYER_COLORS.green;
              const isWinner = winner?.id === p.id && !isDraw;
              const pct = Math.round((p.score / totalQuestions) * 100);

              return (
                <motion.div
                  key={p.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + rank * 0.1 }}
                  className={`rounded-3xl p-6 border-2 bg-gradient-to-br ${colors.bg} ${colors.border} ${isWinner ? 'ring-2 ring-yellow-400 ring-offset-2' : ''} relative overflow-hidden`}
                >
                  {isWinner && (
                    <div className="absolute top-3 left-3">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
                    </div>
                  )}
                  {isMultiplayer && rank === 0 && !isDraw && (
                    <div className="absolute top-3 right-3">
                      <Medal className="w-5 h-5 text-yellow-500 fill-yellow-400" />
                    </div>
                  )}

                  <div className={`text-sm font-bold mb-1 ${colors.text}`}>{p.name}</div>
                  <div className="flex items-end gap-2 mb-3">
                    <span className={`text-6xl font-black ${colors.text}`}>{p.score}</span>
                    <span className="text-muted-foreground text-lg mb-2">/ {totalQuestions}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.4 + rank * 0.1, duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${colors.badge}`}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1.5 font-medium">{pct}% إجابات صحيحة</div>
                </motion.div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
