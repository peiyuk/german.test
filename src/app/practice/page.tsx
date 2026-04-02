'use client';
import { useState } from 'react';
import { lessons } from '@/data/lessons';
import { Phoneme } from '@/data/types';
import { useSpeech } from '@/hooks/useSpeech';
import { useProgress } from '@/hooks/useProgress';

type Mode = 'select' | 'practice' | 'result';
type PracticeType = 'sound' | 'word';

const allPhonemes = lessons.flatMap((l) =>
  l.phonemes.map((p) => ({ ...p, lessonTitle: l.title }))
);

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-100 text-green-700' : score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600';
  return <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${color}`}>{score}</span>;
}

export default function PracticePage() {
  const [mode, setMode] = useState<Mode>('select');
  const [selectedPhoneme, setSelectedPhoneme] = useState<(Phoneme & { lessonTitle: string }) | null>(null);
  const [practiceType, setPracticeType] = useState<PracticeType>('sound');
  const [wordIndex, setWordIndex] = useState(0);
  const [sessionScores, setSessionScores] = useState<{ target: string; score: number; heard: string }[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const { speak, startListening, stopListening, state, transcript, error, clearTranscript, similarityScore, ttsSupported, sttSupported } = useSpeech();
  const { addPracticeScore, progress } = useProgress();

  const targetWord = selectedPhoneme?.examples[wordIndex % selectedPhoneme.examples.length];
  // In sound mode, target is the soundSample; in word mode, target is the example word
  const currentTarget = practiceType === 'sound' ? selectedPhoneme?.soundSample ?? '' : (targetWord?.word ?? '');

  const handleSelectPhoneme = (phoneme: Phoneme & { lessonTitle: string }) => {
    setSelectedPhoneme(phoneme);
    setWordIndex(0);
    setSessionScores([]);
    clearTranscript();
    // Default to sound mode for first-time practicers, word mode for experienced
    const count = progress?.practicedPhonemes[phoneme.id] ?? 0;
    setPracticeType(count === 0 ? 'sound' : 'word');
    setMode('practice');
  };

  const handleEvaluate = () => {
    if (!currentTarget || !transcript) return;
    const score = similarityScore(currentTarget, transcript);
    addPracticeScore(selectedPhoneme!.id, score);
    setSessionScores((prev) => [...prev, { target: currentTarget, score, heard: transcript }]);
    setMode('result');
  };

  const handleNext = () => {
    if (practiceType === 'word') setWordIndex((i) => i + 1);
    clearTranscript();
    setMode('practice');
  };

  const lessonCategories = Array.from(new Set(lessons.map((l) => l.category)));
  const filteredPhonemes = filter === 'all'
    ? allPhonemes
    : allPhonemes.filter((p) => {
        const lesson = lessons.find((l) => l.phonemes.some((ph) => ph.id === p.id));
        return lesson?.category === filter;
      });

  const avgScore = sessionScores.length
    ? Math.round(sessionScores.reduce((s, r) => s + r.score, 0) / sessionScores.length)
    : null;

  const getPracticeCount = (phonemeId: string) => progress?.practicedPhonemes[phonemeId] ?? 0;
  const getLastScore = (phonemeId: string) => {
    const scores = progress?.practiceScores[phonemeId];
    return scores?.length ? scores[scores.length - 1] : null;
  };

  // ── Practice screen ──────────────────────────────────────────────────────────
  if (mode === 'practice' && selectedPhoneme) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button onClick={() => setMode('select')} className="text-blue-600 text-sm font-medium hover:text-blue-800">
            ← 返回選擇
          </button>
          {sessionScores.length > 0 && (
            <div className="text-sm text-gray-500">{sessionScores.length} 次 · 平均 {avgScore}</div>
          )}
        </div>

        {/* Mode toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => { setPracticeType('sound'); clearTranscript(); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              practiceType === 'sound'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🔤 單音練習
          </button>
          <button
            onClick={() => { setPracticeType('word'); clearTranscript(); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              practiceType === 'word'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            💬 單詞練習
          </button>
        </div>

        {/* Phoneme header */}
        <div className="bg-blue-600 text-white rounded-2xl p-5 text-center">
          <div className="text-4xl font-bold font-mono mb-2">{selectedPhoneme.symbol}</div>
          <div className="text-blue-100 text-sm">{selectedPhoneme.description}</div>
        </div>

        {/* Tip */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-sm text-amber-800">
            <span className="font-medium">💡 技巧：</span>{selectedPhoneme.tip}
          </p>
        </div>

        {/* Target */}
        {practiceType === 'sound' ? (
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-sm text-gray-400 mb-2">只需要發出這個音：</p>
            <div className="text-6xl font-bold text-blue-700 font-mono mb-3">{selectedPhoneme.soundSample}</div>
            <p className="text-xs text-gray-400">不需要說完整的詞，單獨發這個音就好</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-sm text-gray-400 mb-2">請跟著唸這個詞：</p>
            <div className="text-5xl font-bold text-gray-800 mb-2">{targetWord?.word}</div>
            <div className="text-gray-500">{targetWord?.meaning}</div>
            <div className="text-gray-400 text-sm font-mono mt-1">{targetWord?.ipa}</div>
          </div>
        )}

        {/* TTS Listen */}
        {ttsSupported && (
          <button
            onClick={() => speak(currentTarget)}
            disabled={state === 'speaking'}
            className="w-full py-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
          >
            {state === 'speaking'
              ? <><span className="animate-pulse">🔊</span> 播放中...</>
              : <><span>🔊</span> {practiceType === 'sound' ? '聆聽這個音' : '聆聽標準發音'}</>}
          </button>
        )}

        {/* STT Record */}
        {sttSupported ? (
          <div className="space-y-3">
            <div className="flex justify-center">
              <button
                onClick={() => state === 'listening' ? stopListening() : (clearTranscript(), startListening())}
                className={`w-24 h-24 rounded-full text-4xl transition-all shadow-xl ${
                  state === 'listening'
                    ? 'bg-red-500 text-white scale-110 animate-pulse'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                }`}
              >
                {state === 'listening' ? '⏹' : '🎤'}
              </button>
            </div>
            <p className="text-center text-sm text-gray-500">
              {state === 'listening' ? '正在聆聽... 點擊停止' : '點擊麥克風開始錄音'}
            </p>

            {transcript && (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">語音識別結果：</p>
                <p className="text-2xl font-bold text-gray-800">{transcript}</p>
              </div>
            )}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {transcript && state !== 'listening' && (
              <button
                onClick={handleEvaluate}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
              >
                評估發音 →
              </button>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-sm">請使用 Chrome 或 Edge 瀏覽器以啟用語音識別功能</p>
          </div>
        )}
      </div>
    );
  }

  // ── Result screen ─────────────────────────────────────────────────────────────
  if (mode === 'result' && selectedPhoneme) {
    const lastResult = sessionScores[sessionScores.length - 1];
    const score = lastResult?.score ?? 0;
    const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-500';
    const scoreLabel = score >= 80 ? '太棒了！發音非常準確！' : score >= 50 ? '不錯！再多練習幾次' : '繼續加油！注意發音技巧';
    const xpEarned = score >= 80 ? 10 : score >= 50 ? 5 : 2;

    return (
      <div className="max-w-md mx-auto space-y-5">
        <button onClick={() => setMode('select')} className="text-blue-600 text-sm font-medium hover:text-blue-800">
          ← 返回選擇
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center space-y-4">
          <div className={`text-6xl font-bold ${scoreColor}`}>{score}</div>
          <div className={`text-lg font-semibold ${scoreColor}`}>{scoreLabel}</div>

          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>

          <div className="text-sm text-gray-500 space-y-1 bg-gray-50 rounded-xl p-3 text-left">
            <p>
              <span className="font-medium">目標{practiceType === 'sound' ? '音' : '詞'}：</span>
              {lastResult?.target}
            </p>
            {lastResult?.heard && <p><span className="font-medium">識別到：</span>{lastResult.heard}</p>}
            <p className="text-blue-600 font-medium">+{xpEarned} XP 已獲得</p>
          </div>
        </div>

        {/* Suggest upgrading to word practice after nailing the sound */}
        {practiceType === 'sound' && score >= 80 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <p className="text-sm text-green-700 font-medium">單音發得不錯！試試看單詞練習？</p>
            <button
              onClick={() => { setPracticeType('word'); clearTranscript(); setMode('practice'); }}
              className="mt-2 px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
            >
              切換到單詞練習 →
            </button>
          </div>
        )}

        {sessionScores.length > 1 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-700 text-sm mb-2">本次練習記錄</h3>
            <div className="space-y-1.5">
              {sessionScores.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{r.target}</span>
                  <ScoreBadge score={r.score} />
                </div>
              ))}
            </div>
            {avgScore !== null && (
              <div className="mt-2 pt-2 border-t border-gray-100 text-sm font-medium text-gray-700">
                平均分：<span className={avgScore >= 80 ? 'text-green-600' : avgScore >= 50 ? 'text-yellow-600' : 'text-red-500'}>{avgScore}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            {practiceType === 'sound' ? '再練一次' : '下一個詞'} →
          </button>
          <button
            onClick={() => { clearTranscript(); setMode('practice'); }}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            再試一次
          </button>
        </div>
      </div>
    );
  }

  // ── Select screen ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">發音練習</h1>
        <p className="text-gray-500 mt-1">選擇一個音素開始練習，新手建議從「單音練習」開始</p>
      </div>

      {/* Beginner tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2 text-sm text-blue-800">
        <span className="text-lg">💡</span>
        <span>第一次練習時會自動進入<strong>單音練習</strong>模式，只需要發出單一音素，不需要說完整的詞！</span>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium shrink-0 transition-colors ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        {lessonCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium shrink-0 transition-colors ${
              filter === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === 'alphabet' ? '字母' : cat === 'vowels' ? '母音' : cat === 'umlauts' ? '變音' : cat === 'diphthongs' ? '雙母音' : cat === 'consonants' ? '子音' : '特殊'}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filteredPhonemes.map((phoneme) => {
          const count = getPracticeCount(phoneme.id);
          const lastScore = getLastScore(phoneme.id);
          const isNew = count === 0;
          return (
            <button
              key={phoneme.id}
              onClick={() => handleSelectPhoneme(phoneme)}
              className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xl font-bold text-blue-700 font-mono bg-blue-50 px-2 py-0.5 rounded-lg">
                  {phoneme.symbol}
                </span>
                <div className="flex items-center gap-1">
                  {isNew && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">新</span>
                  )}
                  {lastScore !== null && <ScoreBadge score={lastScore} />}
                </div>
              </div>
              <p className="font-medium text-gray-800 text-sm">{phoneme.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{phoneme.lessonTitle}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-gray-300">單音：</span>
                <span className="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{phoneme.soundSample}</span>
                {count > 0 && <span className="text-xs text-gray-400">· 練習 {count} 次</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
