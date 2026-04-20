import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import confetti from "canvas-confetti";
import { Trophy, RefreshCcw, Home, Star } from "lucide-react";
import { useGameStore } from "@/lib/store";

const PLAYER_THEMES: Record<string, { card: string; score: string; bar: string; glow: string; border: string }> = {
  blue:   { card: "rgba(30,58,138,0.55)",   score: "#93c5fd", bar: "linear-gradient(90deg,#3b82f6,#60a5fa)", glow: "rgba(59,130,246,0.4)",   border: "rgba(96,165,250,0.4)" },
  orange: { card: "rgba(124,45,18,0.55)",   score: "#fdba74", bar: "linear-gradient(90deg,#f97316,#fb923c)", glow: "rgba(249,115,22,0.4)",   border: "rgba(251,146,60,0.4)" },
  green:  { card: "rgba(6,78,59,0.55)",     score: "#6ee7b7", bar: "linear-gradient(90deg,#10b981,#34d399)", glow: "rgba(16,185,129,0.4)",   border: "rgba(52,211,153,0.4)" },
  purple: { card: "rgba(76,29,149,0.55)",   score: "#d8b4fe", bar: "linear-gradient(90deg,#a855f7,#c084fc)", glow: "rgba(168,85,247,0.4)",   border: "rgba(192,132,252,0.4)" },
  red:    { card: "rgba(127,29,29,0.55)",   score: "#fca5a5", bar: "linear-gradient(90deg,#ef4444,#f87171)", glow: "rgba(239,68,68,0.4)",    border: "rgba(248,113,113,0.4)" },
  cyan:   { card: "rgba(14,116,144,0.55)",  score: "#67e8f9", bar: "linear-gradient(90deg,#06b6d4,#22d3ee)", glow: "rgba(6,182,212,0.4)",    border: "rgba(34,211,238,0.4)" },
  pink:   { card: "rgba(131,24,67,0.55)",   score: "#f9a8d4", bar: "linear-gradient(90deg,#ec4899,#f472b6)", glow: "rgba(236,72,153,0.4)",   border: "rgba(244,114,182,0.4)" },
  yellow: { card: "rgba(113,63,18,0.55)",   score: "#fde047", bar: "linear-gradient(90deg,#eab308,#facc15)", glow: "rgba(234,179,8,0.4)",    border: "rgba(250,204,21,0.4)" },
};

const RANK_ICONS = ["🥇", "🥈", "🥉"];

