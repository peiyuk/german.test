'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export type SpeechState = 'idle' | 'speaking' | 'listening' | 'processing';

// Web Speech API type declarations
interface ISpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): { transcript: string; confidence: number };
  [index: number]: { transcript: string; confidence: number };
}

interface ISpeechRecognitionResultList {
  readonly length: number;
  item(index: number): ISpeechRecognitionResult;
  [index: number]: ISpeechRecognitionResult;
}

interface ISpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: ISpeechRecognitionResultList;
}

interface ISpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: ((ev: Event) => void) | null;
  onend: ((ev: Event) => void) | null;
  onresult: ((ev: ISpeechRecognitionEvent) => void) | null;
  onerror: ((ev: ISpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

type ExtendedWindow = Window & {
  SpeechRecognition?: ISpeechRecognitionConstructor;
  webkitSpeechRecognition?: ISpeechRecognitionConstructor;
};

interface UseSpeechReturn {
  state: SpeechState;
  transcript: string;
  error: string | null;
  ttsSupported: boolean;
  sttSupported: boolean;
  speak: (text: string, lang?: string) => void;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  similarityScore: (target: string, heard: string) => number;
}

export function useSpeech(): UseSpeechReturn {
  const [state, setState] = useState<SpeechState>('idle');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    setTtsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    const w = window as ExtendedWindow;
    const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition;
    setSttSupported(!!SpeechRecognitionAPI);
  }, []);

  const speak = useCallback((text: string, lang = 'de-DE') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const germanVoice =
      voices.find((v) => v.lang.startsWith('de') && !v.name.includes('Google')) ||
      voices.find((v) => v.lang.startsWith('de'));
    if (germanVoice) utterance.voice = germanVoice;

    utterance.onstart = () => setState('speaking');
    utterance.onend = () => setState('idle');
    utterance.onerror = () => setState('idle');
    window.speechSynthesis.speak(utterance);
  }, []);

  const startListening = useCallback(() => {
    const w = window as ExtendedWindow;
    const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setError('您的瀏覽器不支援語音識別');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'de-DE';
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setState('listening');
      setError(null);
      setTranscript('');
    };

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        }
      }
      if (final) setTranscript(final.trim());
    };

    recognition.onend = () => setState('idle');
    recognition.onerror = (e: ISpeechRecognitionErrorEvent) => {
      setState('idle');
      if (e.error === 'no-speech') setError('沒有偵測到聲音，請再試一次');
      else if (e.error === 'not-allowed') setError('麥克風權限被拒絕');
      else setError(`語音識別錯誤：${e.error}`);
    };

    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setState('idle');
  }, []);

  const clearTranscript = useCallback(() => setTranscript(''), []);

  const similarityScore = useCallback((target: string, heard: string): number => {
    const normalize = (s: string) =>
      s.toLowerCase().replace(/[^a-zäöüß\s]/g, '').trim();
    const t = normalize(target);
    const h = normalize(heard);
    if (!h) return 0;
    if (t === h) return 100;

    const dp: number[][] = Array.from({ length: t.length + 1 }, (_, i) =>
      Array.from({ length: h.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= t.length; i++) {
      for (let j = 1; j <= h.length; j++) {
        if (t[i - 1] === h[j - 1]) dp[i][j] = dp[i - 1][j - 1];
        else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    const dist = dp[t.length][h.length];
    const maxLen = Math.max(t.length, h.length);
    return Math.round(Math.max(0, (1 - dist / maxLen) * 100));
  }, []);

  return {
    state,
    transcript,
    error,
    ttsSupported,
    sttSupported,
    speak,
    startListening,
    stopListening,
    clearTranscript,
    similarityScore,
  };
}
