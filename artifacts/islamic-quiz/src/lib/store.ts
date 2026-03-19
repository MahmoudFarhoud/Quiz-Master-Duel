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
  status: 'setup' | 'playing' | 'results';
  players: Player[];
  currentTurn: number;
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
  endGame: () => void;
  reset: () => void;
}

const defaultLifelines = { fifty: true, skip: true, time: true };

// Helper to get random questions
const getRandomQuestions = (count: number, customQs: Question[] = []): Question[] => {
  const pool = [...quizQuestions];
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  
  const selected = pool.slice(0, Math.max(0, count - customQs.length));
  
  const combined = [...customQs, ...selected];
  // Shuffle combined again
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  
  return combined;
};

export const useGameStore = create<GameState>((set) => ({
  mode: null,
  status: 'setup',
  players: [],
  currentTurn: 0,
  questions: [],
  currentQuestionIndex: 0,
  roomCode: null,
  isHost: false,

  initSolo: (count: number, playerName = "أنت") => set({
    mode: 'solo',
    status: 'playing',
    players: [{ id: '1', name: playerName, score: 0, color: 'green', lifelines: { ...defaultLifelines } }],
    currentTurn: 0,
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
    questions,
    currentQuestionIndex: 0,
  }),

  answerQuestion: (isCorrect: boolean) => set((state) => {
    const newPlayers = [...state.players];
    if (isCorrect) {
      newPlayers[state.currentTurn].score += 1;
    }
    return { players: newPlayers };
  }),

  nextQuestion: () => set((state) => {
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex >= state.questions.length) {
      return { status: 'results' };
    }
    // Alternate turn
    const nextTurn = state.players.length > 1 ? (state.currentTurn === 0 ? 1 : 0) : 0;
    return { currentQuestionIndex: nextIndex, currentTurn: nextTurn };
  }),

  useLifeline: (type) => set((state) => {
    const newPlayers = [...state.players];
    newPlayers[state.currentTurn].lifelines[type] = false;
    return { players: newPlayers };
  }),

  endGame: () => set({ status: 'results' }),

  reset: () => set({
    mode: null,
    status: 'setup',
    players: [],
    currentTurn: 0,
    questions: [],
    currentQuestionIndex: 0,
    roomCode: null,
    isHost: false,
  })
}));
