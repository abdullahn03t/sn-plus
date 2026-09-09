import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { supabase } from '@/lib/supabase';
import { getWhatsappLink } from '@/lib/whatsapp';
import { notFound } from 'next/navigation';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import ProductGallery from '@/components/ProductGallery';

export default async function ProductDetailPage({ params }) {
  const { id, locale } = await params;
  const t = await getTranslations('productDetail');

  const { data: product, error } = await supabase
    .from('products')
    .select('*, categories(name_ar, name_en)')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const description = locale === 'ar' ? product.description_ar : product.description_en;
  const categoryName = product.categories
    ? (locale === 'ar' ? product.categories.name_ar : product.categories.name_en)
    : null;

  const whatsappMessage =
    locale === 'ar'
      ? `مرحبًا، أرغب بالاستفسار عن منتج: ${name}`
      : `Hello, I'd like to ask about this product: ${name}`;

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
    </div>
  );
}