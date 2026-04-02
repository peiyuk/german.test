'use client';
import { useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLessonById, lessons } from '@/data/lessons';
import { Phoneme } from '@/data/types';
import PhonemeCard from '@/components/PhonemeCard';
import PracticeModal from '@/components/PracticeModal';
import { useProgress } from '@/hooks/useProgress';

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lesson = getLessonById(id);
  if (!lesson) notFound();

  const [practicePhoneme, setPracticePhoneme] = useState<Phoneme | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const { progress, markLessonComplete } = useProgress();

  const isCompleted = progress?.completedLessons.includes(lesson.id) ?? false;

  const lessonIndex = lessons.findIndex((l) => l.id === id);
  const nextLesson = lessons[lessonIndex + 1];
  const prevLesson = lessons[lessonIndex - 1];

  const handleComplete = () => {
    if (!isCompleted) {
      markLessonComplete(lesson.id, lesson.xp);
      setShowComplete(true);
      setTimeout(() => setShowComplete(false), 3000);
    }
  };

  const levelLabels: Record<string, string> = { beginner: '入門', elementary: '初級', intermediate: '中級' };
  const levelColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700',
    elementary: 'bg-blue-100 text-blue-700',
    intermediate: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <Link href="/lessons" className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-3 inline-block">
          ← 返回課程列表
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[lesson.level]}`}>
                {levelLabels[lesson.level]}
              </span>
            </div>
            <p className="text-gray-500">{lesson.subtitle}</p>
          </div>
          {isCompleted && (
            <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium shrink-0">
              ✓ 已完成
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-gray-700 leading-relaxed">{lesson.description}</p>
        <p className="text-sm text-blue-600 font-medium mt-2">本課程：{lesson.phonemes.length} 個音素 · +{lesson.xp} XP</p>
      </div>

      {/* Phonemes */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3">音素學習</h2>
        <div className="space-y-3">
          {lesson.phonemes.map((phoneme) => (
            <PhonemeCard
              key={phoneme.id}
              phoneme={phoneme}
              onPractice={setPracticePhoneme}
            />
          ))}
        </div>
      </div>

      {/* Complete button */}
      <div className="pb-4">
        {showComplete && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <p className="font-bold text-green-700">課程完成！獲得 +{lesson.xp} XP</p>
          </div>
        )}

        {!isCompleted ? (
          <button
            onClick={handleComplete}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-base"
          >
            標記課程完成 · +{lesson.xp} XP
          </button>
        ) : (
          <div className="text-center text-green-600 font-medium py-2">
            ✓ 課程已完成，繼續練習發音！
          </div>
        )}

        <div className="flex gap-3 mt-3">
          {prevLesson && (
            <Link href={`/lessons/${prevLesson.id}`} className="flex-1">
              <button className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm">
                ← 上一課
              </button>
            </Link>
          )}
          {nextLesson && (
            <Link href={`/lessons/${nextLesson.id}`} className="flex-1">
              <button className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm">
                下一課 →
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Practice modal */}
      {practicePhoneme && (
        <PracticeModal
          phoneme={practicePhoneme}
          onClose={() => setPracticePhoneme(null)}
        />
      )}
    </div>
  );
}
