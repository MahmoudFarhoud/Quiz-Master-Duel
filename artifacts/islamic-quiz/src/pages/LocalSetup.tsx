import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { ArrowRight, Play, Plus, List } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { CustomQuestionModal } from "@/components/CustomQuestionModal";
import { Question } from "@/data/questions";

const COUNTS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const INPUT_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.07)",
  border: "1.5px solid rgba(255,255,255,0.15)",
  borderRadius: "0.875rem",
  color: "white",
  padding: "0.75rem 1rem",
  width: "100%",
  fontSize: "1rem",
  outline: "none",
};

export default function LocalSetup() {
  const [, setLocation] = useLocation();
  const initLocal = useGameStore(s => s.initLocal);

  const [p1Name, setP1Name] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);

  const handleStart = () => {
    if (!selectedCount) return;
    initLocal(p1Name, p2Name, selectedCount, customQuestions);
    setLocation("/game");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1f3c 40%, #0a1628 100%)" }}
    >
      <CustomQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(q) => setCustomQuestions(prev => [...prev, q])}
      />

      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[110px]" style={{ background: "rgba(234,179,8,0.1)" }} />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: "rgba(59,130,246,0.08)" }} />
        <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] rounded-full blur-[80px]" style={{ background: "rgba(249,115,22,0.07)" }} />
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
          <h1 className="flex-1 text-center text-3xl font-black text-white ml-12">لعب محلي</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="flex flex-col gap-5">

          {/* Player Names */}
          <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)" }}>
            <h2 className="text-lg font-black mb-5 text-white">أسماء اللاعبين</h2>
            <div className="grid md:grid-cols-2 gap-5">

              {/* Player 1 */}
              <div>
                <label className="block text-sm font-black mb-2" style={{ color: "#93c5fd" }}>اللاعب الأول (أزرق)</label>
                <input
                  placeholder="اسم اللاعب الأول"
                  value={p1Name}
                  onChange={e => setP1Name(e.target.value)}
                  style={{ ...INPUT_STYLE, borderColor: "rgba(96,165,250,0.35)" }}
                  onFocus={e => (e.target.style.borderColor = "rgba(96,165,250,0.7)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(96,165,250,0.35)")}
                />
              </div>

              {/* Player 2 */}
              <div>
                <label className="block text-sm font-black mb-2" style={{ color: "#fdba74" }}>اللاعب الثاني (برتقالي)</label>
                <input
                  placeholder="اسم اللاعب الثاني"
                  value={p2Name}
                  onChange={e => setP2Name(e.target.value)}
                  style={{ ...INPUT_STYLE, borderColor: "rgba(251,146,60,0.35)" }}
                  onFocus={e => (e.target.style.borderColor = "rgba(251,146,60,0.7)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(251,146,60,0.35)")}
                />
              </div>
            </div>
          </div>

          {/* Questions Settings */}
          <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)" }}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-black text-white">إعدادات الأسئلة</h2>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}
              >
                <Plus className="w-4 h-4" /> أضف سؤال
              </motion.button>
            </div>

            {customQuestions.length > 0 && (
              <div className="mb-5 p-4 rounded-2xl flex items-center justify-between"
                style={{ background: "rgba(234,179,8,0.1)", border: "1.5px solid rgba(234,179,8,0.3)" }}>
                <div className="flex items-center gap-2">
                  <List className="w-5 h-5" style={{ color: "#fbbf24" }} />
                  <span className="font-bold" style={{ color: "#fbbf24" }}>الأسئلة المخصصة:</span>
                </div>
                <span className="px-3 py-1 rounded-full font-black text-sm" style={{ background: "#f59e0b", color: "#1c0a00" }}>{customQuestions.length}</span>
              </div>
            )}

            <p className="text-sm font-bold mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>إجمالي الأسئلة المطلوبة</p>
            <div className="grid grid-cols-5 gap-3">
              {COUNTS.map((num) => {
                const active = selectedCount === num;
                return (
                  <motion.button
                    key={num}
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCount(num)}
                    className="h-12 rounded-xl text-lg font-black transition-all duration-200"
                    style={{
                      background: active ? "linear-gradient(135deg,#f59e0b,#d97706)" : "rgba(255,255,255,0.07)",
                      color: active ? "#1c0a00" : "rgba(255,255,255,0.55)",
                      border: `2px solid ${active ? "rgba(245,158,11,0.7)" : "rgba(255,255,255,0.1)"}`,
                      boxShadow: active ? "0 0 16px rgba(245,158,11,0.35)" : "none",
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
            whileHover={{ scale: selectedCount ? 1.02 : 1 }}
            whileTap={{ scale: selectedCount ? 0.97 : 1 }}
            onClick={handleStart}
            disabled={!selectedCount}
            className="w-full h-16 rounded-2xl text-xl font-black flex items-center justify-center gap-3"
            style={{
              background: selectedCount ? "linear-gradient(135deg,#f59e0b,#d97706)" : "rgba(255,255,255,0.07)",
              color: selectedCount ? "#1c0a00" : "rgba(255,255,255,0.3)",
              boxShadow: selectedCount ? "0 0 28px rgba(245,158,11,0.4)" : "none",
              border: selectedCount ? "none" : "1.5px solid rgba(255,255,255,0.1)",
              cursor: selectedCount ? "pointer" : "not-allowed",
            }}
          >
            <Play className="w-6 h-6" />
            ابدأ التحدي
          </motion.button>

        </motion.div>
      </div>
    </div>
  );
}
