import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { ArrowRight, Play, Plus, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameStore } from "@/lib/store";
import { CustomQuestionModal } from "@/components/CustomQuestionModal";
import { Question } from "@/data/questions";

const COUNTS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

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
    <div className="min-h-screen bg-background p-6 flex flex-col max-w-4xl mx-auto">
      <CustomQuestionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={(q) => setCustomQuestions(prev => [...prev, q])} 
      />

      <div className="flex items-center mb-6 pt-4">
        <Link href="/friend" className="p-3 bg-card border rounded-2xl hover:bg-muted transition-colors mr-auto">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-display font-bold text-primary flex-1 text-center ml-12">
          لعب محلي
        </h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col space-y-6"
      >
        <div className="bg-card rounded-3xl p-6 md:p-8 border shadow-sm">
          <h2 className="text-lg font-bold mb-4">أسماء اللاعبين</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2 text-blue-600 font-bold">اللاعب الأول (أزرق)</label>
              <Input placeholder="اسم اللاعب الأول" value={p1Name} onChange={e => setP1Name(e.target.value)} className="border-blue-200 focus-visible:ring-blue-100" />
            </div>
            <div>
              <label className="block text-sm mb-2 text-green-600 font-bold">اللاعب الثاني (أخضر)</label>
              <Input placeholder="اسم اللاعب الثاني" value={p2Name} onChange={e => setP2Name(e.target.value)} className="border-green-200 focus-visible:ring-green-100" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 md:p-8 border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">إعدادات الأسئلة</h2>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 ml-1" /> أضف سؤال مخصص
            </Button>
          </div>
          
          {customQuestions.length > 0 && (
            <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-primary" />
                <span className="font-bold text-primary">الأسئلة المخصصة المضافة:</span>
              </div>
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold">{customQuestions.length}</span>
            </div>
          )}

          <h3 className="text-sm font-bold mb-4 text-muted-foreground">إجمالي الأسئلة المطلوبة</h3>
          <div className="grid grid-cols-5 gap-3 mb-8">
            {COUNTS.map((num) => (
              <button
                key={num}
                onClick={() => setSelectedCount(num)}
                className={`h-12 rounded-xl text-lg font-bold transition-all duration-200 ${
                  selectedCount === num 
                    ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                    : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <Button 
            size="lg" 
            className="w-full h-16 text-xl rounded-2xl" 
            disabled={!selectedCount}
            onClick={handleStart}
          >
            <Play className="w-6 h-6 ml-2" />
            ابدأ التحدي
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
