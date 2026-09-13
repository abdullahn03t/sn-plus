'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, X } from 'lucide-react';
import { sendContactEmail } from '@/lib/actions';

export default function FloatingEmailButton() {
  const t = useTranslations('emailWidget');
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData();
    formData.set('email', email);
    formData.set('message', message);

    const result = await sendContactEmail(formData);

    if (result.success) {
      setStatus('sent');
      setEmail('');
      setMessage('');
    } else {
      setStatus('error');
    }
  }

  function handleClose() {
    setOpen(false);
    setStatus('idle');
  }

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label={t('openLabel')} className="fixed bottom-6 inset-e-6 z-40 w-14 h-14 rounded-full bg-pine text-white shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity">
        <Mail size={24} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 p-4" onClick={handleClose}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 relative">
            <button onClick={handleClose} className="absolute top-4 inset-e-4 text-ink/40 hover:text-ink">
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-ink">{t('title')}</h3>

            {status === 'sent' ? (
              <p className="mt-4 text-ink/70">{t('sentMessage')}</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4">
                <label className="block text-sm font-medium text-ink/70">{t('yourEmail')}</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />

                <label className="block text-sm font-medium text-ink/70 mt-4">{t('yourMessage')}</label>
                <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />

                {status === 'error' && <p className="mt-3 text-sm text-red-600">{t('errorMessage')}</p>}

                <button type="submit" disabled={status === 'sending'} className="mt-4 w-full rounded-full bg-pine px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                  {status === 'sending' ? t('sending') : t('sendButton')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}