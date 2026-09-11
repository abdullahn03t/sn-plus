'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="rounded-xl bg-white border border-sage-line overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between p-5 text-start"
            >
              <span className="font-semibold text-ink">{item.question}</span>
              <ChevronDown className={`text-ink/50 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-ink/70 leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}