'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function LoginPage() {
  const t = useTranslations('admin');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(t('loginError'));
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white border border-sage-line p-8">
        <h1 className="text-2xl font-bold text-ink text-center">{t('loginTitle')}</h1>

        <div className="mt-6">
          <label className="block text-sm font-medium text-ink/70">{t('email')}</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-ink/70">{t('password')}</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="mt-6 w-full rounded-full bg-pine px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
          {loading ? t('loggingIn') : t('loginButton')}
        </button>
      </form>
    </div>
  );
}