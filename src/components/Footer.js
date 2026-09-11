import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getWhatsappLink } from '@/lib/whatsapp';

export default function Footer() {
  const t = useTranslations('nav');
  const tFooter = useTranslations('footer');
  const tHeader = useTranslations('header');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-pine text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="text-xl font-bold">
              <span>SN</span>
              <span className="text-amber">+</span>
            </div>
            <p className="mt-3 text-sm text-white/70 max-w-xs">{tFooter('tagline')}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/60">{tFooter('quickLinks')}</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-sm text-white/80 hover:text-white">{t('home')}</Link></li>
              <li><Link href="/products" className="text-sm text-white/80 hover:text-white">{t('products')}</Link></li>
              <li><Link href="/blog" className="text-sm text-white/80 hover:text-white">{t('blog')}</Link></li>
              <li><Link href="/about" className="text-sm text-white/80 hover:text-white">{t('about')}</Link></li>
              <li><Link href="/contact" className="text-sm text-white/80 hover:text-white">{t('contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/60">{tFooter('followUs')}</h3>
            <a href={getWhatsappLink(tHeader('whatsappGenericMessage'))} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition-colors">
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/50">
          © {year} SN+ — {tFooter('rights')}
        </div>
      </div>
    </footer>
  );
}