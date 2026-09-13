'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { Star } from 'lucide-react';

export default function RatingWidget({ productId }) {
  const t = useTranslations('productDetail');
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  async function handleRate(value) {
    const supabase = createSupabaseBrowserClient();
    await supabase.from('ratings').insert({ product_id: productId, rating: value });
    setSubmitted(true);
  }

  if (submitted) {
    return <p className="mt-6 text-sm text-ink/60">{t('ratingThanks')}</p>;
  }

  return (
    <div className="mt-6">
      <p className="text-sm text-ink/60 mb-2">{t('ratingPrompt')}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} onClick={() => handleRate(value)} onMouseEnter={() => setHovered(value)} onMouseLeave={() => setHovered(0)} aria-label={`${value} stars`}>
            <Star size={24} className={value <= hovered ? 'fill-amber text-amber' : 'text-sage-line'} />
          </button>
        ))}
      </div>
    </div>
  );
}