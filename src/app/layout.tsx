import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'Deutsch Lernen — 德語學習平台',
  description: '從基礎拼音開始學習德語，配合語音AI練習發音，每日設定學習目標。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className="antialiased">
      <body className="bg-gray-50 min-h-screen font-sans">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
