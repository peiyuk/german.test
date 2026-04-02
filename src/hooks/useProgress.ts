'use client';
import { useState, useEffect, useCallback } from 'react';
import { UserProgress } from '@/data/types';
import {
  getProgress,
  getTodayXP,
  completeLesson,
  recordPractice,
  setDailyGoal,
} from '@/lib/storage';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const markLessonComplete = useCallback((lessonId: string, xp: number) => {
    const updated = completeLesson(lessonId, xp);
    setProgress(updated);
    return updated;
  }, []);

  const addPracticeScore = useCallback((phonemeId: string, score: number) => {
    const updated = recordPractice(phonemeId, score);
    setProgress(updated);
    return updated;
  }, []);

  const updateDailyGoal = useCallback((goal: number) => {
    const updated = setDailyGoal(goal);
    setProgress(updated);
  }, []);

  const todayXP = progress ? getTodayXP(progress) : 0;
  const dailyGoal = progress?.dailyGoal ?? 100;
  const goalProgress = Math.min((todayXP / dailyGoal) * 100, 100);
  const goalReached = todayXP >= dailyGoal;

  return {
    progress,
    todayXP,
    dailyGoal,
    goalProgress,
    goalReached,
    markLessonComplete,
    addPracticeScore,
    updateDailyGoal,
  };
}
