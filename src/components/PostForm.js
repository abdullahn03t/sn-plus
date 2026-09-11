'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function PostForm({ initialData, postId }) {
  const t = useTranslations('admin');
  const router = useRouter();
  const isEditing = Boolean(postId);

  const [titleAr, setTitleAr] = useState(initialData?.title_ar || '');
  const [titleEn, setTitleEn] = useState(initialData?.title_en || '');
  const [excerptAr, setExcerptAr] = useState(initialData?.excerpt_ar || '');
  const [excerptEn, setExcerptEn] = useState(initialData?.excerpt_en || '');
  const [contentAr, setContentAr] = useState(initialData?.content_ar || '');
  const [contentEn, setContentEn] = useState(initialData?.content_en || '');
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [coverImage, setCoverImage] = useState(initialData?.cover_image || null);
  const [newFile, setNewFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const supabase = createSupabaseBrowserClient();
    let finalCoverImage = coverImage;

    if (newFile) {
      const ext = newFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, newFile);

      if (uploadError) {
        setError(t('uploadError'));
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
      finalCoverImage = urlData.publicUrl;
    }

    const payload = {
      title_ar: titleAr,
      title_en: titleEn,
      excerpt_ar: excerptAr,
      excerpt_en: excerptEn,
      content_ar: contentAr,
      content_en: contentEn,
      cover_image: finalCoverImage,
      published,
    };

    const { error: saveError } = isEditing
      ? await supabase.from('posts').update(payload).eq('id', postId)
      : await supabase.from('posts').insert(payload);

    setSaving(false);

    if (saveError) {
      setError(t('saveError'));
      return;
    }

    router.push('/admin/posts');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink/70">{t('postTitleAr')}</label>
          <input type="text" required dir="rtl" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70">{t('postTitleEn')}</label>
          <input type="text" required dir="ltr" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-ink/70">{t('excerptAr')}</label>
          <textarea rows={2} dir="rtl" value={excerptAr} onChange={(e) => setExcerptAr(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70">{t('excerptEn')}</label>
          <textarea rows={2} dir="ltr" value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-ink/70">{t('contentAr')}</label>
          <textarea rows={10} dir="rtl" required value={contentAr} onChange={(e) => setContentAr(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70">{t('contentEn')}</label>
          <textarea rows={10} dir="ltr" required value={contentEn} onChange={(e) => setContentEn(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-ink/70">{t('coverImage')}</label>
        {coverImage && (
          <div className="mt-2 relative w-32 h-20">
            <img src={coverImage} alt="" className="w-full h-full object-cover rounded-lg" />
            <button type="button" onClick={() => setCoverImage(null)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">×</button>
          </div>
        )}
        <input type="file" accept="image/*" onChange={(e) => setNewFile(e.target.files[0])} className="mt-2 block w-full text-sm" />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input type="checkbox" id="published" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-4 h-4 accent-pine" />
        <label htmlFor="published" className="text-sm font-medium text-ink/70">{t('published')}</label>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={saving} className="mt-6 rounded-full bg-pine px-8 py-3 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
        {saving ? t('saving') : isEditing ? t('saveChanges') : t('addPost')}
      </button>
    </form>
  );
}