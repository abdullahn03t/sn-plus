'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { getWhatsappLink } from '@/lib/whatsapp';

const navItems = [
  { key: 'home', href: '/' },
  { key: 'products', href: '/products' },
  { key: 'blog', href: '/blog' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
];

export default function Header() {
  const t = useTranslations('nav');
  const tHeader = useTranslations('header');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const otherLocale = locale === 'ar' ? 'en' : 'ar';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-sage-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-ink">SN</span>
          <span className="text-amber">+</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.key} href={item.href} className="text-sm font-medium text-ink/80 hover:text-pine transition-colors">
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href={pathname} locale={otherLocale} className="text-sm font-medium text-ink/70 hover:text-pine">
            {tHeader('switchLanguage')}
          </Link>
          <a href={getWhatsappLink(tHeader('whatsappGenericMessage'))} target="_blank" rel="noopener noreferrer" className="rounded-full bg-pine px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
            {tHeader('whatsappCta')}
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-ink" aria-label="Menu">
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-sage-line bg-white">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link key={item.key} href={item.href} onClick={() => setOpen(false)} className="text-base font-medium text-ink">
                {t(item.key)}
              </Link>
            ))}
            <Link href={pathname} locale={otherLocale} className="text-base font-medium text-ink/70">
              {tHeader('switchLanguage')}
            </Link>
            <a href={getWhatsappLink(tHeader('whatsappGenericMessage'))} target="_blank" rel="noopener noreferrer" className="rounded-full bg-pine px-5 py-3 text-center text-sm font-semibold text-white">
              {tHeader('whatsappCta')}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}