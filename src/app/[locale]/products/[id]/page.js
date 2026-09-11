import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getProduct } from '@/lib/products';
import { supabase } from '@/lib/supabase';
import { getWhatsappLink } from '@/lib/whatsapp';
import { notFound } from 'next/navigation';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const { data: product } = await getProduct(id);

  if (!product) {
    return {};
  }

  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const description = locale === 'ar' ? product.description_ar : product.description_en;
  const image = product.images?.[0];

  return {
    title: name,
    description: description || undefined,
    openGraph: {
      title: `${name} — SN+`,
      description: description || undefined,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { id, locale } = await params;
  const t = await getTranslations('productDetail');
  const tProducts = await getTranslations('products');

  const { data: product, error } = await getProduct(id);

  if (error || !product) {
    notFound();
  }

  let relatedQuery = supabase
    .from('products')
    .select('*')
    .neq('id', id)
    .order('created_at', { ascending: false })
    .limit(4);

  if (product.category_id) {
    relatedQuery = relatedQuery.eq('category_id', product.category_id);
  }

  const { data: relatedProducts } = await relatedQuery;

  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const description = locale === 'ar' ? product.description_ar : product.description_en;
  const categoryName = product.categories
    ? (locale === 'ar' ? product.categories.name_ar : product.categories.name_en)
    : null;

  const whatsappMessage = product.is_available
    ? (locale === 'ar' ? `مرحبًا، أرغب بالاستفسار عن منتج: ${name}` : `Hello, I'd like to ask about this product: ${name}`)
    : (locale === 'ar' ? `مرحبًا، أرغب أعرف متى يتوفر منتج: ${name}` : `Hello, I'd like to know when this product will be available again: ${name}`);

  const BackIcon = locale === 'ar' ? ChevronRight : ChevronLeft;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-pine">
        <BackIcon size={16} />
        {t('backToProducts')}
      </Link>

      <div className="mt-8 grid md:grid-cols-2 gap-12">
        <ProductGallery images={product.images || []} name={name} />

        <div>
          {categoryName && (
            <span className="text-sm font-medium text-pine">{categoryName}</span>
          )}
          <h1 className="mt-2 text-3xl font-bold text-ink">{name}</h1>

          {!product.is_available && (
            <span className="mt-3 inline-block rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white">
              {t('unavailable')}
            </span>
          )}

          <p className="mt-4 text-ink/70 leading-relaxed whitespace-pre-line">
            {description}
          </p>

          <a
            href={getWhatsappLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-pine px-8 py-4 text-white font-semibold w-full sm:w-auto hover:opacity-90 transition-opacity"
          >
            {t('inquireOnWhatsapp')}
          </a>
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-xl font-bold text-ink">{t('relatedProducts')}</h2>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} unavailableLabel={tProducts('unavailable')} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}