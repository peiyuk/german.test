'use client';
import { useState } from 'react';
import { Phoneme } from '@/data/types';
import { useSpeech } from '@/hooks/useSpeech';

interface PhonemeCardProps {
  phoneme: Phoneme;
  onPractice?: (phoneme: Phoneme) => void;
}

export default function PhonemeCard({ phoneme, onPractice }: PhonemeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { speak, state } = useSpeech();

  const handleListen = (word: string) => {
    speak(word);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-blue-700 font-mono bg-blue-50 px-3 py-1 rounded-lg">
              {phoneme.symbol}
            </span>
            <div>
              <p className="font-semibold text-gray-800">{phoneme.name}</p>
              <p className="text-xs text-gray-500">/{phoneme.audioHint}/</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{phoneme.description}</p>
        </div>

        <div className="flex gap-2 shrink-0">
          {onPractice && (
            <button
              onClick={() => onPractice(phoneme)}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              練習
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
        <p className="text-sm text-amber-800">
          <span className="font-medium">發音技巧：</span> {phoneme.tip}
        </p>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        {expanded ? '收起例詞 ▲' : `查看例詞 (${phoneme.examples.length}) ▼`}
      </button>

      {expanded && (
        <div className="mt-2 space-y-2">
          {phoneme.examples.map((ex, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div>
                <span className="font-bold text-gray-800 mr-2">{ex.word}</span>
                <span className="text-gray-500 text-sm mr-2">— {ex.meaning}</span>
                <span className="text-xs text-gray-400 font-mono">{ex.ipa}</span>
              </div>
              <button
                onClick={() => handleListen(ex.word)}
                disabled={state === 'speaking'}
                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                title="聆聽發音"
              >
                {state === 'speaking' ? '🔊' : '▶️'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
