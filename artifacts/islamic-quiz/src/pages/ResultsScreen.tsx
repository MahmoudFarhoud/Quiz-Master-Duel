import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import confetti from "canvas-confetti";
import { Trophy, RefreshCcw, Home, Star, Medal } from "lucide-react";
import { useGameStore, PlayerColor } from "@/lib/store";
import { Button } from "@/components/ui/button";

const COLOR_STYLES: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue: { bg: "from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30", border: "border-blue-300 dark:border-blue-700", text: "text-blue-700 dark:text-blue-300", badge: "bg-blue-500" },
  orange: { bg: "from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30", border: "border-orange-300 dark:border-orange-700", text: "text-orange-700 dark:text-orange-300", badge: "bg-orange-500" },
  green: { bg: "from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30", border: "border-emerald-300 dark:border-emerald-700", text: "text-emerald-700 dark:text-emerald-300", badge: "bg-emerald-500" },
  purple: { bg: "from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/30", border: "border-purple-300 dark:border-purple-700", text: "text-purple-700 dark:text-purple-300", badge: "bg-purple-500" },
  red: { bg: "from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/30", border: "border-red-300 dark:border-red-700", text: "text-red-700 dark:text-red-300", badge: "bg-red-500" },
  cyan: { bg: "from-cyan-50 to-cyan-100 dark:from-cyan-950/40 dark:to-cyan-900/30", border: "border-cyan-300 dark:border-cyan-700", text: "text-cyan-700 dark:text-cyan-300", badge: "bg-cyan-500" },
  pink: { bg: "from-pink-50 to-pink-100 dark:from-pink-950/40 dark:to-pink-900/30", border: "border-pink-300 dark:border-pink-700", text: "text-pink-700 dark:text-pink-300", badge: "bg-pink-500" },
  yellow: { bg: "from-yellow-50 to-yellow-100 dark:from-yellow-950/40 dark:to-yellow-900/30", border: "border-yellow-300 dark:border-yellow-700", text: "text-yellow-700 dark:text-yellow-300", badge: "bg-yellow-500" },
};

export default function ResultsScreen() {
  const { players, onlinePlayers, questions, mode, reset } = useGameStore();
  const [, setLocation] = useLocation();

  const totalQuestions = questions.length;
  const isOnline = mode === 'online';
  const isMultiplayer = isOnline || players.length > 1;

  // Choose the right player list for display
  const displayPlayers = isOnline
    ? [...onlinePlayers].sort((a, b) => b.score - a.score)
    : [...players].sort((a, b) => b.score - a.score);

  const winner = isMultiplayer && displayPlayers.length > 1
    ? (displayPlayers[0].score > displayPlayers[1].score ? displayPlayers[0] : null)
    : null;
  const isDraw = isMultiplayer && displayPlayers.length > 1 && displayPlayers[0].score === displayPlayers[1].score;

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

  const colsClass = displayPlayers.length === 1 ? "max-w-xs mx-auto" : displayPlayers.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[80px]" />
        <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[80px]" />
      </div>

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="z-10 w-full max-w-3xl"
      >
        <div className="bg-card/90 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl">

          {/* Trophy Header */}
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
              ) : winner ? (
                <>
                  <h1 className="text-4xl font-black text-foreground mb-1">🎉 الفائز</h1>
                  <p className={`text-3xl font-black ${COLOR_STYLES[winner.color]?.text}`}>{winner.name}!</p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-black text-foreground mb-1">النتائج النهائية</h1>
                  <p className="text-muted-foreground">ترتيب اللاعبين</p>
                </>
              )
            ) : (
              <>
                <h1 className="text-4xl font-black text-foreground mb-1">انتهت اللعبة!</h1>
                <p className="text-muted-foreground">أجبت على {totalQuestions} سؤال</p>
              </>
            )}
          </div>

          {/* Player Cards */}
          <div className={`grid gap-4 mb-8 ${colsClass}`}>
            {displayPlayers.map((p, rank) => {
              const colors = COLOR_STYLES[p.color] ?? COLOR_STYLES.green;
              const isWinner = winner?.id === p.id && !isDraw;
              const pct = totalQuestions > 0 ? Math.round((p.score / totalQuestions) * 100) : 0;
              const rankEmoji = rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : `${rank + 1}.`;

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
                  {isMultiplayer && (
                    <div className="absolute top-3 right-3 text-xl">{rankEmoji}</div>
                  )}

                  <div className={`text-sm font-bold mb-1 ${colors.text}`}>{p.name}</div>
                  <div className="flex items-end gap-2 mb-3">
                    <span className={`text-6xl font-black ${colors.text}`}>{p.score}</span>
                    <span className="text-muted-foreground text-lg mb-2">/ {totalQuestions}</span>
                  </div>

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
