import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { fontLatin, fontArabic } from '@/fonts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../globals.css';

export const metadata = {
  title: {
    default: 'SN+',
    template: '%s | SN+',
  },
  description: 'SN+ — منتجات مكملات غذائية عالية الجودة',
  openGraph: {
    siteName: 'SN+',
    type: 'website',
  },
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${fontLatin.variable} ${fontArabic.variable}`}>
      <body className="font-sans bg-stone text-ink antialiased">
        <NextIntlClientProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}