import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useGameStore, PlayerColor } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { HelpCircle, Clock, FastForward, CheckCircle2, XCircle, Play, Users, CheckCheck, Loader2 } from "lucide-react";
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

const AVATAR_COLORS = ['#3b82f6','#f97316','#10b981','#a855f7','#ef4444','#06b6d4','#ec4899','#eab308'];

export default function GameScreen() {
  const [, setLocation] = useLocation();
  const {
    status, players, onlinePlayers, currentTurn, questions, currentQuestionIndex,
    mode, answerQuestion, nextQuestion, useLifeline, startNextRound,
    myPlayerId, roomCode, myPlayerName, isHost,
    updateOnlineScore, markOnlineFinished,
  } = useGameStore();

  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    correctAudioRef.current = new Audio(import.meta.env.BASE_URL + "correct.mp3");
    wrongAudioRef.current = new Audio(import.meta.env.BASE_URL + "wrong.mp3");
    timerAudioRef.current = new Audio(import.meta.env.BASE_URL + "timer.mp3");
    timerAudioRef.current.loop = true;
    return () => {
      timerAudioRef.current?.pause();
    };
  }, []);

  const stopTimer = () => {
    if (timerAudioRef.current) {
      timerAudioRef.current.pause();
      timerAudioRef.current.currentTime = 0;
    }
  };

  const { emit, on } = useWebSocket(
    mode === 'online' ? roomCode : null,
    myPlayerId,
    myPlayerName,
    isHost
  );

  useEffect(() => {
    if (mode !== 'online') return;
    on("score_update", (msg) => {
      updateOnlineScore(msg.playerId, msg.score);
    });
    on("player_finished", (msg) => {
      markOnlineFinished(msg.playerId, msg.finalScore ?? 0);
    });
  }, [mode]);

  useEffect(() => {
    if (status === 'setup' || questions.length === 0) {
      useGameStore.getState().initSolo(10);
    }
  }, []);

  useEffect(() => {
    if (status === 'results') {
      setLocation("/results");
    }
  }, [status]);

  const currentQ = questions[currentQuestionIndex] ?? quizQuestions[0];
  const currentPlayer = players[currentTurn] ?? players[0];
  const isLocalMode = mode === 'local';
  const isOnlineMode = mode === 'online';

  useEffect(() => {
    setTimeLeft(currentQ?.duration_seconds || 10);
    setSelectedOption(null);
    setHiddenOptions([]);
    setShowResult(false);
    // Start timer sound for each new question
    if (timerAudioRef.current && status === 'playing') {
      timerAudioRef.current.currentTime = 0;
      timerAudioRef.current.play().catch(() => {});
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (showResult || status === 'round_transition' || status === 'waiting_for_others') return;
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

    // Stop timer sound
    stopTimer();

    // Play sound based on answer
    if (isCorrect && correctAudioRef.current) {
      correctAudioRef.current.currentTime = 0;
      correctAudioRef.current.play().catch(() => {});
    } else if (!isCorrect && option !== null && wrongAudioRef.current) {
      wrongAudioRef.current.currentTime = 0;
      wrongAudioRef.current.play().catch(() => {});
    }

    if (isOnlineMode && myPlayerId) {
      const store = useGameStore.getState();
      const myP = store.onlinePlayers.find(p => p.id === myPlayerId);
      const newScore = (myP?.score ?? 0) + (isCorrect ? 1 : 0);
      emit({ type: "score_update", playerId: myPlayerId, score: newScore });
    }

    setTimeout(() => {
      if (isOnlineMode && currentQuestionIndex + 1 >= questions.length) {
        const store = useGameStore.getState();
        const myP = store.onlinePlayers.find(p => p.id === myPlayerId);
        const finalScore = myP?.score ?? 0;
        emit({ type: "player_finished", playerId: myPlayerId, finalScore });
        markOnlineFinished(myPlayerId!, finalScore);
        nextQuestion();
      } else {
        nextQuestion();
      }
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
    stopTimer();
    nextQuestion();
  };

  const handleAddTime = () => {
    if (!currentPlayer?.lifelines.time) return;
    useLifeline('time');
    setTimeLeft(prev => prev + 10);
  };

  if (!currentPlayer) return null;

  // ── Round Transition Screen (Local) ──
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

  // ── Waiting for Others Screen (Online) ──
  if (status === 'waiting_for_others') {
    const myOnlinePlayer = onlinePlayers.find(p => p.id === myPlayerId);
    const finishedCount = onlinePlayers.filter(p => p.finished).length;
    const totalCount = onlinePlayers.length;

    return (
      <div className={`min-h-screen bg-gradient-to-br ${COLOR_MAP[myOnlinePlayer?.color ?? 'green']} flex flex-col items-center justify-center text-white p-6`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="w-full max-w-md"
        >
          {/* My result */}
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">✅</div>
            <h1 className="text-3xl font-black mb-2">انتهيت!</h1>
            <div className="bg-white/20 rounded-2xl px-8 py-4 inline-block">
              <span className="text-xl font-bold">نتيجتك: </span>
              <span className="text-4xl font-black">{myOnlinePlayer?.score ?? 0}</span>
              <span className="text-lg opacity-70"> / {questions.length}</span>
            </div>
          </div>

          {/* Waiting status */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5" /> حالة اللاعبين
              </h2>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                {finishedCount} / {totalCount} انتهوا
              </span>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {onlinePlayers
                  .slice()
                  .sort((a, b) => (b.finished ? 1 : 0) - (a.finished ? 1 : 0))
                  .map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-3 rounded-2xl p-4 ${p.finished ? 'bg-green-500/30 border border-green-400/40' : 'bg-white/10 border border-white/10'}`}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
                      style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                    >
                      {p.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate flex items-center gap-1">
                        {p.name}
                        {p.id === myPlayerId && <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full font-normal">أنت</span>}
                      </div>
                      {p.finished && (
                        <div className="text-sm opacity-80">{p.score} نقطة</div>
                      )}
                    </div>
                    <div className="shrink-0">
                      {p.finished ? (
                        <CheckCheck className="w-5 h-5 text-green-300" />
                      ) : (
                        <Loader2 className="w-5 h-5 animate-spin opacity-60" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {finishedCount < totalCount && (
              <p className="text-center text-white/60 text-sm mt-4">
                في انتظار {totalCount - finishedCount} لاعب...
              </p>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const totalDuration = currentQ?.duration_seconds || 10;
  const timerPercent = timeLeft / totalDuration;
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
          {scoreboardPlayers.map(p => (
            <div key={p.id} className={`text-center transition-opacity ${!isLocalMode || (p as any).id === currentPlayer.id ? '' : 'opacity-40'}`}>
              <div className="text-xs opacity-70 mb-0.5 max-w-[60px] truncate">{p.name}</div>
              <div className="font-black text-2xl">{p.score}</div>
            </div>
          ))}
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
