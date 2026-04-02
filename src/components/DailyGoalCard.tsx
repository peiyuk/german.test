'use client';
import { useProgress } from '@/hooks/useProgress';

export default function DailyGoalCard() {
  const { todayXP, dailyGoal, goalProgress, goalReached, progress } = useProgress();

  if (!progress) return null;

  const streak = progress.streak;

  return (
    <div className={`rounded-2xl p-5 ${goalReached ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-800">今日目標</h3>
          <p className="text-sm text-gray-500">每天學習達成 {dailyGoal} XP</p>
        </div>
        <div className="text-right">
          {goalReached ? (
            <div className="text-3xl">🎉</div>
          ) : (
            <div className="text-2xl font-bold text-blue-600">{Math.round(goalProgress)}%</div>
          )}
        </div>
      </div>

      <div className="w-full h-3 bg-white rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${goalReached ? 'bg-green-500' : 'bg-blue-500'}`}
          style={{ width: `${goalProgress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${goalReached ? 'text-green-700' : 'text-blue-700'}`}>
          {todayXP} / {dailyGoal} XP
        </span>
        {goalReached ? (
          <span className="text-green-700 font-medium">目標達成！</span>
        ) : (
          <span className="text-gray-500">還差 {dailyGoal - todayXP} XP</span>
        )}
      </div>

      {streak > 0 && (
        <div className="mt-3 pt-3 border-t border-white/50 flex items-center gap-2">
          <span className="text-orange-500">🔥</span>
          <span className="text-sm font-medium text-gray-700">連續學習 {streak} 天</span>
        </div>
      )}
    </div>
  );
}
