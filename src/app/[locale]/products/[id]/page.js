import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getProduct } from '@/lib/products';
import { supabase } from '@/lib/supabase';
import { getWhatsappLink } from '@/lib/whatsapp';
import { notFound } from 'next/navigation';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';
import RatingWidget from '@/components/RatingWidget';

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const { data: product } = await getProduct(id);

  if (!product) {
    return {};
  }

  const name = locale === 'en' ? product.name_en : product.name_ar;
  const description = locale === 'en' ? product.description_en : product.description_ar;
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

  const name = locale === 'en' ? product.name_en : product.name_ar;
  const description = locale === 'en' ? product.description_en : product.description_ar;
  const categoryName = product.categories
    ? (locale === 'en' ? product.categories.name_en : product.categories.name_ar)
    : null;
  const companyName = product.companies
    ? (locale === 'en' ? product.companies.name_en : product.companies.name_ar)
    : null;

  const flavorVariants = (product.product_variants || []).filter((v) => v.variant_type === 'flavor');
  const sizeVariants = (product.product_variants || []).filter((v) => v.variant_type === 'size');

  const hasPrice = product.price != null;

  let whatsappMessage;
  if (!product.is_available) {
    whatsappMessage = locale === 'en'
      ? `Hello, I'd like to know when this product will be available again: ${name}`
      : `مرحبًا، أرغب أعرف متى يتوفر منتج: ${name}`;
  } else if (hasPrice) {
    whatsappMessage = locale === 'en'
      ? `Hello, I'd like to order: ${name} (${product.price} IQD)`
      : `مرحبًا، أرغب بطلب منتج: ${name} (${product.price} د.ع)`;
  } else {
    whatsappMessage = locale === 'en'
      ? `Hello, I'd like to ask about this product: ${name}`
      : `مرحبًا، أرغب بالاستفسار عن منتج: ${name}`;
  }

  const ctaLabel = hasPrice && product.is_available ? t('orderOnWhatsapp') : t('inquireOnWhatsapp');
  const BackIcon = locale === 'en' ? ChevronLeft : ChevronRight;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-pine">
        <BackIcon size={16} />
        {t('backToProducts')}
      </Link>

      <div className="mt-8 grid md:grid-cols-2 gap-12">
        <ProductGallery images={product.images || []} name={name} />

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            {companyName && <span className="text-sm font-medium text-ink/60">{companyName}</span>}
            {companyName && categoryName && <span className="text-ink/30">•</span>}
            {categoryName && <span className="text-sm font-medium text-pine">{categoryName}</span>}
          </div>
          <h1 className="mt-2 text-3xl font-bold text-ink">{name}</h1>

          {!product.is_available && (
            <span className="mt-3 inline-block rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white">
              {t('unavailable')}
            </span>
          )}

          {hasPrice && (
            <p className="mt-3 text-2xl font-bold text-pine">{product.price.toLocaleString()} د.ع</p>
          )}

          <p className="mt-4 text-ink/70 leading-relaxed whitespace-pre-line">
            {description}
          </p>

          {(flavorVariants.length > 0 || sizeVariants.length > 0) && (
            <div className="mt-4 space-y-3">
              {flavorVariants.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-ink/50 mb-1.5">{t('flavors')}</p>
                  <div className="flex flex-wrap gap-2">
                    {flavorVariants.map((v) => (
                      <span key={v.id} className={`rounded-full border px-3 py-1 text-xs font-medium ${v.is_available ? 'border-sage-line text-ink' : 'border-sage-line text-ink/30 line-through'}`}>
                        {locale === 'en' ? v.label_en : v.label_ar}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {sizeVariants.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-ink/50 mb-1.5">{t('sizes')}</p>
                  <div className="flex flex-wrap gap-2">
                    {sizeVariants.map((v) => (
                      <span key={v.id} className={`rounded-full border px-3 py-1 text-xs font-medium ${v.is_available ? 'border-sage-line text-ink' : 'border-sage-line text-ink/30 line-through'}`}>
                        {locale === 'en' ? v.label_en : v.label_ar}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <a
            href={getWhatsappLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-pine px-8 py-4 text-white font-semibold w-full sm:w-auto hover:opacity-90 transition-opacity"
          >
            {ctaLabel}
          </a>

          <RatingWidget productId={product.id} />
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-xl font-bold text-ink">{t('relatedProducts')}</h2>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} unavailableLabel={tProducts('unavailable')} newLabel={tProducts('newBadge')} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}