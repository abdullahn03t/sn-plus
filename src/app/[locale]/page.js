import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getWhatsappLink } from '@/lib/whatsapp';
import { ShieldCheck, Layers, MessageCircle, Dumbbell, Pill, Zap, HeartPulse } from 'lucide-react';

const categories = [
  { key: 'protein', icon: Dumbbell },
  { key: 'vitamins', icon: Pill },
  { key: 'energy', icon: Zap },
  { key: 'wellness', icon: HeartPulse },
];

const values = [
  { key: 'quality', icon: ShieldCheck },
  { key: 'range', icon: Layers },
  { key: 'support', icon: MessageCircle },
];

export default function Home() {
  const t = useTranslations('home');
  const tHeader = useTranslations('header');

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-ink leading-tight">{t('heroTitle')}</h1>
            <p className="mt-6 text-lg text-ink/70 max-w-md">{t('heroSubtitle')}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="rounded-full bg-pine px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity">
                {t('browseProducts')}
              </Link>
              <a href={getWhatsappLink(tHeader('whatsappGenericMessage'))} target="_blank" rel="noopener noreferrer" className="rounded-full border border-pine px-6 py-3 text-pine font-semibold hover:bg-pine hover:text-white transition-colors">
                {tHeader('whatsappCta')}
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.key} className="rounded-2xl bg-white border border-sage-line p-6 flex flex-col items-start gap-3">
                  <Icon className="text-pine" size={28} />
                  <span className="text-sm font-semibold text-ink">{t(`categories.${cat.key}`)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-sage-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-10">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.key}>
                  <Icon className="text-amber" size={32} />
                  <h3 className="mt-4 text-lg font-bold text-ink">{t(`values.${v.key}Title`)}</h3>
                  <p className="mt-2 text-ink/70">{t(`values.${v.key}Desc`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-amber/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-ink">{t('ctaTitle')}</h2>
          <p className="mt-3 text-ink/70">{t('ctaSubtitle')}</p>
          <Link href="/products" className="mt-6 inline-block rounded-full bg-pine px-8 py-3 text-white font-semibold hover:opacity-90 transition-opacity">
            {t('browseProducts')}
          </Link>
        </div>
      </section>
    </>
  );
}