import { getTranslations } from 'next-intl/server';
import { ClipboardCheck, Eye, MessageCircle } from 'lucide-react';

export default async function AboutPage() {
  const t = await getTranslations('about');

  const values = [
    { key: 1, icon: ClipboardCheck, title: t('value1Title'), desc: t('value1Desc') },
    { key: 2, icon: Eye, title: t('value2Title'), desc: t('value2Desc') },
    { key: 3, icon: MessageCircle, title: t('value3Title'), desc: t('value3Desc') },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-ink text-center">{t('title')}</h1>
      <p className="mt-6 text-lg text-ink/70 leading-relaxed text-center max-w-2xl mx-auto">
        {t('intro')}
      </p>

      <div className="mt-14 grid sm:grid-cols-3 gap-8">
        {values.map((v) => {
          const Icon = v.icon;
          return (
            <div key={v.key} className="text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-amber/10 flex items-center justify-center">
                <Icon className="text-amber" size={24} />
              </div>
              <h3 className="mt-4 font-bold text-ink">{v.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{v.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}