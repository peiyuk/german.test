import { UserProgress } from '@/data/types';

const STORAGE_KEY = 'german_learning_progress';

const defaultProgress: UserProgress = {
  completedLessons: [],
  practicedPhonemes: {},
  dailyXP: {},
  totalXP: 0,
  streak: 0,
  lastStudied: null,
  dailyGoal: 100,
  practiceScores: {},
};

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(stored) };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getTodayXP(progress: UserProgress): number {
  return progress.dailyXP[getTodayKey()] ?? 0;
}

export function addXP(amount: number): UserProgress {
  const progress = getProgress();
  const today = getTodayKey();
  const todayXP = (progress.dailyXP[today] ?? 0) + amount;
  const newProgress: UserProgress = {
    ...progress,
    dailyXP: { ...progress.dailyXP, [today]: todayXP },
    totalXP: progress.totalXP + amount,
  };
  saveProgress(newProgress);
  return newProgress;
}

export function completeLesson(lessonId: string, xp: number): UserProgress {
  const progress = getProgress();
  if (progress.completedLessons.includes(lessonId)) return progress;
  const today = getTodayKey();
  const todayXP = (progress.dailyXP[today] ?? 0) + xp;

  // Update streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split('T')[0];
  const streak =
    progress.lastStudied === today
      ? progress.streak
      : progress.lastStudied === yesterdayKey
        ? progress.streak + 1
        : 1;

  const newProgress: UserProgress = {
    ...progress,
    completedLessons: [...progress.completedLessons, lessonId],
    dailyXP: { ...progress.dailyXP, [today]: todayXP },
    totalXP: progress.totalXP + xp,
    streak,
    lastStudied: today,
  };
  saveProgress(newProgress);
  return newProgress;
}

export function recordPractice(
  phonemeId: string,
  score: number
): UserProgress {
  const progress = getProgress();
  const existing = progress.practiceScores[phonemeId] ?? [];
  const practicedCount = (progress.practicedPhonemes[phonemeId] ?? 0) + 1;
  const xpEarned = score >= 80 ? 10 : score >= 50 ? 5 : 2;
  const today = getTodayKey();
  const todayXP = (progress.dailyXP[today] ?? 0) + xpEarned;

  const newProgress: UserProgress = {
    ...progress,
    practicedPhonemes: {
      ...progress.practicedPhonemes,
      [phonemeId]: practicedCount,
    },
    practiceScores: {
      ...progress.practiceScores,
      [phonemeId]: [...existing.slice(-9), score],
    },
    dailyXP: { ...progress.dailyXP, [today]: todayXP },
    totalXP: progress.totalXP + xpEarned,
    lastStudied: today,
  };
  saveProgress(newProgress);
  return newProgress;
}

export function setDailyGoal(goal: number): UserProgress {
  const progress = getProgress();
  const newProgress = { ...progress, dailyGoal: goal };
  saveProgress(newProgress);
  return newProgress;
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
