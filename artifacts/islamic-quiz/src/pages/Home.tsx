import { motion } from "framer-motion";
import { Link } from "wouter";
import { User, Users, Wifi } from "lucide-react";

const VERSE = "شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ وَالْمَلَائِكَةُ وَأُولُو الْعِلْمِ قَائِمًا بِالْقِسْطِ";
const VERSE_REF = "سورة آل عمران ﴿١٨﴾";

export default function Home() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-between overflow-hidden relative"
      style={{ background: "linear-gradient(160deg, #0a2e1a 0%, #0f3d22 40%, #1a5c32 70%, #0d2b18 100%)" }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #d4a847 0%, transparent 70%)", transform: "translate(-30%, -30%)" }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #d4a847 0%, transparent 70%)", transform: "translate(30%, 30%)" }} />

      {/* Arabesque top border */}
      <div className="w-full h-2 shrink-0" style={{ background: "linear-gradient(90deg, transparent, #d4a847, #f5c842, #d4a847, transparent)" }} />

      {/* ── Verse Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl mx-auto px-5 pt-6 pb-4"
      >
        <div
          className="rounded-2xl px-6 py-10 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(212,168,71,0.18) 0%, rgba(212,168,71,0.06) 100%)", border: "1.5px solid rgba(212,168,71,0.45)" }}
        >
          {/* بسم الله */}
          <p
            className="text-lg md:text-xl font-bold mb-3 tracking-widest"
            style={{
              color: "rgba(212,168,71,0.9)",
              fontFamily: "'Amiri', 'Scheherazade New', 'Traditional Arabic', serif",
              letterSpacing: "0.05em"
            }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>

          {/* Divider */}
          <div className="w-24 h-px mx-auto mb-4" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,71,0.6), transparent)" }} />

          {/* الآية */}
          <p
            className="text-2xl md:text-3xl leading-loose font-bold"
            style={{
              color: "#f0d080",
              fontFamily: "'Amiri', 'Scheherazade New', 'Traditional Arabic', serif",
              textShadow: "0 0 24px rgba(212,168,71,0.35)"
            }}
          >
            ﴿ {VERSE} ﴾
          </p>

          {/* المرجع */}
          <p className="mt-2 mb-3 text-sm font-medium" style={{ color: "rgba(212,168,71,0.7)" }}>
            {VERSE_REF}
          </p>

          {/* Divider */}
          <div className="w-24 h-px mx-auto mb-3" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,71,0.6), transparent)" }} />

          {/* صدق الله العظيم */}
          <p
            className="text-base md:text-lg font-bold tracking-wide"
            style={{
              color: "rgba(212,168,71,0.85)",
              fontFamily: "'Amiri', 'Scheherazade New', 'Traditional Arabic', serif"
            }}
          >
            صَدَقَ اللَّهُ الْعَظِيمُ
          </p>
        </div>
      </motion.div>

      {/* ── Logo & Title ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, type: "spring", bounce: 0.4 }}
        className="text-center px-4 py-4"
      >
        {/* Ornamental circle */}
        <div
          className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-5 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(212,168,71,0.25) 0%, rgba(212,168,71,0.08) 100%)",
            border: "2px solid rgba(212,168,71,0.5)",
            boxShadow: "0 0 40px rgba(212,168,71,0.25), inset 0 0 20px rgba(212,168,71,0.08)"
          }}
        >
          <span style={{ fontSize: "3.5rem", filter: "drop-shadow(0 0 12px rgba(212,168,71,0.6))" }}>🕌</span>
        </div>

        <h1
          className="text-5xl md:text-6xl font-black mb-2 tracking-wide"
          style={{
            fontFamily: "'Amiri', 'Scheherazade New', 'Traditional Arabic', serif",
            background: "linear-gradient(135deg, #f5c842 0%, #d4a847 50%, #f0d080 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
            filter: "drop-shadow(0 2px 8px rgba(212,168,71,0.4))"
          }}
        >
          مسابقة إسلامية
        </h1>
        <p className="text-base font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
          اختبر علمك ونافس أصدقاءك
        </p>
      </motion.div>

      {/* ── Mode Buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="w-full max-w-md px-5 pb-4 space-y-4"
      >
        {/* Solo */}
        <Link href="/solo" className="block group">
          <motion.div
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="relative rounded-3xl p-6 cursor-pointer overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.22) 0%, rgba(5,150,105,0.12) 100%)",
              border: "1.5px solid rgba(16,185,129,0.4)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
              style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, transparent 100%)" }} />
            <div className="relative flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.4) 0%, rgba(5,150,105,0.2) 100%)", border: "1px solid rgba(16,185,129,0.5)" }}>
                <User className="w-7 h-7" style={{ color: "#34d399" }} />
              </div>
              <div className="flex-1 text-right">
                <h2 className="text-xl font-black mb-0.5" style={{ color: "#f0fdf4" }}>سؤال وسؤال</h2>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>العب بمفردك واختبر معلوماتك</p>
              </div>
              <div className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                style={{ background: "rgba(16,185,129,0.2)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}>
                بدون نت
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Friend */}
        <Link href="/friend" className="block group">
          <motion.div
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="relative rounded-3xl p-6 cursor-pointer overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(212,168,71,0.22) 0%, rgba(180,130,40,0.12) 100%)",
              border: "1.5px solid rgba(212,168,71,0.4)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
              style={{ background: "linear-gradient(135deg, rgba(212,168,71,0.12) 0%, transparent 100%)" }} />
            <div className="relative flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(212,168,71,0.4) 0%, rgba(180,130,40,0.2) 100%)", border: "1px solid rgba(212,168,71,0.5)" }}>
                <Users className="w-7 h-7" style={{ color: "#fbbf24" }} />
              </div>
              <div className="flex-1 text-right">
                <h2 className="text-xl font-black mb-0.5" style={{ color: "#fffbeb" }}>العب مع صديق</h2>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>نافس أصدقاءك على نفس الجهاز أو أونلاين</p>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Online */}
        <Link href="/online" className="block group">
          <motion.div
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="relative rounded-3xl p-6 cursor-pointer overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.22) 0%, rgba(79,70,229,0.12) 100%)",
              border: "1.5px solid rgba(99,102,241,0.4)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
              style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, transparent 100%)" }} />
            <div className="relative flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(79,70,229,0.2) 100%)", border: "1px solid rgba(99,102,241,0.5)" }}>
                <Wifi className="w-7 h-7" style={{ color: "#a5b4fc" }} />
              </div>
              <div className="flex-1 text-right">
                <h2 className="text-xl font-black mb-0.5" style={{ color: "#eef2ff" }}>لعب أونلاين</h2>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>غرف مع الأصدقاء أو مباراة عشوائية</p>
              </div>
              <div className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}>
                جديد
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Arabesque bottom border */}
      <div className="w-full h-2 shrink-0" style={{ background: "linear-gradient(90deg, transparent, #d4a847, #f5c842, #d4a847, transparent)" }} />
    </div>
  );
}
