import { getTranslations } from 'next-intl/server';
import { getWhatsappLink } from '@/lib/whatsapp';
import { MessageCircle, Phone } from 'lucide-react';

export async function generateMetadata() {
  const t = await getTranslations('contact');
  return { title: t('title') };
}

export default async function ContactPage() {
  const t = await getTranslations('contact');
  const tHeader = await getTranslations('header');

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-3xl font-bold text-ink">{t('title')}</h1>
      <p className="mt-3 text-ink/70">{t('subtitle')}</p>

      <div className="mt-10 rounded-2xl bg-white border border-sage-line p-10">
        <MessageCircle className="mx-auto text-pine" size={40} />
        <h2 className="mt-4 text-xl font-bold text-ink">{t('whatsappTitle')}</h2>
        <p className="mt-2 text-ink/60">{t('whatsappDesc')}</p>
        <a
          href={getWhatsappLink(tHeader('whatsappGenericMessage'))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-pine px-8 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          <Phone size={18} />
          {tHeader('whatsappCta')}
        </a>
      </div>
    </div>
  );
}