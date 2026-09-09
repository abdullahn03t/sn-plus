import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-ink">{t('title')}</h1>
      <p className="mt-3 text-ink/60">{t('description')}</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-pine px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity">
        {t('backHome')}
      </Link>
    </div>
  );
}