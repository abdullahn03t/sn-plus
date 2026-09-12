import { getTranslations } from 'next-intl/server';
import Calculator from '@/components/Calculator';

export async function generateMetadata() {
  const t = await getTranslations('calculator');
  return { title: t('title') };
}

export default async function CalculatorPage() {
  const t = await getTranslations('calculator');

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-ink text-center">{t('title')}</h1>
      <p className="mt-3 text-ink/60 text-center max-w-xl mx-auto">{t('subtitle')}</p>

      <div className="mt-10">
        <Calculator />
      </div>
    </div>
  );
}