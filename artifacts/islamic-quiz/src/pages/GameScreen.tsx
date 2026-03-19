import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useGameStore, PlayerColor } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { HelpCircle, Clock, FastForward, CheckCircle2, XCircle } from "lucide-react";
import { quizQuestions } from "@/data/questions";

const COLOR_MAP: Record<PlayerColor, string> = {
  blue: "from-blue-600 to-blue-900",
  orange: "from-orange-500 to-orange-800",
  green: "from-primary to-emerald-900",
};

export default function GameScreen() {
  const [, setLocation] = useLocation();
  const { status, players, currentTurn, questions, currentQuestionIndex, mode, answerQuestion, nextQuestion, useLifeline } = useGameStore();

  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  // Fallback if accessed directly
  useEffect(() => {
    if (status !== 'playing' || questions.length === 0) {
      // Temporary fallback for testing if refreshed
      useGameStore.getState().initSolo(10);
    }
  }, []);

  const currentQ = questions[currentQuestionIndex] || quizQuestions[0];
  const currentPlayer = players[currentTurn] || players[0];
  const is2Player = players.length > 1;

  useEffect(() => {
    if (showResult) return;
    
    if (timeLeft <= 0) {
      handleAnswer(null); // Time out
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult]);

  // Reset state on new question
  useEffect(() => {
    setTimeLeft(currentQ.duration_seconds || 10);
    setSelectedOption(null);
    setHiddenOptions([]);
    setShowResult(false);
  }, [currentQuestionIndex, currentQ]);

  const handleAnswer = (option: string | null) => {
    if (showResult) return;
    
    setSelectedOption(option);
    setShowResult(true);
    
    const isCorrect = option === currentQ.correct_answer;
    answerQuestion(isCorrect);

    setTimeout(() => {
      nextQuestion();
      if (useGameStore.getState().status === 'results') {
        setLocation("/results");
      }
    }, 2000);
  };

  const handleFiftyFifty = () => {
    if (!currentPlayer.lifelines.fifty) return;
    useLifeline('fifty');
    const wrongOptions = currentQ.options.filter(o => o !== currentQ.correct_answer);
    // Hide 2 random wrong options
    setHiddenOptions(wrongOptions.slice(0, 2));
  };

  const handleSkip = () => {
    if (!currentPlayer.lifelines.skip) return;
    useLifeline('skip');
    nextQuestion();
  };

  const handleAddTime = () => {
    if (!currentPlayer.lifelines.time) return;
    useLifeline('time');
    setTimeLeft(prev => prev + 10);
  };

  if (!currentPlayer) return null;

  return (
    <div className={`min-h-screen transition-colors duration-700 bg-gradient-to-br ${COLOR_MAP[currentPlayer.color]} p-4 md:p-8 flex flex-col text-white`}>
      
      {/* Header Bar */}
      <header className="flex justify-between items-center mb-8 bg-black/20 backdrop-blur-md rounded-2xl p-4 shadow-lg">
        <div className="font-bold text-lg">
          سؤال {currentQuestionIndex + 1} <span className="text-white/60">من {questions.length}</span>
        </div>
        
        {is2Player && (
          <div className="bg-white/10 px-6 py-2 rounded-xl text-xl font-display font-bold">
            دور: {currentPlayer.name}
          </div>
        )}

        <div className="flex gap-4">
          {players.map(p => (
            <div key={p.id} className={`text-center ${p.id !== currentPlayer.id ? 'opacity-50' : ''}`}>
              <div className="text-xs uppercase opacity-80">{p.name}</div>
              <div className="font-bold text-xl">{p.score}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
        
        {/* Timer */}
        <div className="relative w-24 h-24 mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" className="stroke-white/20" strokeWidth="8" fill="none" />
            <circle 
              cx="50" cy="50" r="45" 
              className={`timer-circle stroke-current ${timeLeft <= 3 ? 'text-red-500' : 'text-secondary'}`}
              strokeWidth="8" fill="none" 
              strokeDasharray="283" 
              strokeDashoffset={283 - (283 * timeLeft) / (currentQ.duration_seconds || 10)} 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold font-display">
            {timeLeft}
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl text-center min-h-[160px] flex items-center justify-center">
              <h2 className="text-2xl md:text-4xl font-display font-bold leading-relaxed shadow-sm">
                {currentQ.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((opt, i) => {
                const isHidden = hiddenOptions.includes(opt);
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correct_answer;
                
                let bgClass = "bg-white/10 hover:bg-white/20 border-white/20";
                let icon = null;

                if (showResult) {
                  if (isCorrect) {
                    bgClass = "bg-green-500 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]";
                    icon = <CheckCircle2 className="w-6 h-6 ml-2" />;
                  } else if (isSelected && !isCorrect) {
                    bgClass = "bg-red-500 border-red-400";
                    icon = <XCircle className="w-6 h-6 ml-2" />;
                  } else {
                    bgClass = "bg-white/5 border-white/10 opacity-50";
                  }
                }

                if (isHidden) return <div key={i} className="h-16" />; // Keep spacing

                return (
                  <button
                    key={i}
                    disabled={showResult}
                    onClick={() => handleAnswer(opt)}
                    className={`h-16 md:h-20 rounded-2xl border-2 text-lg md:text-xl font-bold transition-all duration-300 flex items-center justify-center px-6 ${bgClass}`}
                  >
                    {icon}
                    {opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Lifelines Footer */}
      <footer className="mt-8 flex justify-center gap-4">
        <button 
          onClick={handleFiftyFifty}
          disabled={showResult || !currentPlayer.lifelines.fifty}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 border border-white/20 flex flex-col items-center justify-center transition-all"
        >
          <HelpCircle className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">50:50</span>
        </button>
        <button 
          onClick={handleSkip}
          disabled={showResult || !currentPlayer.lifelines.skip}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 border border-white/20 flex flex-col items-center justify-center transition-all"
        >
          <FastForward className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">تخطي</span>
        </button>
        <button 
          onClick={handleAddTime}
          disabled={showResult || !currentPlayer.lifelines.time}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 border border-white/20 flex flex-col items-center justify-center transition-all"
        >
          <Clock className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">+10ث</span>
        </button>
      </footer>
    </div>
  );
}
