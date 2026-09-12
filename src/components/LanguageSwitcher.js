'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
  { code: 'ku', label: 'کوردی' },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-ink/70 hover:text-pine"
        aria-label="Language"
      >
        <Globe size={18} />
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 inset-e-0 w-32 rounded-xl bg-white border border-sage-line shadow-lg overflow-hidden z-50">
            {languages.map((lang) => (
              <Link
                key={lang.code}
                href={pathname}
                locale={lang.code}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 text-sm hover:bg-stone ${lang.code === locale ? 'text-pine font-semibold' : 'text-ink'}`}
              >
                {lang.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}