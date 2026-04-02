export interface PhonemeExample {
  word: string;
  meaning: string;
  ipa: string;
}

export interface Phoneme {
  id: string;
  symbol: string;
  name: string;
  description: string;
  tip: string;
  examples: PhonemeExample[];
  audioHint: string; // English approximation
  soundSample: string; // Minimal sound for single-phoneme practice (e.g. "a", "ei", "ach")
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  level: 'beginner' | 'elementary' | 'intermediate';
  category: 'alphabet' | 'vowels' | 'consonants' | 'umlauts' | 'diphthongs' | 'special';
  description: string;
  phonemes: Phoneme[];
  xp: number; // XP reward for completing
}

export interface UserProgress {
  completedLessons: string[];
  practicedPhonemes: Record<string, number>; // phonemeId -> times practiced
  dailyXP: Record<string, number>; // date string -> XP earned
  totalXP: number;
  streak: number;
  lastStudied: string | null;
  dailyGoal: number; // XP target per day
  practiceScores: Record<string, number[]>; // phonemeId -> array of scores
}

export interface PracticeResult {
  phonemeId: string;
  score: number; // 0-100
  timestamp: number;
  recognized: string;
  target: string;
}
