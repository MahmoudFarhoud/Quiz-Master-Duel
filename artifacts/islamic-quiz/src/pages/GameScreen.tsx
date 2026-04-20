import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useGameStore, PlayerColor } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { HelpCircle, Clock, RefreshCw, CheckCircle2, XCircle, Play, Users, CheckCheck, Loader2, LogOut } from "lucide-react";
import { quizQuestions } from "@/data/questions";
import { useWebSocket } from "@/hooks/use-websocket";

const COLOR_THEMES: Record<PlayerColor, {
  bg: string; orb1: string; orb2: string; orb3: string;
  accent: string; timerStroke: string; cardBorder: string;
  btnHover: string; correctGlow: string;
}> = {
  blue: {
    bg: "linear-gradient(135deg, #0f1b3d 0%, #1a3a7a 40%, #0d2557 100%)",
    orb1: "rgba(59,130,246,0.35)", orb2: "rgba(99,102,241,0.25)", orb3: "rgba(14,165,233,0.2)",
    accent: "#60a5fa", timerStroke: "#93c5fd", cardBorder: "rgba(96,165,250,0.3)",
    btnHover: "rgba(59,130,246,0.3)", correctGlow: "rgba(34,197,94,0.6)",
  },
  orange: {
    bg: "linear-gradient(135deg, #2d1200 0%, #7c2d12 40%, #431407 100%)",
    orb1: "rgba(249,115,22,0.4)", orb2: "rgba(234,88,12,0.25)", orb3: "rgba(251,191,36,0.2)",
    accent: "#fb923c", timerStroke: "#fdba74", cardBorder: "rgba(251,146,60,0.3)",
    btnHover: "rgba(249,115,22,0.3)", correctGlow: "rgba(34,197,94,0.6)",
  },
  green: {
    bg: "linear-gradient(135deg, #052e16 0%, #14532d 40%, #064e3b 100%)",
    orb1: "rgba(16,185,129,0.35)", orb2: "rgba(5,150,105,0.25)", orb3: "rgba(52,211,153,0.2)",
    accent: "#34d399", timerStroke: "#6ee7b7", cardBorder: "rgba(52,211,153,0.3)",
    btnHover: "rgba(16,185,129,0.3)", correctGlow: "rgba(52,211,153,0.7)",
  },
  purple: {
    bg: "linear-gradient(135deg, #1e0036 0%, #4c1d95 40%, #2e1065 100%)",
    orb1: "rgba(168,85,247,0.4)", orb2: "rgba(139,92,246,0.25)", orb3: "rgba(192,132,252,0.2)",
    accent: "#c084fc", timerStroke: "#d8b4fe", cardBorder: "rgba(192,132,252,0.3)",
    btnHover: "rgba(168,85,247,0.3)", correctGlow: "rgba(34,197,94,0.6)",
  },
  red: {
    bg: "linear-gradient(135deg, #2d0000 0%, #7f1d1d 40%, #450a0a 100%)",
    orb1: "rgba(239,68,68,0.4)", orb2: "rgba(220,38,38,0.25)", orb3: "rgba(252,165,165,0.2)",
    accent: "#f87171", timerStroke: "#fca5a5", cardBorder: "rgba(248,113,113,0.3)",
    btnHover: "rgba(239,68,68,0.3)", correctGlow: "rgba(34,197,94,0.6)",
  },
  cyan: {
    bg: "linear-gradient(135deg, #012030 0%, #0e7490 40%, #083344 100%)",
    orb1: "rgba(6,182,212,0.4)", orb2: "rgba(8,145,178,0.25)", orb3: "rgba(103,232,249,0.2)",
    accent: "#22d3ee", timerStroke: "#67e8f9", cardBorder: "rgba(34,211,238,0.3)",
    btnHover: "rgba(6,182,212,0.3)", correctGlow: "rgba(34,197,94,0.6)",
  },
  pink: {
    bg: "linear-gradient(135deg, #2d0027 0%, #831843 40%, #500724 100%)",
    orb1: "rgba(236,72,153,0.4)", orb2: "rgba(219,39,119,0.25)", orb3: "rgba(249,168,212,0.2)",
    accent: "#f472b6", timerStroke: "#f9a8d4", cardBorder: "rgba(244,114,182,0.3)",
    btnHover: "rgba(236,72,153,0.3)", correctGlow: "rgba(34,197,94,0.6)",
  },
  yellow: {
    bg: "linear-gradient(135deg, #1c1400 0%, #713f12 40%, #422006 100%)",
    orb1: "rgba(234,179,8,0.4)", orb2: "rgba(202,138,4,0.25)", orb3: "rgba(253,224,71,0.2)",
    accent: "#facc15", timerStroke: "#fde047", cardBorder: "rgba(250,204,21,0.3)",
    btnHover: "rgba(234,179,8,0.3)", correctGlow: "rgba(34,197,94,0.6)",
  },
};