export default function ResultsScreen() {
  const { players, onlinePlayers, questions, mode, reset } = useGameStore();
  const [, setLocation] = useLocation();

  const totalQuestions = questions.length;
  const isOnline = mode === 'online';
  const isMultiplayer = isOnline || players.length > 1;

  const displayPlayers = isOnline
    ? [...onlinePlayers].sort((a, b) => b.score - a.score)
    : [...players].sort((a, b) => b.score - a.score);

  const winner = isMultiplayer && displayPlayers.length > 1
    ? (displayPlayers[0].score > displayPlayers[1].score ? displayPlayers[0] : null)
    : null;
  const isDraw = isMultiplayer && displayPlayers.length > 1 && displayPlayers[0].score === displayPlayers[1].score;

  useEffect(() => {
    const audio1 = new Audio(import.meta.env.BASE_URL + "win1.mp3");
    const audio2 = new Audio(import.meta.env.BASE_URL + "win2.mp3");
    audio1.play().catch(() => {});
    audio2.play().catch(() => {});
    return () => { audio1.pause(); audio2.pause(); };
  }, []);

  useEffect(() => {
    const end = Date.now() + 4000;
    const fire = () => {
      confetti({ particleCount: 8, angle: 60,  spread: 60, origin: { x: 0 }, colors: ['#fbbf24','#34d399','#60a5fa','#f472b6'] });
      confetti({ particleCount: 8, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#fbbf24','#34d399','#f97316','#a855f7'] });
      if (Date.now() < end) requestAnimationFrame(fire);
    };
    fire();
  }, []);

  const handlePlayAgain = () => { reset(); setLocation("/"); };
  const colsClass = displayPlayers.length === 1
    ? "max-w-sm mx-auto"
    : displayPlayers.length === 2
    ? "grid-cols-1 sm:grid-cols-2"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4 md:p-8"
      style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1f3c 40%, #0a1628 100%)" }}>

      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px]" style={{ background: "rgba(234,179,8,0.12)" }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-[100px]" style={{ background: "rgba(16,185,129,0.1)" }} />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full blur-[80px]" style={{ background: "rgba(168,85,247,0.08)" }} />
      </div>

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.35 }}
        className="relative z-10 w-full max-w-3xl"
      >
        {/* Main card */}
        <div className="rounded-[2.5rem] p-6 md:p-10 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(24px)",
            border: "1.5px solid rgba(255,255,255,0.1)",
            boxShadow: "0 0 80px rgba(234,179,8,0.08), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}>

          {/* Trophy */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -30, scale: 0.7 }}
              animate={{ y: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.6, delay: 0.15 }}
              className="relative w-28 h-28 mx-auto mb-5"
            >
              <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: "rgba(234,179,8,0.5)" }} />
              <div className="relative w-full h-full rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)", boxShadow: "0 0 40px rgba(251,191,36,0.6)" }}>
                <Trophy className="w-14 h-14" style={{ color: "#451a03" }} />
              </div>
            </motion.div>

            {isMultiplayer ? (
              isDraw ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h1 className="text-4xl font-black text-white mb-1">تعادل! 🤝</h1>
                  <p className="text-white/50 text-lg">نتيجة متساوية</p>
                </motion.div>
              ) : winner ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h1 className="text-3xl font-black text-white/70 mb-1">🎉 الفائز</h1>
                  <p className="text-4xl font-black" style={{ color: PLAYER_THEMES[winner.color]?.score ?? "#fff", textShadow: `0 0 20px ${PLAYER_THEMES[winner.color]?.glow ?? "transparent"}` }}>
                    {winner.name}!
                  </p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h1 className="text-4xl font-black text-white mb-1">النتائج النهائية</h1>
                  <p className="text-white/50">ترتيب اللاعبين</p>
                </motion.div>
              )
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h1 className="text-4xl font-black text-white mb-1">انتهت اللعبة! 🎊</h1>
                <p className="text-white/50">أجبت على {totalQuestions} سؤال</p>
              </motion.div>
            )}
          </div>

          {/* Player cards */}
          <div className={`grid gap-4 mb-8 ${colsClass}`}>
            {displayPlayers.map((p, rank) => {
              const t = PLAYER_THEMES[p.color] ?? PLAYER_THEMES.green;
              const isWinner = winner?.id === p.id && !isDraw;
              const pct = totalQuestions > 0 ? Math.round((p.score / totalQuestions) * 100) : 0;

              return (
                <motion.div
                  key={p.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + rank * 0.1, type: "spring", bounce: 0.3 }}
                  className="relative rounded-3xl p-6 overflow-hidden"
                  style={{
                    background: t.card,
                    backdropFilter: "blur(12px)",
                    border: `1.5px solid ${t.border}`,
                    boxShadow: isWinner ? `0 0 30px ${t.glow}, 0 0 0 2px rgba(251,191,36,0.5)` : `0 0 20px ${t.glow}`,
                  }}
                >
                  {/* Rank */}
                  {isMultiplayer && (
                    <div className="absolute top-3 right-4 text-2xl">
                      {rank < 3 ? RANK_ICONS[rank] : <span className="text-base font-black text-white/50">{rank + 1}</span>}
                    </div>
                  )}

                  {isWinner && (
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="absolute top-3 left-4"
                    >
                      <Star className="w-5 h-5 fill-yellow-400" style={{ color: "#fbbf24" }} />
                    </motion.div>
                  )}

                  {/* Subtle background shine */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none rounded-3xl"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${t.score}, transparent 70%)` }} />

                  <div className="relative">
                    <div className="text-sm font-bold mb-2 truncate" style={{ color: t.score }}>{p.name}</div>

                    <div className="flex items-end gap-2 mb-4">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + rank * 0.1, type: "spring", bounce: 0.5 }}
                        className="text-6xl font-black leading-none"
                        style={{ color: t.score, textShadow: `0 0 20px ${t.glow}` }}
                      >
                        {p.score}
                      </motion.span>
                      <span className="text-lg text-white/40 mb-1">/ {totalQuestions}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: "rgba(0,0,0,0.3)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.5 + rank * 0.1, duration: 0.9, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: t.bar, boxShadow: `0 0 8px ${t.glow}` }}
                      />
                    </div>
                    <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{pct}% إجابات صحيحة</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handlePlayAgain}
              className="flex items-center justify-center gap-2 h-14 px-8 text-lg font-bold rounded-2xl transition-all"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#1c0a00", boxShadow: "0 0 20px rgba(245,158,11,0.4)" }}
            >
              <RefreshCcw className="w-5 h-5" />
              العب مرة تانية
            </motion.button>

            <Link href="/">
              <motion.button
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={reset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 h-14 px-8 text-lg font-bold rounded-2xl transition-all text-white"
                style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.18)" }}
              >
                <Home className="w-5 h-5" />
                الرئيسية
              </motion.button>
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
