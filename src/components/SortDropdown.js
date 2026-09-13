'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SortDropdown() {
  const t = useTranslations('products');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'newest';

  function handleChange(e) {
    const params = new URLSearchParams(searchParams);
    if (e.target.value === 'newest') {
      params.delete('sort');
    } else {
      params.set('sort', e.target.value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={currentSort}
      onChange={handleChange}
      className="rounded-full border border-sage-line bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-pine"
    >
      <option value="newest">{t('sortNewest')}</option>
      <option value="nameAsc">{t('sortNameAsc')}</option>
      <option value="priceAsc">{t('sortPriceAsc')}</option>
      <option value="priceDesc">{t('sortPriceDesc')}</option>
    </select>
  );
}