'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-stone border border-sage-line flex items-center justify-center">
        <Package className="text-sage-line" size={64} />
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-square rounded-2xl overflow-hidden bg-stone relative">
        <Image src={images[active]} alt={name} fill className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden relative border-2 ${i === active ? 'border-pine' : 'border-transparent'}`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}