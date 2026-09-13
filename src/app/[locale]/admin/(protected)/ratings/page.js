import { getTranslations } from 'next-intl/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import DeleteRatingButton from '@/components/DeleteRatingButton';
import { Star } from 'lucide-react';

export default async function AdminRatingsPage() {
  const t = await getTranslations('admin');
  const supabase = await createSupabaseServerClient();

  const { data: ratings } = await supabase
    .from('ratings')
    .select('*, products(name_ar)')
    .order('created_at', { ascending: false });

  const grouped = {};
  (ratings || []).forEach((r) => {
    const key = r.product_id;
    if (!grouped[key]) {
      grouped[key] = { name: r.products?.name_ar || '—', entries: [] };
    }
    grouped[key].entries.push(r);
  });

  const summaries = Object.entries(grouped).map(([productId, data]) => {
    const avg = data.entries.reduce((sum, e) => sum + e.rating, 0) / data.entries.length;
    return { productId, name: data.name, avg, count: data.entries.length, entries: data.entries };
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-2xl font-bold text-ink">{t('viewRatings')}</h1>

      <div className="mt-8 space-y-6">
        {summaries.map((s) => (
          <div key={s.productId} className="rounded-xl bg-white border border-sage-line p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-ink">{s.name}</h3>
              <div className="flex items-center gap-1 text-amber">
                <Star size={16} className="fill-amber" />
                <span className="font-bold">{s.avg.toFixed(1)}</span>
                <span className="text-ink/50 text-sm">({s.count})</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {s.entries.map((entry) => (
                <div key={entry.id} className="flex items-center gap-1 rounded-full bg-stone px-3 py-1 text-xs">
                  <span>{entry.rating} ★</span>
                  <DeleteRatingButton ratingId={entry.id} />
                </div>
              ))}
            </div>
          </div>
        ))}
        {summaries.length === 0 && <p className="text-ink/50">{t('noRatings')}</p>}
      </div>
    </div>
  );
}