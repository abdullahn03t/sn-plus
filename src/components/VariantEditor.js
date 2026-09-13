'use client';

export default function VariantEditor({ variants, setVariants, t }) {
  function addVariant() {
    setVariants([...variants, { tempId: crypto.randomUUID(), variant_type: 'flavor', label_ar: '', label_en: '', is_available: true }]);
  }

  function updateVariant(index, field, value) {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  }

  function removeVariant(index) {
    setVariants(variants.filter((_, i) => i !== index));
  }

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-ink/70">{t('variants')}</label>
      <p className="text-xs text-ink/50 mt-1">{t('variantsHint')}</p>
      <div className="mt-2 space-y-3">
        {variants.map((v, index) => (
          <div key={v.id || v.tempId} className="rounded-lg border border-sage-line p-3 flex flex-wrap gap-2 items-center">
            <select value={v.variant_type} onChange={(e) => updateVariant(index, 'variant_type', e.target.value)} className="rounded-lg border border-sage-line px-2 py-1.5 text-sm">
              <option value="flavor">{t('variantFlavor')}</option>
              <option value="size">{t('variantSize')}</option>
            </select>
            <input type="text" dir="rtl" placeholder={t('variantLabelAr')} value={v.label_ar} onChange={(e) => updateVariant(index, 'label_ar', e.target.value)} className="flex-1 min-w-[100px] rounded-lg border border-sage-line px-2 py-1.5 text-sm" />
            <input type="text" dir="ltr" placeholder={t('variantLabelEn')} value={v.label_en} onChange={(e) => updateVariant(index, 'label_en', e.target.value)} className="flex-1 min-w-[100px] rounded-lg border border-sage-line px-2 py-1.5 text-sm" />
            <label className="flex items-center gap-1 text-xs text-ink/60 whitespace-nowrap">
              <input type="checkbox" checked={v.is_available} onChange={(e) => updateVariant(index, 'is_available', e.target.checked)} className="accent-pine" />
              {t('isAvailable')}
            </label>
            <button type="button" onClick={() => removeVariant(index)} className="text-red-600 text-lg leading-none">×</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addVariant} className="mt-2 text-sm font-medium text-pine hover:underline">
        + {t('addVariant')}
      </button>
    </div>
  );
}