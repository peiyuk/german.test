'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (tab === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: 'error', text: '登入失敗：' + (error.message === 'Invalid login credentials' ? '帳號或密碼錯誤' : error.message) });
      } else {
        router.push('/');
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage({ type: 'error', text: '註冊失敗：' + error.message });
      } else {
        setMessage({ type: 'success', text: '註冊成功！請確認你的 Email 後再登入。' });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full max-w-sm p-6">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🇩🇪</div>
          <h1 className="text-xl font-bold text-gray-800">Deutsch Lernen</h1>
          <p className="text-sm text-gray-500">德語學習平台</p>
        </div>

        {/* Tab */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
          <button
            onClick={() => { setTab('login'); setMessage(null); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'login' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}
          >
            登入
          </button>
          <button
            onClick={() => { setTab('signup'); setMessage(null); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'signup' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}
          >
            註冊
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tab === 'signup' ? '至少 6 個字元' : '輸入密碼'}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-60 transition-colors mt-1"
          >
            {loading ? '處理中...' : tab === 'login' ? '登入' : '建立帳號'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          登入後你的學習進度將雲端同步，隨時隨地繼續學習
        </p>
      </div>
    </div>
  );
}
