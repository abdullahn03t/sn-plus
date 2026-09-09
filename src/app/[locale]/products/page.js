import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { supabase } from '@/lib/supabase';
import { Package } from 'lucide-react';
import Image from 'next/image';

export default async function ProductsPage({ searchParams }) {
  const locale = await getLocale();
  const t = await getTranslations('products');
  const { category } = await searchParams;

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

  const { data: products } = await query;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-ink">{t('title')}</h1>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/products" className={`rounded-full px-4 py-2 text-sm font-medium ${!category ? 'bg-pine text-white' : 'bg-white border border-sage-line text-ink'}`}>
          {t('all')}
        </Link>
        {categories?.map((cat) => (
          <Link key={cat.id} href={`/products?category=${cat.slug}`} className={`rounded-full px-4 py-2 text-sm font-medium ${category === cat.slug ? 'bg-pine text-white' : 'bg-white border border-sage-line text-ink'}`}>
            {locale === 'ar' ? cat.name_ar : cat.name_en}
          </Link>
        ))}
      </div>

      {products && products.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group rounded-2xl bg-white border border-sage-line overflow-hidden hover:border-pine transition-colors">
              <div className="aspect-square bg-stone relative">
                {product.images?.[0] ? (
                  <Image src={product.images[0]} alt={locale === 'ar' ? product.name_ar : product.name_en} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="text-sage-line" size={48} />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-ink group-hover:text-pine transition-colors">
                  {locale === 'ar' ? product.name_ar : product.name_en}
                </h3>
                <p className="mt-1 text-sm text-ink/60 line-clamp-2">
                  {locale === 'ar' ? product.description_ar : product.description_en}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-ink/60">{t('empty')}</p>
      )}
    </div>
  );
}