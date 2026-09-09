import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import SignOutButton from '@/components/SignOutButton';
import DeleteProductButton from '@/components/DeleteProductButton';
import { Plus } from 'lucide-react';

export default async function AdminDashboard() {
  const t = await getTranslations('admin');
  const supabase = await createSupabaseServerClient();

  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name_ar)')
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">{t('dashboardTitle')}</h1>
        <SignOutButton label={t('signOut')} />
      </div>

      <Link href="/admin/products/new" className="mt-6 inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity">
        <Plus size={18} />
        {t('addProduct')}
      </Link>

      <div className="mt-8 space-y-3">
        {products?.map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded-xl bg-white border border-sage-line p-4">
            <div>
              <p className="font-semibold text-ink">{product.name_ar}</p>
              <p className="text-sm text-ink/50">{product.categories?.name_ar || t('noCategory')}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/admin/products/${product.id}/edit`} className="text-sm font-medium text-pine hover:underline">
                {t('edit')}
              </Link>
              <DeleteProductButton productId={product.id} confirmLabel={t('confirmDelete')} />
            </div>
          </div>
        ))}
        {(!products || products.length === 0) && (
          <p className="text-ink/50">{t('noProducts')}</p>
        )}
      </div>
    </div>
  );
}