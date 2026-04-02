'use client';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import DailyGoalCard from '@/components/DailyGoalCard';
import { lessons } from '@/data/lessons';

const categoryIcons: Record<string, string> = {
  alphabet: '🔤',
  vowels: '🅐',
  umlauts: '🇩🇪',
  diphthongs: '🔀',
  consonants: '📢',
  special: '⭐',
};

const levelColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  elementary: 'bg-blue-100 text-blue-700',
  intermediate: 'bg-purple-100 text-purple-700',
};

const levelLabels: Record<string, string> = {
  beginner: '入門',
  elementary: '初級',
  intermediate: '中級',
};

export default function HomePage() {
  const { progress } = useProgress();
  const completedLessons = progress?.completedLessons ?? [];
  const totalXP = progress?.totalXP ?? 0;
  const streak = progress?.streak ?? 0;

  const nextLesson = lessons.find((l) => !completedLessons.includes(l.id));
  const completedCount = completedLessons.length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🇩🇪</span>
          <div>
            <h1 className="text-2xl font-bold">Deutsch Lernen</h1>
            <p className="text-blue-100 text-sm">從零開始學習德語拼音與發音</p>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <div className="text-2xl font-bold">{totalXP}</div>
            <div className="text-xs text-blue-100">總 XP</div>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <div className="text-2xl font-bold">{completedCount}/{lessons.length}</div>
            <div className="text-xs text-blue-100">課程</div>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <div className="text-2xl font-bold">{streak}</div>
            <div className="text-xs text-blue-100">連勝天</div>
          </div>
        </div>
      </div>

      {/* Daily Goal */}
      <DailyGoalCard />

      {/* Continue / Start */}
      {nextLesson && (
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            {completedCount === 0 ? '開始學習' : '繼續學習'}
          </h2>
          <Link href={`/lessons/${nextLesson.id}`}>
            <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-4">
              <div className="text-3xl">{categoryIcons[nextLesson.category]}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-800">{nextLesson.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[nextLesson.level]}`}>
                    {levelLabels[nextLesson.level]}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{nextLesson.subtitle}</p>
                <p className="text-xs text-blue-600 font-medium mt-1">+{nextLesson.xp} XP</p>
              </div>
              <span className="text-gray-400 text-lg">→</span>
            </div>
          </Link>
        </div>
      )}

      {/* Learning Path */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">學習路線</h2>
          <Link href="/lessons" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            全部課程 →
          </Link>
        </div>
        <div className="grid gap-3">
          {lessons.map((lesson, i) => {
            const done = completedLessons.includes(lesson.id);
            const isNext = lesson.id === nextLesson?.id;
            return (
              <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                <div className={`bg-white border rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-sm ${
                  done ? 'border-green-200 bg-green-50' : isNext ? 'border-blue-300 hover:border-blue-400' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                    done ? 'bg-green-500 text-white' : isNext ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 text-sm">{lesson.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${levelColors[lesson.level]}`}>
                        {levelLabels[lesson.level]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{lesson.subtitle} · {lesson.phonemes.length} 個音素</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-sm font-medium ${done ? 'text-green-600' : 'text-gray-400'}`}>
                      {done ? '✓ 已完成' : `+${lesson.xp} XP`}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/practice">
          <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all text-center">
            <div className="text-3xl mb-2">🎤</div>
            <div className="font-semibold text-gray-800 text-sm">發音練習</div>
            <div className="text-xs text-gray-400 mt-1">AI 語音評估</div>
          </div>
        </Link>
        <Link href="/progress">
          <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold text-gray-800 text-sm">我的進度</div>
            <div className="text-xs text-gray-400 mt-1">設定每日目標</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
