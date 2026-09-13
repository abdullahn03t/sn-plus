import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getWhatsappLink } from '@/lib/whatsapp';
import { socialLinks } from '@/lib/social';
import { MessageCircle } from 'lucide-react';

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations('nav');
  const tFooter = useTranslations('footer');
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
              <li><Link href="/calculator" className="text-sm text-white/80 hover:text-white">{t('calculator')}</Link></li>
              <li><Link href="/about" className="text-sm text-white/80 hover:text-white">{t('about')}</Link></li>
              <li><Link href="/contact" className="text-sm text-white/80 hover:text-white">{t('contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/60">{tFooter('followUs')}</h3>
            <div className="mt-4 flex items-center gap-3">
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <InstagramIcon width={18} height={18} />
              </a>
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <FacebookIcon width={18} height={18} />
              </a>
              <a href={getWhatsappLink('مرحبا')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/50">
          © {year} SN+ — {tFooter('rights')}
        </div>
      </div>
    </footer>
  );
}