import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useGameStore, PlayerColor } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { HelpCircle, Clock, FastForward, CheckCircle2, XCircle, Play, Users } from "lucide-react";
import { quizQuestions } from "@/data/questions";
import { useWebSocket } from "@/hooks/use-websocket";

const COLOR_MAP: Record<PlayerColor, string> = {
  blue: "from-blue-600 to-blue-900",
  orange: "from-orange-500 to-orange-800",
  green: "from-emerald-600 to-emerald-900",
  purple: "from-purple-600 to-purple-900",
  red: "from-red-600 to-red-900",
  cyan: "from-cyan-500 to-cyan-800",
  pink: "from-pink-500 to-pink-800",
  yellow: "from-yellow-500 to-yellow-800",
};

export default function GameScreen() {
  const [, setLocation] = useLocation();
  const {
    status, players, onlinePlayers, currentTurn, questions, currentQuestionIndex,
    mode, answerQuestion, nextQuestion, useLifeline, startNextRound,
    myPlayerId, roomCode, myPlayerName,
    updateOnlineScore, markOnlineFinished, endGame,
  } = useGameStore();

  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  // Online WebSocket
  const { emit, on } = useWebSocket(
    mode === 'online' ? roomCode : null,
    myPlayerId,
    myPlayerName
  );

  // Setup online WebSocket listeners
  useEffect(() => {
    if (mode !== 'online') return;
    on("score_update", (msg) => {
      updateOnlineScore(msg.playerId, msg.score);
    });
    on("player_finished", (msg) => {
      markOnlineFinished(msg.playerId);
    });
  }, [mode]);

  // Fallback if accessed directly with no game loaded
  useEffect(() => {
    if (status === 'setup' || questions.length === 0) {
      useGameStore.getState().initSolo(10);
    }
  }, []);

  // Handle navigation to results
  useEffect(() => {
    if (status === 'results') {
      setLocation("/results");
    }
  }, [status]);

  const currentQ = questions[currentQuestionIndex] ?? quizQuestions[0];
  const currentPlayer = players[currentTurn] ?? players[0];
  const isLocalMode = mode === 'local';
  const isOnlineMode = mode === 'online';

  // Reset state on new question
  useEffect(() => {
    setTimeLeft(currentQ?.duration_seconds || 10);
    setSelectedOption(null);
    setHiddenOptions([]);
    setShowResult(false);
  }, [currentQuestionIndex]);

  // Timer logic
  useEffect(() => {
    if (showResult || status === 'round_transition') return;
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResult, status]);

  const handleAnswer = (option: string | null) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);
    const isCorrect = option === currentQ.correct_answer;
    answerQuestion(isCorrect);

    // Online: broadcast score update
    if (isOnlineMode && myPlayerId) {
      const myOnlinePlayer = onlinePlayers.find(p => p.id === myPlayerId);
      const newScore = (myOnlinePlayer?.score ?? 0) + (isCorrect ? 1 : 0);
      emit({ type: "score_update", playerId: myPlayerId, score: newScore });
    }

    setTimeout(() => {
      const store = useGameStore.getState();
      // Check if this is the last question in online mode
      if (isOnlineMode && currentQuestionIndex + 1 >= questions.length) {
        const myOnlinePlayer = store.onlinePlayers.find(p => p.id === myPlayerId);
        emit({ type: "player_finished", playerId: myPlayerId, finalScore: myOnlinePlayer?.score ?? 0 });
      }
      nextQuestion();
    }, 1800);
  };

  const handleFiftyFifty = () => {
    if (!currentPlayer?.lifelines.fifty) return;
    useLifeline('fifty');
    const wrong = currentQ.options.filter(o => o !== currentQ.correct_answer);
    setHiddenOptions(wrong.slice(0, 2));
  };

  const handleSkip = () => {
    if (!currentPlayer?.lifelines.skip) return;
    useLifeline('skip');
    nextQuestion();
  };

  const handleAddTime = () => {
    if (!currentPlayer?.lifelines.time) return;
    useLifeline('time');
    setTimeLeft(prev => prev + 10);
  };

  if (!currentPlayer) return null;

  // ── Round Transition Screen (Local Mode) ──
  if (status === 'round_transition') {
    const nextPlayer = players[1];
    return (
      <div className={`min-h-screen bg-gradient-to-br ${COLOR_MAP[nextPlayer.color]} flex flex-col items-center justify-center text-white p-8`}>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="text-center max-w-xl"
        >
          <div className="text-8xl mb-6">🏆</div>
          <h2 className="text-3xl font-bold mb-2 opacity-80">انتهى دور</h2>
          <h1 className="text-5xl font-black mb-4">{players[0].name}</h1>
          <div className="bg-white/10 rounded-2xl px-8 py-4 mb-10 inline-block">
            <span className="text-2xl font-bold">نتيجته: </span>
            <span className="text-4xl font-black">{players[0].score}</span>
            <span className="text-xl opacity-70"> / {questions.length}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-8">
            <p className="text-xl mb-2 opacity-80">الآن دور</p>
            <h2 className="text-4xl font-black mb-1">{nextPlayer.name}</h2>
            <p className="opacity-70">نفس {questions.length} سؤال</p>
          </div>
          <Button size="lg" onClick={startNextRound}
            className="h-16 px-12 text-xl bg-white text-gray-900 hover:bg-white/90 rounded-2xl font-bold">
            <Play className="w-6 h-6 ml-2" />
            ابدأ دور {nextPlayer.name}
          </Button>
        </motion.div>
      </div>
    );
  }

  const totalDuration = currentQ?.duration_seconds || 10;
  const timerPercent = timeLeft / totalDuration;

  // Online: show live scoreboard in header
  const scoreboardPlayers = isOnlineMode ? onlinePlayers : players;

  return (
    <div className={`min-h-screen transition-colors duration-700 bg-gradient-to-br ${COLOR_MAP[currentPlayer.color]} p-4 md:p-8 flex flex-col text-white`}>

      {/* Header */}
      <header className="flex justify-between items-center mb-6 bg-black/20 backdrop-blur-md rounded-2xl p-4 shadow-lg gap-3 flex-wrap">
        <div className="font-bold text-lg shrink-0">
          {currentQuestionIndex + 1}
          <span className="text-white/60 font-normal"> / {questions.length}</span>
        </div>

        {isLocalMode && (
          <div className="bg-white/15 px-5 py-2 rounded-xl text-lg font-bold text-center">
            دور: {currentPlayer.name}
          </div>
        )}

        {isOnlineMode && (
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 opacity-70" />
            <span className="text-sm opacity-70">{onlinePlayers.length} لاعب</span>
          </div>
        )}

        <div className="flex gap-3 shrink-0 flex-wrap justify-end">
          {scoreboardPlayers.map(p => {
            const isMe = isOnlineMode ? p.id === myPlayerId : true;
            const score = p.score;
            const pName = p.name;
            return (
              <div key={p.id} className={`text-center transition-opacity ${!isLocalMode || (p as any).id === currentPlayer.id ? '' : 'opacity-40'}`}>
                <div className="text-xs opacity-70 mb-0.5 max-w-[60px] truncate">{pName}</div>
                <div className="font-black text-2xl">{score}</div>
              </div>
            );
          })}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
        {/* Timer */}
        <div className="relative w-24 h-24 mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" className="stroke-white/20" strokeWidth="8" fill="none" />
            <circle
              cx="50" cy="50" r="44"
              className={`transition-all ${timeLeft <= 3 ? 'stroke-red-400' : 'stroke-yellow-300'}`}
              strokeWidth="8" fill="none"
              strokeDasharray="276"
              strokeDashoffset={276 - 276 * timerPercent}
              strokeLinecap="round"
            />
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center text-3xl font-black ${timeLeft <= 3 ? 'text-red-300 animate-pulse' : ''}`}>
            {timeLeft}
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="w-full">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-6 shadow-2xl text-center min-h-[140px] flex items-center justify-center">
              <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">{currentQ.question}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((opt, i) => {
                const isHidden = hiddenOptions.includes(opt);
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correct_answer;
                if (isHidden) return <div key={i} className="h-16 md:h-20" />;

                let cls = "bg-white/10 hover:bg-white/25 border-white/30";
                let icon = null;
                if (showResult) {
                  if (isCorrect) { cls = "bg-green-500/90 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]"; icon = <CheckCircle2 className="w-6 h-6 ml-2 shrink-0" />; }
                  else if (isSelected) { cls = "bg-red-500/80 border-red-400"; icon = <XCircle className="w-6 h-6 ml-2 shrink-0" />; }
                  else { cls = "bg-white/5 border-white/10 opacity-40"; }
                }
                return (
                  <button key={i} disabled={showResult} onClick={() => handleAnswer(opt)}
                    className={`h-16 md:h-20 rounded-2xl border-2 text-lg md:text-xl font-bold transition-all duration-200 flex items-center justify-center px-6 ${cls}`}>
                    {icon}{opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Lifelines */}
      <footer className="mt-6 flex justify-center gap-4">
        {[
          { key: 'fifty', label: '50:50', icon: <HelpCircle className="w-6 h-6 mb-1" />, action: handleFiftyFifty, enabled: currentPlayer.lifelines.fifty },
          { key: 'skip', label: 'تخطي', icon: <FastForward className="w-6 h-6 mb-1" />, action: handleSkip, enabled: currentPlayer.lifelines.skip },
          { key: 'time', label: '+10ث', icon: <Clock className="w-6 h-6 mb-1" />, action: handleAddTime, enabled: currentPlayer.lifelines.time },
        ].map(({ key, label, icon, action, enabled }) => (
          <button key={key} onClick={action} disabled={showResult || !enabled}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed border border-white/20 flex flex-col items-center justify-center transition-all">
            {icon}
            <span className="text-[10px] font-bold">{label}</span>
          </button>
        ))}
      </footer>
    </div>
  );
}
