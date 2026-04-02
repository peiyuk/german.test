'use client';
import { useState, useEffect, useCallback } from 'react';
import { UserProgress } from '@/data/types';
import { createClient } from '@/lib/supabase';
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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Load current session
    supabase.auth.getUser().then(({ data: { user } }) => {
      const uid = user?.id ?? null;
      setUserId(uid);
      getProgress(uid).then(setProgress);
    });

    // Listen for auth changes (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      getProgress(uid).then(setProgress);
    });

    return () => subscription.unsubscribe();
  }, []);

  const markLessonComplete = useCallback(async (lessonId: string, xp: number) => {
    const updated = await completeLesson(lessonId, xp, userId);
    setProgress(updated);
    return updated;
  }, [userId]);

  const addPracticeScore = useCallback(async (phonemeId: string, score: number) => {
    const updated = await recordPractice(phonemeId, score, userId);
    setProgress(updated);
    return updated;
  }, [userId]);

  const updateDailyGoal = useCallback(async (goal: number) => {
    const updated = await setDailyGoal(goal, userId);
    setProgress(updated);
  }, [userId]);

  const currentProgress = progress ?? defaultProgress;
  const todayXP = getTodayXP(currentProgress);
  const dailyGoal = currentProgress.dailyGoal;
  const goalProgress = Math.min((todayXP / dailyGoal) * 100, 100);
  const goalReached = todayXP >= dailyGoal;

  return {
    progress,
    userId,
    todayXP,
    dailyGoal,
    goalProgress,
    goalReached,
    markLessonComplete,
    addPracticeScore,
    updateDailyGoal,
  };
}
