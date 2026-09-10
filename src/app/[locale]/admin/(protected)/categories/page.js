import { getTranslations } from 'next-intl/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import CategoryManager from '@/components/CategoryManager';

export default async function CategoriesPage() {
  const t = await getTranslations('admin');
  const supabase = await createSupabaseServerClient();
  const { data: categories } = await supabase.from('categories').select('*').order('name_ar');

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-2xl font-bold text-ink">{t('manageCategories')}</h1>
      <div className="mt-8">
        <CategoryManager categories={categories || []} />
      </div>
    </div>
  );
}