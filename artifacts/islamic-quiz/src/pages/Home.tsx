import { motion } from "framer-motion";
import { Link } from "wouter";
import { User, Users, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden p-6">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{ 
          backgroundImage: `url(${import.meta.env.BASE_URL}images/islamic-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background z-0" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center mb-12"
      >
        <div className="w-32 h-32 mx-auto mb-6 bg-primary/10 rounded-full p-4 golden-glow">
          <img 
            src={`${import.meta.env.BASE_URL}images/logo.png`} 
            alt="شعار اللعبة" 
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-display text-primary dark:text-primary-foreground mb-4 drop-shadow-sm">
          مسابقة إسلامية
        </h1>
        <p className="text-lg text-muted-foreground font-medium max-w-md mx-auto">
          اختبر معلوماتك الدينية ونافس أصدقاءك في أجواء من المتعة والفائدة
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md space-y-6 z-10"
      >
        <Link href="/solo" className="block group">
          <div className="relative glass-panel rounded-3xl p-8 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 border-2 border-transparent group-hover:border-primary/20 text-center cursor-pointer overflow-hidden">
            <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
              <WifiOff className="w-3 h-3" /> بدون نت
            </div>
            <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">سؤال وسؤال</h2>
            <p className="text-muted-foreground text-sm">العب بمفردك واختبر معلوماتك الشخصية</p>
          </div>
        </Link>

        <Link href="/friend" className="block group">
          <div className="glass-panel rounded-3xl p-8 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 border-2 border-transparent group-hover:border-secondary/30 text-center cursor-pointer">
            <div className="w-16 h-16 mx-auto bg-secondary/20 text-secondary-foreground rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">العب مع صديق</h2>
            <p className="text-muted-foreground text-sm">نافس أصدقاءك على نفس الجهاز أو أونلاين</p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
