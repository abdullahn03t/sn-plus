import { getTranslations } from 'next-intl/server';
import { getWhatsappLink } from '@/lib/whatsapp';
import { MessageCircle, Phone } from 'lucide-react';
import FaqAccordion from '@/components/FaqAccordion';

export async function generateMetadata() {
  const t = await getTranslations('contact');
  return { title: t('title') };
}

export default async function ContactPage() {
  const t = await getTranslations('contact');
  const tHeader = await getTranslations('header');
  const faqItems = t.raw('faq');

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-ink text-center">{t('title')}</h1>
      <p className="mt-3 text-ink/70 text-center">{t('subtitle')}</p>

      <div className="mt-10 rounded-2xl bg-white border border-sage-line p-10 text-center">
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

      <div className="mt-16">
        <h2 className="text-xl font-bold text-ink text-center">{t('faqTitle')}</h2>
        <div className="mt-6">
          <FaqAccordion items={faqItems} />
        </div>
      </div>
    </div>
  );
}