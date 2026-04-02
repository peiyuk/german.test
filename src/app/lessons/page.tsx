'use client';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
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
  beginner: 'bg-green-100 text-green-700 border-green-200',
  elementary: 'bg-blue-100 text-blue-700 border-blue-200',
  intermediate: 'bg-purple-100 text-purple-700 border-purple-200',
};

const levelLabels: Record<string, string> = {
  beginner: '入門',
  elementary: '初級',
  intermediate: '中級',
};

export default function LessonsPage() {
  const { progress } = useProgress();
  const completed = progress?.completedLessons ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">課程列表</h1>
        <p className="text-gray-500 mt-1">從德語基礎拼音開始，循序漸進掌握發音</p>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">{completed.length} 已完成</span>
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{lessons.length - completed.length} 待學習</span>
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {lessons.reduce((s, l) => s + l.xp, 0)} 總 XP
        </span>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, i) => {
          const done = completed.includes(lesson.id);
          const phonemeCount = lesson.phonemes.length;
          return (
            <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
              <div className={`bg-white border rounded-xl p-5 flex items-start gap-4 transition-all hover:shadow-md cursor-pointer ${
                done ? 'border-green-200' : 'border-gray-200 hover:border-blue-300'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0 ${
                  done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {done ? '✓' : i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xl">{categoryIcons[lesson.category]}</span>
                    <h3 className="font-bold text-gray-800">{lesson.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${levelColors[lesson.level]}`}>
                      {levelLabels[lesson.level]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{lesson.subtitle}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{lesson.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{phonemeCount} 個音素</span>
                    <span>·</span>
                    <span className={done ? 'text-green-600 font-medium' : 'text-blue-600 font-medium'}>
                      {done ? '已獲得' : '可獲得'} +{lesson.xp} XP
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="text-gray-300 text-lg">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
