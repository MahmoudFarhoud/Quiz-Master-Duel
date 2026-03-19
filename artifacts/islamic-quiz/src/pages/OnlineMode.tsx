import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Home, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OnlineMode() {
  return (
    <div className="min-h-screen bg-background p-6 flex flex-col max-w-4xl mx-auto">
      <div className="flex items-center mb-10 pt-4">
        <Link href="/friend" className="p-3 bg-card border rounded-2xl hover:bg-muted transition-colors mr-auto">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-display font-bold text-primary flex-1 text-center ml-12">
          أون لاين
        </h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 mt-4"
      >
        <Link href="/online/host" className="block group">
          <div className="bg-card rounded-3xl p-6 flex items-center gap-6 border shadow-sm hover:shadow-md transition-all hover:border-primary/30">
             <div className="w-16 h-16 shrink-0 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Home className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold mb-1">إنشاء غرفة</h2>
              <p className="text-muted-foreground">أنشئ غرفة وشارك الكود مع صديقك ليلعب معك</p>
            </div>
          </div>
        </Link>

        <Link href="/online/join" className="block group">
          <div className="bg-card rounded-3xl p-6 flex items-center gap-6 border shadow-sm hover:shadow-md transition-all hover:border-secondary/30">
             <div className="w-16 h-16 shrink-0 bg-secondary/20 text-secondary-foreground rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold mb-1">انضم لغرفة</h2>
              <p className="text-muted-foreground">أدخل الكود الذي أرسله صديقك لتنضم إليه</p>
            </div>
          </div>
        </Link>

        <Link href="/online/matchmaking" className="block group">
          <div className="bg-card rounded-3xl p-6 flex items-center gap-6 border shadow-sm hover:shadow-md transition-all hover:border-purple-500/30">
             <div className="w-16 h-16 shrink-0 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold mb-1">بحث عشوائي</h2>
              <p className="text-muted-foreground">ابحث عن منافس متصل الآن للعب مباشرة</p>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