const AVATAR_COLORS = ['#3b82f6','#f97316','#10b981','#a855f7','#ef4444','#06b6d4','#ec4899','#eab308'];

export default function GameScreen() {
  const [, setLocation] = useLocation();
  const {
    status, players, onlinePlayers, currentTurn, questions, currentQuestionIndex,
    mode, isFreePlay, answerQuestion, nextQuestion, useLifeline, startNextRound, endGame,
    myPlayerId, roomCode, myPlayerName, isHost,
    updateOnlineScore, markOnlineFinished,
  } = useGameStore();

  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerAudioRef = useRef<HTMLAudioElement | null>(null);
  const skipPendingRef = useRef(false);

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
    skipPendingRef.current = false;
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
    if (showResult || skipPendingRef.current) return;
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
      if (isFreePlay && !isCorrect) {
        endGame();
        return;
      }
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

  const handleExit = () => {
    stopTimer();
    correctAudioRef.current?.pause();
    wrongAudioRef.current?.pause();
    useGameStore.getState().reset();
    setLocation("/");
  };

  const handleFiftyFifty = () => {
    if (!currentPlayer?.lifelines.fifty) return;
    useLifeline('fifty');
    const wrong = currentQ.options.filter(o => o !== currentQ.correct_answer);
    setHiddenOptions(wrong.slice(0, 2));
  };

  const handleSkip = () => {
    if (!currentPlayer?.lifelines.skip) return;
    skipPendingRef.current = true;
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
    const nTheme = COLOR_THEMES[nextPlayer.color];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-8" style={{ background: nTheme.bg }}>
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
    const wTheme = COLOR_THEMES[myOnlinePlayer?.color ?? 'green'];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-6" style={{ background: wTheme.bg }}>
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
  const theme = COLOR_THEMES[currentPlayer.color];

  return (
    <div className="min-h-screen flex flex-col text-white relative overflow-hidden" style={{ background: theme.bg }}>

      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[100px]" style={{ background: theme.orb1 }} />
        <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full blur-[90px]" style={{ background: theme.orb2 }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px]" style={{ background: theme.orb3 }} />
      </div>

      <div className="relative z-10 flex flex-col flex-1 p-4 md:p-8">

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.35 }}
              className="rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
              style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: `1px solid ${theme.cardBorder}` }}
            >
              <div className="text-5xl mb-4">🚪</div>
              <h2 className="text-2xl font-black mb-2">خروج من الجولة؟</h2>
              <p className="text-white/60 mb-8 text-sm leading-relaxed">سيتم إنهاء اللعبة الحالية وستضيع نتيجتك</p>
              <div className="flex gap-3">
                <button onClick={() => setShowExitConfirm(false)}
                  className="flex-1 h-12 rounded-2xl font-bold text-base transition-all"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  استمر
                </button>
                <button onClick={handleExit}
                  className="flex-1 h-12 rounded-2xl font-bold text-base transition-all"
                  style={{ background: "rgba(239,68,68,0.7)", border: "1px solid rgba(239,68,68,0.5)" }}>
                  اخرج
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex justify-between items-center mb-6 rounded-2xl p-4 gap-3 flex-wrap"
        style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(12px)", border: `1px solid ${theme.cardBorder}` }}>
        <div className="font-bold text-lg shrink-0" style={{ color: theme.accent }}>
          {currentQuestionIndex + 1}
          <span className="text-white/50 font-normal"> / {questions.length}</span>
        </div>

        {isLocalMode && (
          <div className="px-5 py-2 rounded-xl text-lg font-bold text-center"
            style={{ background: "rgba(255,255,255,0.1)", border: `1px solid ${theme.cardBorder}` }}>
            دور: {currentPlayer.name}
          </div>
        )}

        {isOnlineMode && (
          <div className="flex items-center gap-1 opacity-70">
            <Users className="w-4 h-4" />
            <span className="text-sm">{onlinePlayers.length} لاعب</span>
          </div>
        )}

        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
          {scoreboardPlayers.map(p => (
            <div key={p.id} className={`text-center transition-opacity ${!isLocalMode || (p as any).id === currentPlayer.id ? '' : 'opacity-30'}`}>
              <div className="text-xs opacity-60 mb-0.5 max-w-[60px] truncate">{p.name}</div>
              <div className="font-black text-2xl" style={{ color: theme.accent }}>{p.score}</div>
            </div>
          ))}
          <button onClick={() => setShowExitConfirm(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 hover:opacity-80"
            style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)" }}
            title="خروج">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">

        {/* Timer */}
        <div className="relative w-28 h-28 mb-6">
          <div className="absolute inset-0 rounded-full blur-xl opacity-40" style={{ background: timeLeft <= 3 ? "rgba(239,68,68,0.8)" : theme.orb1 }} />
          <svg className="relative w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.1)" strokeWidth="7" fill="none" />
            <circle
              cx="50" cy="50" r="42"
              stroke={timeLeft <= 3 ? "#f87171" : theme.timerStroke}
              strokeWidth="7" fill="none"
              strokeDasharray="264"
              strokeDashoffset={264 - 264 * timerPercent}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${timeLeft <= 3 ? "#f87171" : theme.timerStroke})`, transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
            />
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center text-3xl font-black ${timeLeft <= 3 ? 'animate-pulse' : ''}`}
            style={{ color: timeLeft <= 3 ? "#fca5a5" : theme.timerStroke }}>
            {timeLeft}
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="w-full">

            <div className="rounded-3xl p-8 mb-6 shadow-2xl text-center min-h-[140px] flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(20px)",
                border: `1.5px solid ${theme.cardBorder}`,
                boxShadow: `0 0 40px ${theme.orb1}, inset 0 1px 0 rgba(255,255,255,0.1)`,
              }}>
              <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">{currentQ.question}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((opt, i) => {
                const isHidden = hiddenOptions.includes(opt);
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correct_answer;
                if (isHidden) return <div key={i} className="h-16 md:h-20" />;

                let bgStyle: React.CSSProperties = {
                  background: "rgba(255,255,255,0.07)",
                  border: `2px solid rgba(255,255,255,0.18)`,
                  boxShadow: "none",
                };
                let icon = null;

                if (showResult) {
                  if (isCorrect) {
                    bgStyle = {
                      background: "rgba(34,197,94,0.25)",
                      border: "2px solid rgba(34,197,94,0.7)",
                      boxShadow: `0 0 24px ${theme.correctGlow}`,
                    };
                    icon = <CheckCircle2 className="w-6 h-6 ml-3 shrink-0 text-green-300" />;
                  } else if (isSelected) {
                    bgStyle = {
                      background: "rgba(239,68,68,0.25)",
                      border: "2px solid rgba(239,68,68,0.7)",
                      boxShadow: "0 0 20px rgba(239,68,68,0.4)",
                    };
                    icon = <XCircle className="w-6 h-6 ml-3 shrink-0 text-red-300" />;
                  } else {
                    bgStyle = { background: "rgba(255,255,255,0.03)", border: "2px solid rgba(255,255,255,0.07)", opacity: 0.35 };
                  }
                }

                return (
                  <button key={i} disabled={showResult} onClick={() => handleAnswer(opt)}
                    className="h-16 md:h-20 rounded-2xl text-lg md:text-xl font-bold transition-all duration-200 flex items-center justify-center px-6 hover:scale-[1.02] active:scale-[0.98]"
                    style={bgStyle}
                    onMouseEnter={e => { if (!showResult) (e.currentTarget as HTMLButtonElement).style.background = theme.btnHover; }}
                    onMouseLeave={e => { if (!showResult) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)"; }}
                  >
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
          { key: 'skip', label: 'غيّر', icon: <RefreshCw className="w-6 h-6 mb-1" />, action: handleSkip, enabled: currentPlayer.lifelines.skip },
          { key: 'time', label: '+10ث', icon: <Clock className="w-6 h-6 mb-1" />, action: handleAddTime, enabled: currentPlayer.lifelines.time },
        ].map(({ key, label, icon, action, enabled }) => (
          <button key={key} onClick={action} disabled={showResult || !enabled}
            className="w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed"
            style={{
              background: enabled ? `rgba(255,255,255,0.1)` : "rgba(255,255,255,0.05)",
              border: `1.5px solid ${enabled ? theme.cardBorder : "rgba(255,255,255,0.1)"}`,
              backdropFilter: "blur(8px)",
              boxShadow: enabled ? `0 0 12px ${theme.orb3}` : "none",
            }}>
            {icon}
            <span className="text-[10px] font-bold">{label}</span>
          </button>
        ))}
      </footer>

      </div>
    </div>
  );
}
