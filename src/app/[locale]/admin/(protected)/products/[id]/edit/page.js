import { getTranslations } from 'next-intl/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import ProductForm from '@/components/ProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const t = await getTranslations('admin');
  const supabase = await createSupabaseServerClient();

  const [{ data: categories }, { data: companies }, { data: product }, { data: variants }] = await Promise.all([
    supabase.from('categories').select('*').order('name_ar'),
    supabase.from('companies').select('*').order('name_ar'),
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('product_variants').select('*').eq('product_id', id).order('created_at'),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-2xl font-bold text-ink">{t('editProduct')}</h1>
      <div className="mt-8">
        <ProductForm categories={categories || []} companies={companies || []} initialData={product} initialVariants={variants || []} productId={id} />
      </div>
    </div>
  );
}