import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { supabase } from '@/lib/supabase';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';

export default async function ProductsPage({ searchParams }) {
  const locale = await getLocale();
  const t = await getTranslations('products');
  const { category, q } = await searchParams;

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('created_at');

  let query = supabase
    .from('products')
    .select('*, categories(slug, name_ar, name_en)')
    .order('created_at', { ascending: false });

  if (category) {
    const matched = categories?.find((c) => c.slug === category);
    if (matched) {
      query = query.eq('category_id', matched.id);
    }
  }

  if (q) {
    query = query.or(`name_ar.ilike.%${q}%,name_en.ilike.%${q}%,description_ar.ilike.%${q}%,description_en.ilike.%${q}%`);
  }

  const { data: products } = await query;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-ink">{t('title')}</h1>

      <div className="mt-6">
        <SearchBar />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={q ? `/products?q=${encodeURIComponent(q)}` : '/products'} className={`rounded-full px-4 py-2 text-sm font-medium ${!category ? 'bg-pine text-white' : 'bg-white border border-sage-line text-ink'}`}>
          {t('all')}
        </Link>
        {categories?.map((cat) => {
          const params = new URLSearchParams();
          params.set('category', cat.slug);
          if (q) params.set('q', q);
          return (
            <Link key={cat.id} href={`/products?${params.toString()}`} className={`rounded-full px-4 py-2 text-sm font-medium ${category === cat.slug ? 'bg-pine text-white' : 'bg-white border border-sage-line text-ink'}`}>
              {locale === 'ar' ? cat.name_ar : cat.name_en}
            </Link>
          );
        })}
      </div>

      {products && products.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} unavailableLabel={t('unavailable')} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-ink/60">{t('empty')}</p>
      )}
    </div>
  );
}