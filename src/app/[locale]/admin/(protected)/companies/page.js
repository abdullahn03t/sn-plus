import { getTranslations } from 'next-intl/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import CompanyManager from '@/components/CompanyManager';

export default async function CompaniesPage() {
  const t = await getTranslations('admin');
  const supabase = await createSupabaseServerClient();
  const { data: companies } = await supabase.from('companies').select('*').order('name_ar');

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-2xl font-bold text-ink">{t('manageCompanies')}</h1>
      <div className="mt-8">
        <CompanyManager companies={companies || []} />
      </div>
    </div>
  );
}