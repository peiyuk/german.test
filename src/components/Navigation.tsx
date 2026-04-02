'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';
import { createClient } from '@/lib/supabase';

const navItems = [
  { href: '/', label: '首頁', icon: '🏠' },
  { href: '/lessons', label: '課程', icon: '📚' },
  { href: '/practice', label: '練習', icon: '🎤' },
  { href: '/progress', label: '進度', icon: '📊' },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { todayXP, dailyGoal, goalProgress, goalReached } = useProgress();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 font-bold text-blue-700 text-lg">
            <span className="text-2xl">🇩🇪</span>
            <span className="hidden sm:inline">Deutsch Lernen</span>
          </Link>

          <nav className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-sm">
            {/* XP progress bar */}
            <div className="hidden sm:flex items-center gap-1">
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${goalReached ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${goalReached ? 'text-green-600' : 'text-gray-500'}`}>
                {todayXP}/{dailyGoal} XP
              </span>
            </div>

            {/* User auth */}
            {userEmail ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {userEmail[0].toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden sm:block text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  登出
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                登入
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
