'use client';
import { useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { lessons, getTotalXP } from '@/data/lessons';
import { resetProgress } from '@/lib/storage';

const GOAL_OPTIONS = [50, 100, 150, 200, 300];

function WeekChart({ dailyXP, dailyGoal }: { dailyXP: Record<string, number>; dailyGoal: number }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const xp = dailyXP[key] ?? 0;
    const label = d.toLocaleDateString('zh-TW', { weekday: 'short' });
    const isToday = i === 6;
    return { key, xp, label, isToday };
  });

  const maxXP = Math.max(...days.map((d) => d.xp), dailyGoal, 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-700 mb-3 text-sm">本週學習 XP</h3>
      <div className="flex items-end gap-2 h-28">
        {days.map((day) => {
          const height = Math.max((day.xp / maxXP) * 100, day.xp > 0 ? 8 : 0);
          const goalHeight = (dailyGoal / maxXP) * 100;
          return (
            <div key={day.key} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs text-gray-500 font-medium">{day.xp > 0 ? day.xp : ''}</div>
              <div className="w-full relative flex-1 flex items-end">
                <div className="w-full flex flex-col justify-end" style={{ height: '80px' }}>
                  {/* Goal line indicator */}
                  <div
                    className="absolute w-full border-t-2 border-dashed border-blue-200 pointer-events-none"
                    style={{ bottom: `${goalHeight}%` }}
                  />
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      day.xp >= dailyGoal
                        ? 'bg-green-500'
                        : day.xp > 0
                          ? 'bg-blue-400'
                          : 'bg-gray-100'
                    }`}
                    style={{ height: `${height}%`, minHeight: day.xp > 0 ? '4px' : '0' }}
                  />
                </div>
              </div>
              <div className={`text-xs ${day.isToday ? 'font-bold text-blue-600' : 'text-gray-400'}`}>
                {day.label}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-2">虛線 = 每日目標 ({dailyGoal} XP)</p>
    </div>
  );
}

export default function ProgressPage() {
  const { progress, todayXP, dailyGoal, goalProgress, goalReached, updateDailyGoal } = useProgress();
  const [showReset, setShowReset] = useState(false);
  const [customGoal, setCustomGoal] = useState('');
  const [goalSet, setGoalSet] = useState(false);

  if (!progress) return null;

  const completedLessons = progress.completedLessons;
  const totalAvailableXP = getTotalXP();
  const overallProgress = Math.round((progress.totalXP / totalAvailableXP) * 100);

  const handleSetGoal = (goal: number) => {
    updateDailyGoal(goal);
    setGoalSet(true);
    setTimeout(() => setGoalSet(false), 2000);
  };

  const handleCustomGoal = () => {
    const g = parseInt(customGoal);
    if (g > 0 && g <= 1000) {
      handleSetGoal(g);
      setCustomGoal('');
    }
  };

  const handleReset = () => {
    resetProgress();
    window.location.reload();
  };

  // Compute top practiced phonemes
  const topPhonemes = Object.entries(progress.practicedPhonemes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">我的進度</h1>
        <p className="text-gray-500 mt-1">追蹤你的學習成果，設定每日目標</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: '總 XP', value: progress.totalXP, icon: '⭐', color: 'text-yellow-600' },
          { label: '完成課程', value: `${completedLessons.length}/${lessons.length}`, icon: '📚', color: 'text-blue-600' },
          { label: '連勝天數', value: progress.streak, icon: '🔥', color: 'text-orange-500' },
          { label: '今日 XP', value: todayXP, icon: '🎯', color: goalReached ? 'text-green-600' : 'text-blue-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Today's goal */}
      <div className={`rounded-2xl p-5 ${goalReached ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">今日學習目標</h3>
          {goalReached && <span className="text-green-600 font-bold">🎉 已達成！</span>}
        </div>
        <div className="w-full h-3 bg-white rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-500 ${goalReached ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${goalProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className={goalReached ? 'text-green-700' : 'text-blue-700'}>{todayXP} XP 已獲得</span>
          <span className="text-gray-500">目標：{dailyGoal} XP</span>
        </div>
      </div>

      {/* Set daily goal */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-bold text-gray-800 mb-3">設定每日目標</h3>

        {goalSet && (
          <div className="text-green-600 text-sm font-medium mb-3 bg-green-50 p-2 rounded-lg">
            ✓ 目標已更新為 {dailyGoal} XP/天
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {GOAL_OPTIONS.map((g) => (
            <button
              key={g}
              onClick={() => handleSetGoal(g)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                dailyGoal === g
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {g} XP
              {g === 50 && ' (輕鬆)'}
              {g === 100 && ' (推薦)'}
              {g === 200 && ' (勤奮)'}
              {g === 300 && ' (強化)'}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder="自訂 XP 目標"
            min="1"
            max="1000"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
          <button
            onClick={handleCustomGoal}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            設定
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-400 space-y-1">
          <p>• 每完成1個課程可獲 50-90 XP</p>
          <p>• 每次發音練習可獲 2-10 XP（依準確度）</p>
          <p>• 每天達成目標可累積連勝！</p>
        </div>
      </div>

      {/* Week chart */}
      <WeekChart dailyXP={progress.dailyXP} dailyGoal={dailyGoal} />

      {/* Overall progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-bold text-gray-800 mb-3">整體學習進度</h3>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{progress.totalXP} / {totalAvailableXP} XP</span>
          <span>{overallProgress}% 完成</span>
        </div>

        <div className="mt-4 space-y-2">
          {lessons.map((lesson) => {
            const done = completedLessons.includes(lesson.id);
            return (
              <div key={lesson.id} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full shrink-0 ${done ? 'bg-green-500' : 'bg-gray-200'}`} />
                <span className={`text-sm flex-1 ${done ? 'text-gray-700' : 'text-gray-400'}`}>{lesson.title}</span>
                {done && <span className="text-xs text-green-600 font-medium">+{lesson.xp} XP</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top practiced phonemes */}
      {topPhonemes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-bold text-gray-800 mb-3">最常練習的音素</h3>
          <div className="space-y-2">
            {topPhonemes.map(([id, count]) => {
              const scores = progress.practiceScores[id] ?? [];
              const avg = scores.length ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
              return (
                <div key={id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <div>
                    <span className="font-mono font-bold text-blue-700 text-sm bg-blue-50 px-2 py-0.5 rounded mr-2">{id}</span>
                    <span className="text-sm text-gray-600">{count} 次練習</span>
                  </div>
                  {avg > 0 && (
                    <span className={`text-sm font-bold ${avg >= 80 ? 'text-green-600' : avg >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                      平均 {avg}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reset */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-bold text-gray-800 mb-2">重置資料</h3>
        <p className="text-sm text-gray-500 mb-3">清除所有學習記錄與進度（此操作不可復原）</p>
        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
          >
            重置進度
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleReset} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">
              確認重置
            </button>
            <button onClick={() => setShowReset(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200">
              取消
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
