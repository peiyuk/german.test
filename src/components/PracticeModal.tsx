'use client';
import { useState, useEffect } from 'react';
import { Phoneme } from '@/data/types';
import { useSpeech } from '@/hooks/useSpeech';
import { useProgress } from '@/hooks/useProgress';

interface PracticeModalProps {
  phoneme: Phoneme;
  onClose: () => void;
}

type Phase = 'listen' | 'speak' | 'result';

export default function PracticeModal({ phoneme, onClose }: PracticeModalProps) {
  const [phase, setPhase] = useState<Phase>('listen');
  const [targetWord, setTargetWord] = useState(phoneme.examples[0]);
  const [score, setScore] = useState<number | null>(null);
  const [round, setRound] = useState(0);

  const { speak, startListening, stopListening, state, transcript, error, clearTranscript, similarityScore, ttsSupported, sttSupported } = useSpeech();
  const { addPracticeScore } = useProgress();

  useEffect(() => {
    const idx = round % phoneme.examples.length;
    setTargetWord(phoneme.examples[idx]);
    setScore(null);
    clearTranscript();
    setPhase('listen');
  }, [round, phoneme.examples, clearTranscript]);

  const handleListen = () => {
    speak(targetWord.word);
  };

  const handleRecord = () => {
    if (state === 'listening') {
      stopListening();
    } else {
      clearTranscript();
      startListening();
    }
  };

  const handleEvaluate = () => {
    const s = similarityScore(targetWord.word, transcript);
    setScore(s);
    addPracticeScore(phoneme.id, s);
    setPhase('result');
  };

  const handleNext = () => {
    setRound((r) => r + 1);
  };

  const scoreColor = score !== null
    ? score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-500'
    : '';

  const scoreLabel = score !== null
    ? score >= 80 ? '太棒了！' : score >= 50 ? '不錯！繼續練習' : '再試一次！'
    : '';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">發音練習</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>

          {/* Phoneme info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-5 text-center">
            <div className="text-3xl font-bold text-blue-700 font-mono mb-1">{phoneme.symbol}</div>
            <div className="text-gray-600 text-sm">{phoneme.description}</div>
          </div>

          {/* Target word */}
          <div className="text-center mb-6">
            <div className="text-sm text-gray-500 mb-1">請跟著唸：</div>
            <div className="text-4xl font-bold text-gray-800 mb-1">{targetWord.word}</div>
            <div className="text-gray-500 text-sm">{targetWord.meaning} · <span className="font-mono">{targetWord.ipa}</span></div>
          </div>

          {phase === 'listen' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 text-center bg-amber-50 p-3 rounded-lg">{phoneme.tip}</p>
              {ttsSupported && (
                <button
                  onClick={handleListen}
                  disabled={state === 'speaking'}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                >
                  {state === 'speaking' ? (
                    <><span className="animate-pulse">🔊</span> 播放中...</>
                  ) : (
                    <><span>🔊</span> 聆聽標準發音</>
                  )}
                </button>
              )}
              <button
                onClick={() => setPhase('speak')}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                開始錄音練習 →
              </button>
            </div>
          )}

          {phase === 'speak' && (
            <div className="space-y-3">
              {sttSupported ? (
                <>
                  <div className="text-center">
                    <button
                      onClick={handleRecord}
                      className={`w-20 h-20 rounded-full text-3xl transition-all shadow-lg ${
                        state === 'listening'
                          ? 'bg-red-500 text-white animate-pulse scale-110'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {state === 'listening' ? '⏹' : '🎤'}
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      {state === 'listening' ? '正在聆聽... 點擊停止' : '點擊開始錄音'}
                    </p>
                  </div>

                  {transcript && (
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-sm text-gray-500 mb-1">識別結果：</p>
                      <p className="text-xl font-bold text-gray-800">{transcript}</p>
                    </div>
                  )}

                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                  {transcript && state !== 'listening' && (
                    <button
                      onClick={handleEvaluate}
                      className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                    >
                      評估發音
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-2">您的瀏覽器不支援語音識別</p>
                  <p className="text-sm text-gray-400">請嘗試 Chrome 或 Edge 瀏覽器</p>
                  <button
                    onClick={() => { setScore(75); setPhase('result'); addPracticeScore(phoneme.id, 75); }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                  >
                    標記為已練習
                  </button>
                </div>
              )}
            </div>
          )}

          {phase === 'result' && score !== null && (
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-5xl font-bold mb-1 ${scoreColor}`}>{score}</div>
                <div className={`text-lg font-medium ${scoreColor}`}>{scoreLabel}</div>
              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
                <p><span className="font-medium">目標：</span>{targetWord.word}</p>
                {transcript && <p><span className="font-medium">識別：</span>{transcript}</p>}
                <p className="mt-1 text-xs text-gray-400">+{score >= 80 ? 10 : score >= 50 ? 5 : 2} XP 已獲得</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  下一個詞 →
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  結束
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
