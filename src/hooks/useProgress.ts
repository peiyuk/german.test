'use client';
import { useState, useEffect, useCallback } from 'react';
import { UserProgress } from '@/data/types';
import {
  getProgress,
  getTodayXP,
  completeLesson,
  recordPractice,
  setDailyGoal,
  defaultProgress,
} from '@/lib/storage';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    getProgress().then(setProgress);
  }, []);

  const markLessonComplete = useCallback(async (lessonId: string, xp: number) => {
    const updated = await completeLesson(lessonId, xp);
    setProgress(updated);
    return updated;
  }, []);

  const addPracticeScore = useCallback(async (phonemeId: string, score: number) => {
    const updated = await recordPractice(phonemeId, score);
    setProgress(updated);
    return updated;
  }, []);

  const updateDailyGoal = useCallback(async (goal: number) => {
    const updated = await setDailyGoal(goal);
    setProgress(updated);
  }, []);

  const currentProgress = progress ?? defaultProgress;
  const todayXP = getTodayXP(currentProgress);
  const dailyGoal = currentProgress.dailyGoal;
  const goalProgress = Math.min((todayXP / dailyGoal) * 100, 100);
  const goalReached = todayXP >= dailyGoal;

  return {
    progress,
    userId: null,
    todayXP,
    dailyGoal,
    goalProgress,
    goalReached,
    markLessonComplete,
    addPracticeScore,
    updateDailyGoal,
  };
}
