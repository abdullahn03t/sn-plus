'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import VariantEditor from '@/components/VariantEditor';

export default function ProductForm({ categories, companies, initialData, initialVariants, productId }) {
  const t = useTranslations('admin');
  const router = useRouter();
  const isEditing = Boolean(productId);

  const [nameAr, setNameAr] = useState(initialData?.name_ar || '');
  const [nameEn, setNameEn] = useState(initialData?.name_en || '');
  const [descAr, setDescAr] = useState(initialData?.description_ar || '');
  const [descEn, setDescEn] = useState(initialData?.description_en || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [companyId, setCompanyId] = useState(initialData?.company_id || '');
  const [price, setPrice] = useState(initialData?.price ?? '');
  const [isAvailable, setIsAvailable] = useState(initialData?.is_available ?? true);
  const [existingImages, setExistingImages] = useState(initialData?.images || []);
  const [newFiles, setNewFiles] = useState([]);
  const [variants, setVariants] = useState(initialVariants || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function removeExistingImage(url) {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const supabase = createSupabaseBrowserClient();
    const uploadedUrls = [];

    for (const file of newFiles) {
      const ext = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) {
        setError(t('uploadError'));
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
      uploadedUrls.push(urlData.publicUrl);
    }

    const payload = {
      name_ar: nameAr,
      name_en: nameEn,
      description_ar: descAr,
      description_en: descEn,
      category_id: categoryId || null,
      company_id: companyId || null,
      price: price === '' ? null : parseFloat(price),
      is_available: isAvailable,
      images: [...existingImages, ...uploadedUrls],
    };

    let currentProductId = productId;

    if (isEditing) {
      const { error: saveError } = await supabase.from('products').update(payload).eq('id', productId);
      if (saveError) {
        setError(t('saveError'));
        setSaving(false);
        return;
      }
    } else {
      const { data: inserted, error: saveError } = await supabase.from('products').insert(payload).select('id').single();
      if (saveError || !inserted) {
        setError(t('saveError'));
        setSaving(false);
        return;
      }
      currentProductId = inserted.id;
    }

    await supabase.from('product_variants').delete().eq('product_id', currentProductId);

    const validVariants = variants.filter((v) => v.label_ar.trim() && v.label_en.trim());
    if (validVariants.length > 0) {
      await supabase.from('product_variants').insert(
        validVariants.map((v) => ({
          product_id: currentProductId,
          variant_type: v.variant_type,
          label_ar: v.label_ar,
          label_en: v.label_en,
          is_available: v.is_available,
        }))
      );
    }

    setSaving(false);
    router.push('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink/70">{t('nameAr')}</label>
          <input type="text" required dir="rtl" value={nameAr} onChange={(e) => setNameAr(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70">{t('nameEn')}</label>
          <input type="text" required dir="ltr" value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-ink/70">{t('descAr')}</label>
          <textarea rows={4} dir="rtl" value={descAr} onChange={(e) => setDescAr(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70">{t('descEn')}</label>
          <textarea rows={4} dir="ltr" value={descEn} onChange={(e) => setDescEn(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-ink/70">{t('category')}</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine">
            <option value="">{t('noCategory')}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name_ar} / {cat.name_en}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70">{t('company')}</label>
          <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine">
            <option value="">{t('noCompany')}</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>{company.name_ar} / {company.name_en}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-ink/70">{t('price')}</label>
        <input type="number" min="0" step="0.01" placeholder={t('priceOptional')} value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 w-full sm:w-64 rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input type="checkbox" id="isAvailable" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="w-4 h-4 accent-pine" />
        <label htmlFor="isAvailable" className="text-sm font-medium text-ink/70">{t('isAvailable')}</label>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-ink/70">{t('images')}</label>
        {existingImages.length > 0 && (
          <div className="mt-2 flex gap-3 flex-wrap">
            {existingImages.map((url) => (
              <div key={url} className="relative w-20 h-20">
                <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                <button type="button" onClick={() => removeExistingImage(url)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">×</button>
              </div>
            ))}
          </div>
        )}
        <input type="file" multiple accept="image/*" onChange={(e) => setNewFiles(Array.from(e.target.files))} className="mt-2 block w-full text-sm" />
      </div>

      <VariantEditor variants={variants} setVariants={setVariants} t={t} />

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={saving} className="mt-6 rounded-full bg-pine px-8 py-3 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
        {saving ? t('saving') : isEditing ? t('saveChanges') : t('addProduct')}
      </button>
    </form>
  );
}