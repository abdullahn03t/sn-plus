'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

export default function CompanyFilter({ companies }) {
  const t = useTranslations('products');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCompany = searchParams.get('company') || '';

  function handleChange(e) {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set('company', e.target.value);
    } else {
      params.delete('company');
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select value={currentCompany} onChange={handleChange} className="rounded-full border border-sage-line bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-pine">
      <option value="">{t('allCompanies')}</option>
      {companies.map((company) => (
        <option key={company.id} value={company.slug}>
          {locale === 'en' ? company.name_en : company.name_ar}
        </option>
      ))}
    </select>
  );
}