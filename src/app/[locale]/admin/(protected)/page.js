import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import SignOutButton from '@/components/SignOutButton';
import DeleteProductButton from '@/components/DeleteProductButton';
import { Plus, Tags, Newspaper, Building2, Star, Package, FileText } from 'lucide-react';

export default async function AdminDashboard() {
  const t = await getTranslations('admin');
  const supabase = await createSupabaseServerClient();

  const [
    { data: products },
    { count: productsCount },
    { count: categoriesCount },
    { count: companiesCount },
    { count: postsCount },
    { data: allRatings },
  ] = await Promise.all([
    supabase.from('products').select('*, categories(name_ar)').order('created_at', { ascending: false }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('ratings').select('rating'),
  ]);

  const ratingsCount = allRatings?.length || 0;
  const ratingsAvg = ratingsCount > 0
    ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / ratingsCount).toFixed(1)
    : null;

  const stats = [
    { label: t('statProducts'), value: productsCount || 0, icon: Package },
    { label: t('statCategories'), value: categoriesCount || 0, icon: Tags },
    { label: t('statCompanies'), value: companiesCount || 0, icon: Building2 },
    { label: t('statPosts'), value: postsCount || 0, icon: FileText },
    { label: t('statRatings'), value: ratingsAvg ? `${ratingsAvg} ★ (${ratingsCount})` : '—', icon: Star },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">{t('dashboardTitle')}</h1>
        <SignOutButton label={t('signOut')} />
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl bg-white border border-sage-line p-4 text-center">
              <Icon className="mx-auto text-pine" size={20} />
              <p className="mt-2 text-xl font-bold text-ink">{stat.value}</p>
              <p className="text-xs text-ink/50">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity">
          <Plus size={18} />
          {t('addProduct')}
        </Link>
        <Link href="/admin/categories" className="inline-flex items-center gap-2 rounded-full bg-white border border-sage-line px-6 py-3 text-ink font-semibold hover:border-pine transition-colors">
          <Tags size={18} />
          {t('manageCategories')}
        </Link>
        <Link href="/admin/companies" className="inline-flex items-center gap-2 rounded-full bg-white border border-sage-line px-6 py-3 text-ink font-semibold hover:border-pine transition-colors">
          <Building2 size={18} />
          {t('manageCompanies')}
        </Link>
        <Link href="/admin/posts" className="inline-flex items-center gap-2 rounded-full bg-white border border-sage-line px-6 py-3 text-ink font-semibold hover:border-pine transition-colors">
          <Newspaper size={18} />
          {t('managePosts')}
        </Link>
        <Link href="/admin/ratings" className="inline-flex items-center gap-2 rounded-full bg-white border border-sage-line px-6 py-3 text-ink font-semibold hover:border-pine transition-colors">
          <Star size={18} />
          {t('viewRatings')}
        </Link>
      </div>

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