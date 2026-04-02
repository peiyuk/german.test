import { UserProgress } from '@/data/types';
import { createClient } from '@/lib/supabase';

const STORAGE_KEY = 'german_learning_progress';

export const defaultProgress: UserProgress = {
  completedLessons: [],
  practicedPhonemes: {},
  dailyXP: {},
  totalXP: 0,
  streak: 0,
  lastStudied: null,
  dailyGoal: 100,
  practiceScores: {},
};

// ── Local storage helpers (guest / offline fallback) ──────────────────────────

function getLocal(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultProgress, ...JSON.parse(stored) } : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

function saveLocal(p: UserProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

async function getSupabaseProgress(userId: string): Promise<UserProgress> {
  const supabase = createClient();
  const { data } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (!data) return defaultProgress;
  return {
    completedLessons: data.completed_lessons ?? [],
    practicedPhonemes: data.practiced_phonemes ?? {},
    dailyXP: data.daily_xp ?? {},
    totalXP: data.total_xp ?? 0,
    streak: data.streak ?? 0,
    lastStudied: data.last_studied ?? null,
    dailyGoal: data.daily_goal ?? 100,
    practiceScores: data.practice_scores ?? {},
  };
}

async function saveSupabaseProgress(userId: string, p: UserProgress): Promise<void> {
  const supabase = createClient();
  await supabase.from('user_progress').upsert({
    user_id: userId,
    completed_lessons: p.completedLessons,
    practiced_phonemes: p.practicedPhonemes,
    daily_xp: p.dailyXP,
    total_xp: p.totalXP,
    streak: p.streak,
    last_studied: p.lastStudied,
    daily_goal: p.dailyGoal,
    practice_scores: p.practiceScores,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
}

// ── Public API (auto-detects auth state) ─────────────────────────────────────

export async function getProgress(userId?: string | null): Promise<UserProgress> {
  if (userId) return getSupabaseProgress(userId);
  return getLocal();
}

export async function saveProgress(p: UserProgress, userId?: string | null): Promise<void> {
  if (userId) await saveSupabaseProgress(userId, p);
  saveLocal(p);
}

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getTodayXP(progress: UserProgress): number {
  return progress.dailyXP[getTodayKey()] ?? 0;
}

export async function completeLesson(lessonId: string, xp: number, userId?: string | null): Promise<UserProgress> {
  const progress = await getProgress(userId);
  if (progress.completedLessons.includes(lessonId)) return progress;
  const today = getTodayKey();
  const todayXP = (progress.dailyXP[today] ?? 0) + xp;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split('T')[0];
  const streak =
    progress.lastStudied === today
      ? progress.streak
      : progress.lastStudied === yesterdayKey
        ? progress.streak + 1
        : 1;

  const updated: UserProgress = {
    ...progress,
    completedLessons: [...progress.completedLessons, lessonId],
    dailyXP: { ...progress.dailyXP, [today]: todayXP },
    totalXP: progress.totalXP + xp,
    streak,
    lastStudied: today,
  };
  await saveProgress(updated, userId);
  return updated;
}

export async function recordPractice(phonemeId: string, score: number, userId?: string | null): Promise<UserProgress> {
  const progress = await getProgress(userId);
  const existing = progress.practiceScores[phonemeId] ?? [];
  const practicedCount = (progress.practicedPhonemes[phonemeId] ?? 0) + 1;
  const xpEarned = score >= 80 ? 10 : score >= 50 ? 5 : 2;
  const today = getTodayKey();
  const todayXP = (progress.dailyXP[today] ?? 0) + xpEarned;

  const updated: UserProgress = {
    ...progress,
    practicedPhonemes: { ...progress.practicedPhonemes, [phonemeId]: practicedCount },
    practiceScores: { ...progress.practiceScores, [phonemeId]: [...existing.slice(-9), score] },
    dailyXP: { ...progress.dailyXP, [today]: todayXP },
    totalXP: progress.totalXP + xpEarned,
    lastStudied: today,
  };
  await saveProgress(updated, userId);
  return updated;
}

export async function setDailyGoal(goal: number, userId?: string | null): Promise<UserProgress> {
  const progress = await getProgress(userId);
  const updated = { ...progress, dailyGoal: goal };
  await saveProgress(updated, userId);
  return updated;
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// ── Vowel mastery helpers ─────────────────────────────────────────────────────

export const BASIC_VOWEL_IDS = ['A', 'E', 'I', 'O', 'U'] as const;
const VOWEL_MASTERY_MIN_ATTEMPTS = 2;
const VOWEL_MASTERY_MIN_AVG = 70;

export function isVowelMastered(progress: UserProgress, phonemeId: string): boolean {
  const scores = progress.practiceScores[phonemeId] ?? [];
  if (scores.length < VOWEL_MASTERY_MIN_ATTEMPTS) return false;
  const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
  return avg >= VOWEL_MASTERY_MIN_AVG;
}

export function areBasicVowelsMastered(progress: UserProgress): boolean {
  return BASIC_VOWEL_IDS.every((id) => isVowelMastered(progress, id));
}

export function getVowelMasteryStatus(progress: UserProgress): Record<string, 'mastered' | 'in-progress' | 'not-started'> {
  return Object.fromEntries(
    BASIC_VOWEL_IDS.map((id) => {
      const count = progress.practicedPhonemes[id] ?? 0;
      if (isVowelMastered(progress, id)) return [id, 'mastered'];
      if (count > 0) return [id, 'in-progress'];
      return [id, 'not-started'];
    })
  );
}
