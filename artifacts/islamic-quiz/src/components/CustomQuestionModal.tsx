import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Question } from "@/data/questions";

interface CustomQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (q: Question) => void;
}

export function CustomQuestionModal({ isOpen, onClose, onAdd }: CustomQuestionModalProps) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  const handleSave = () => {
    if (!questionText.trim() || options.some(o => !o.trim())) {
      alert("الرجاء ملء جميع الحقول");
      return;
    }

    const newQ: Question = {
      id: Date.now(),
      category: "مخصص",
      difficulty: "مخصص",
      question: questionText,
      options: [...options],
      correct_answer: options[correctIndex],
      duration_seconds: 10
    };

    onAdd(newQ);
    
    // Reset
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-6 md:p-8 border border-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display text-primary">أضف سؤال مخصص</h2>
                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-foreground">السؤال</label>
                  <Input 
                    value={questionText} 
                    onChange={e => setQuestionText(e.target.value)} 
                    placeholder="اكتب سؤالك هنا..."
                    className="text-lg py-6"
                  />
                </div>

                <div className="space-y-3 mt-6">
                  <label className="block text-sm font-bold text-foreground">الخيارات (اختر الإجابة الصحيحة)</label>
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <button 
                        onClick={() => setCorrectIndex(i)}
                        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${correctIndex === i ? 'bg-success border-success text-white' : 'border-muted-foreground/30 hover:border-success/50'}`}
                      >
                        {correctIndex === i && <Check className="w-5 h-5" />}
                      </button>
                      <Input 
                        value={opt} 
                        onChange={e => {
                          const newOpts = [...options];
                          newOpts[i] = e.target.value;
                          setOptions(newOpts);
                        }} 
                        placeholder={`الخيار ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <Button onClick={handleSave} className="w-full mt-8" size="lg">
                  <Plus className="w-5 h-5 ml-2" />
                  حفظ وإضافة
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
