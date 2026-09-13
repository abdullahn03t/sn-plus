import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { supabase } from '@/lib/supabase';
import SearchBar from '@/components/SearchBar';
import SortDropdown from '@/components/SortDropdown';
import CompanyFilter from '@/components/CompanyFilter';
import ProductCard from '@/components/ProductCard';

function buildHref(base, params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

export default async function ProductsPage({ searchParams }) {
  const locale = await getLocale();
  const t = await getTranslations('products');
  const { category, company, q, sort } = await searchParams;

  const [{ data: categories }, { data: companies }] = await Promise.all([
    supabase.from('categories').select('*').order('created_at'),
    supabase.from('companies').select('*').order('created_at'),
  ]);

  let query = supabase
    .from('products')
    .select('*, categories(slug, name_ar, name_en)');

  if (category) {
    const matched = categories?.find((c) => c.slug === category);
    if (matched) {
      query = query.eq('category_id', matched.id);
    }
  }

  if (company) {
    const matchedCompany = companies?.find((c) => c.slug === company);
    if (matchedCompany) {
      query = query.eq('company_id', matchedCompany.id);
    }
  }

  if (q) {
    query = query.or(`name_ar.ilike.%${q}%,name_en.ilike.%${q}%,description_ar.ilike.%${q}%,description_en.ilike.%${q}%`);
  }

  if (sort === 'priceAsc') {
    query = query.order('price', { ascending: true, nullsFirst: false });
  } else if (sort === 'priceDesc') {
    query = query.order('price', { ascending: false, nullsFirst: false });
  } else if (sort === 'nameAsc') {
    query = query.order(locale === 'en' ? 'name_en' : 'name_ar', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data: products } = await query;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-ink">{t('title')}</h1>

      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-50">
          <SearchBar />
        </div>
        {companies && companies.length > 0 && <CompanyFilter companies={companies} />}
        <SortDropdown />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={buildHref('/products', { company, q, sort })} className={`rounded-full px-4 py-2 text-sm font-medium ${!category ? 'bg-pine text-white' : 'bg-white border border-sage-line text-ink'}`}>
          {t('all')}
        </Link>
        {categories?.map((cat) => (
          <Link key={cat.id} href={buildHref('/products', { category: cat.slug, company, q, sort })} className={`rounded-full px-4 py-2 text-sm font-medium ${category === cat.slug ? 'bg-pine text-white' : 'bg-white border border-sage-line text-ink'}`}>
            {locale === 'en' ? cat.name_en : cat.name_ar}
          </Link>
        ))}
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