import { Link } from '@/i18n/navigation';
import { Package } from 'lucide-react';
import Image from 'next/image';

const NEW_BADGE_DAYS = 14;

export default function ProductCard({ product, locale, unavailableLabel, newLabel }) {
  const name = locale === 'en' ? product.name_en : product.name_ar;
  const description = locale === 'en' ? product.description_en : product.description_ar;

  const isNew = product.created_at &&
    (Date.now() - new Date(product.created_at).getTime()) < NEW_BADGE_DAYS * 24 * 60 * 60 * 1000;

  return (
    <Link href={`/products/${product.id}`} className="group rounded-2xl bg-white border border-sage-line overflow-hidden hover:border-pine transition-colors">
      <div className="aspect-square bg-stone relative">
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="text-sage-line" size={48} />
          </div>
        )}
        {!product.is_available && (
          <div className="absolute top-3 inset-s-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white">
            {unavailableLabel}
          </div>
        )}
        {isNew && product.is_available && (
          <div className="absolute top-3 inset-e-3 rounded-full bg-amber px-3 py-1 text-xs font-semibold text-white">
            {newLabel}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-ink group-hover:text-pine transition-colors">{name}</h3>
        <p className="mt-1 text-sm text-ink/60 line-clamp-2">{description}</p>
        {product.price != null && (
          <p className="mt-2 font-bold text-pine">{product.price.toLocaleString()} د.ع</p>
        )}
      </div>
    </Link>
  );
}