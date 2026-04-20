import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { ArrowRight, Play, Infinity } from "lucide-react";
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

  const canStart = isFreePlay || !!selectedCount;

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1f3c 40%, #0a1628 100%)" }}
    >
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[110px]" style={{ background: "rgba(234,179,8,0.1)" }} />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: "rgba(16,185,129,0.08)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px]" style={{ background: "rgba(168,85,247,0.06)" }} />
      </div>

      {/* Gold top line */}
      <div className="w-full h-1 shrink-0" style={{ background: "linear-gradient(90deg, transparent, #d4a847, #f5c842, #d4a847, transparent)" }} />

      <div className="relative z-10 flex flex-col flex-1 max-w-2xl mx-auto w-full px-5 py-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
              className="p-3 rounded-2xl border text-white"
              style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.15)" }}
            >
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </Link>
          <h1 className="flex-1 text-center text-3xl font-black text-white ml-12">إعداد اللعبة</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="flex flex-col gap-5 flex-1">

          {/* Free Play Card */}
          <motion.button
            whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.01 }}
            onClick={toggleFreePlay}
            className="w-full rounded-3xl p-6 text-right flex items-center gap-5 transition-all duration-200"
            style={{
              background: isFreePlay ? "rgba(234,179,8,0.15)" : "rgba(255,255,255,0.05)",
              border: `2px solid ${isFreePlay ? "rgba(234,179,8,0.6)" : "rgba(255,255,255,0.1)"}`,
              backdropFilter: "blur(16px)",
              boxShadow: isFreePlay ? "0 0 30px rgba(234,179,8,0.15)" : "none",
            }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all"
              style={{
                background: isFreePlay ? "linear-gradient(135deg,#f59e0b,#d97706)" : "rgba(255,255,255,0.08)",
                boxShadow: isFreePlay ? "0 0 18px rgba(245,158,11,0.4)" : "none",
              }}>
              <Infinity className="w-7 h-7" style={{ color: isFreePlay ? "#1c0a00" : "rgba(255,255,255,0.5)" }} />
            </div>
            <div className="flex-1">
              <div className="font-black text-xl mb-1" style={{ color: isFreePlay ? "#fbbf24" : "white" }}>لعب حر</div>
              <div className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>العب بلا حدود — تنتهي اللعبة بأول إجابة خاطئة</div>
            </div>
            <div className="w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
              style={{ borderColor: isFreePlay ? "#f59e0b" : "rgba(255,255,255,0.3)", background: isFreePlay ? "#f59e0b" : "transparent" }}>
              {isFreePlay && <div className="w-2.5 h-2.5 rounded-full bg-amber-900" />}
            </div>
          </motion.button>

          {/* Question Count Card */}
          <div
            className="rounded-3xl p-7 transition-opacity duration-300"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1.5px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(16px)",
              opacity: isFreePlay ? 0.35 : 1,
              pointerEvents: isFreePlay ? "none" : "auto",
            }}
          >
            <h2 className="text-lg font-black mb-6 text-center" style={{ color: "rgba(255,255,255,0.8)" }}>اختر عدد الأسئلة</h2>
            <div className="grid grid-cols-5 gap-3">
              {COUNTS.map((num) => {
                const active = selectedCount === num && !isFreePlay;
                return (
                  <motion.button
                    key={num}
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                    onClick={() => { setSelectedCount(num); setIsFreePlay(false); }}
                    className="h-14 rounded-2xl text-xl font-black transition-all duration-200"
                    style={{
                      background: active ? "linear-gradient(135deg,#f59e0b,#d97706)" : "rgba(255,255,255,0.07)",
                      color: active ? "#1c0a00" : "rgba(255,255,255,0.6)",
                      border: `2px solid ${active ? "rgba(245,158,11,0.7)" : "rgba(255,255,255,0.1)"}`,
                      boxShadow: active ? "0 0 18px rgba(245,158,11,0.35)" : "none",
                    }}
                  >
                    {num}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: canStart ? 1.02 : 1 }}
            whileTap={{ scale: canStart ? 0.97 : 1 }}
            onClick={handleStart}
            disabled={!canStart}
            className="w-full h-16 rounded-2xl text-xl font-black flex items-center justify-center gap-3 mt-auto transition-all"
            style={{
              background: canStart ? "linear-gradient(135deg,#f59e0b,#d97706)" : "rgba(255,255,255,0.07)",
              color: canStart ? "#1c0a00" : "rgba(255,255,255,0.3)",
              boxShadow: canStart ? "0 0 28px rgba(245,158,11,0.4)" : "none",
              border: canStart ? "none" : "1.5px solid rgba(255,255,255,0.1)",
              cursor: canStart ? "pointer" : "not-allowed",
            }}
          >
            {isFreePlay
              ? <><Infinity className="w-6 h-6" /> ابدأ اللعب الحر</>
              : <><Play className="w-6 h-6" /> ابدأ اللعبة</>
            }
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
