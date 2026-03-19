import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Smartphone, Globe } from "lucide-react";

export default function FriendMode() {
  return (
    <div className="min-h-screen bg-background p-6 flex flex-col max-w-4xl mx-auto">
      <div className="flex items-center mb-10 pt-4">
        <Link href="/" className="p-3 bg-card border rounded-2xl hover:bg-muted transition-colors mr-auto">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-display font-bold text-primary flex-1 text-center ml-12">
          العب مع صديق
        </h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-6 mt-12"
      >
        <Link href="/local" className="flex-1 block group">
          <div className="h-full bg-card rounded-3xl p-8 border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center cursor-pointer border-transparent hover:border-primary/20">
            <div className="w-20 h-20 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Smartphone className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">محلي</h2>
            <p className="text-muted-foreground text-lg">العب مع صديقك على نفس الجهاز والتناوب على الإجابة.</p>
          </div>
        </Link>

        <Link href="/online" className="flex-1 block group">
          <div className="h-full bg-card rounded-3xl p-8 border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center cursor-pointer border-transparent hover:border-secondary/30 relative overflow-hidden">
             <div className="w-20 h-20 mx-auto bg-secondary/20 text-secondary-foreground rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">أون لاين</h2>
            <p className="text-muted-foreground text-lg">العب مع أصدقائك عن بعد أو ابحث عن منافسين عبر الإنترنت.</p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
