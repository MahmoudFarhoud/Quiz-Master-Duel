import { create } from 'zustand';
import { Question, quizQuestions } from '../data/questions';

export type PlayerColor = 'blue' | 'orange' | 'green';

export interface Player {
  id: string;
  name: string;
  score: number;
  color: PlayerColor;
  lifelines: {
    fifty: boolean;
    skip: boolean;
    time: boolean;
  };
}

interface GameState {
  mode: 'solo' | 'local' | 'online' | null;
  status: 'setup' | 'playing' | 'round_transition' | 'results';
  players: Player[];
  currentTurn: number;
  currentRound: number; // 0 = player1 round, 1 = player2 round (local mode)
  questions: Question[];
  currentQuestionIndex: number;
  roomCode: string | null;
  isHost: boolean;

  // Actions
  initSolo: (count: number, playerName?: string) => void;
  initLocal: (p1Name: string, p2Name: string, count: number, customQs: Question[]) => void;
  initOnline: (roomCode: string, isHost: boolean, players: Player[], questions: Question[]) => void;

  answerQuestion: (isCorrect: boolean) => void;
  useLifeline: (type: 'fifty' | 'skip' | 'time') => void;
  nextQuestion: () => void;
  startNextRound: () => void;
  endGame: () => void;
  reset: () => void;
}

const defaultLifelines = { fifty: true, skip: true, time: true };

const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const getRandomQuestions = (count: number, customQs: Question[] = []): Question[] => {
  const pool = shuffle([...quizQuestions]);
  const selected = pool.slice(0, Math.max(0, count - customQs.length));
  return shuffle([...customQs, ...selected]);
};

export const useGameStore = create<GameState>((set) => ({
  mode: null,
  status: 'setup',
  players: [],
  currentTurn: 0,
  currentRound: 0,
  questions: [],
  currentQuestionIndex: 0,
  roomCode: null,
  isHost: false,

  initSolo: (count: number, playerName = "أنت") => set({
    mode: 'solo',
    status: 'playing',
    players: [{ id: '1', name: playerName, score: 0, color: 'green', lifelines: { ...defaultLifelines } }],
    currentTurn: 0,
    currentRound: 0,
    questions: getRandomQuestions(count),
    currentQuestionIndex: 0,
  }),

  initLocal: (p1Name, p2Name, count, customQs) => set({
    mode: 'local',
    status: 'playing',
    players: [
      { id: '1', name: p1Name || "اللاعب 1", score: 0, color: 'blue', lifelines: { ...defaultLifelines } },
      { id: '2', name: p2Name || "اللاعب 2", score: 0, color: 'orange', lifelines: { ...defaultLifelines } }
    ],
    currentTurn: 0,
    currentRound: 0,
    questions: getRandomQuestions(count, customQs),
    currentQuestionIndex: 0,
  }),

  initOnline: (roomCode, isHost, players, questions) => set({
    mode: 'online',
    status: 'playing',
    roomCode,
    isHost,
    players,
    currentTurn: 0,
    currentRound: 0,
    questions,
    currentQuestionIndex: 0,
  }),

  answerQuestion: (isCorrect: boolean) => set((state) => {
    const newPlayers = state.players.map((p, i) =>
      i === state.currentTurn ? { ...p, score: p.score + (isCorrect ? 1 : 0) } : p
    );
    return { players: newPlayers };
  }),

  nextQuestion: () => set((state) => {
    const nextIndex = state.currentQuestionIndex + 1;

    if (state.mode === 'local' && state.players.length > 1) {
      // Local 2-player: each player goes through ALL questions separately
      if (nextIndex >= state.questions.length) {
        if (state.currentRound === 0) {
          // Player 1 finished → transition to Player 2's turn
          return { status: 'round_transition', currentQuestionIndex: nextIndex };
        } else {
          // Player 2 finished → show results
          return { status: 'results' };
        }
      }
      return { currentQuestionIndex: nextIndex };
    }

    // Solo or online: single pass
    if (nextIndex >= state.questions.length) {
      return { status: 'results' };
    }
    return { currentQuestionIndex: nextIndex, currentTurn: state.players.length > 1 ? (state.currentTurn === 0 ? 1 : 0) : 0 };
  }),

  startNextRound: () => set((state) => ({
    status: 'playing',
    currentRound: 1,
    currentTurn: 1,
    currentQuestionIndex: 0,
    players: state.players.map((p, i) =>
      i === 1 ? { ...p, lifelines: { ...defaultLifelines } } : p
    ),
  })),

  useLifeline: (type) => set((state) => {
    const newPlayers = state.players.map((p, i) =>
      i === state.currentTurn ? { ...p, lifelines: { ...p.lifelines, [type]: false } } : p
    );
    return { players: newPlayers };
  }),

  endGame: () => set({ status: 'results' }),

  reset: () => set({
    mode: null,
    status: 'setup',
    players: [],
    currentTurn: 0,
    currentRound: 0,
    questions: [],
    currentQuestionIndex: 0,
    roomCode: null,
    isHost: false,
  })
}));
