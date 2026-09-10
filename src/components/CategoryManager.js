'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { Trash2, Pencil, Plus, Check, X } from 'lucide-react';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function CategoryManager({ categories }) {
  const t = useTranslations('admin');
  const router = useRouter();

  const [newNameAr, setNewNameAr] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editAr, setEditAr] = useState('');
  const [editEn, setEditEn] = useState('');

  async function handleAdd(e) {
    e.preventDefault();
    setAdding(true);
    setError('');

    const supabase = createSupabaseBrowserClient();
    const slug = slugify(newNameEn);

    const { error: insertError } = await supabase
      .from('categories')
      .insert({ name_ar: newNameAr, name_en: newNameEn, slug });

    setAdding(false);

    if (insertError) {
      setError(t('categorySaveError'));
      return;
    }

    setNewNameAr('');
    setNewNameEn('');
    router.refresh();
  }

  function startEdit(cat) {
    setEditingId(cat.id);
    setEditAr(cat.name_ar);
    setEditEn(cat.name_en);
  }

  async function saveEdit(id) {
    const supabase = createSupabaseBrowserClient();
    await supabase.from('categories').update({ name_ar: editAr, name_en: editEn }).eq('id', id);
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id, confirmLabel) {
    if (!window.confirm(confirmLabel)) return;
    const supabase = createSupabaseBrowserClient();
    await supabase.from('categories').delete().eq('id', id);
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="rounded-xl bg-white border border-sage-line p-5 flex flex-col sm:flex-row gap-3">
        <input type="text" required dir="rtl" placeholder={t('nameAr')} value={newNameAr} onChange={(e) => setNewNameAr(e.target.value)} className="flex-1 rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />
        <input type="text" required dir="ltr" placeholder={t('nameEn')} value={newNameEn} onChange={(e) => setNewNameEn(e.target.value)} className="flex-1 rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine" />
        <button type="submit" disabled={adding} className="inline-flex items-center justify-center gap-2 rounded-full bg-pine px-5 py-2 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap">
          <Plus size={16} />
          {t('addCategory')}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between rounded-xl bg-white border border-sage-line p-4">
            {editingId === cat.id ? (
              <div className="flex-1 flex flex-col sm:flex-row gap-3">
                <input type="text" dir="rtl" value={editAr} onChange={(e) => setEditAr(e.target.value)} className="flex-1 rounded-lg border border-sage-line px-3 py-1.5" />
                <input type="text" dir="ltr" value={editEn} onChange={(e) => setEditEn(e.target.value)} className="flex-1 rounded-lg border border-sage-line px-3 py-1.5" />
              </div>
            ) : (
              <div>
                <p className="font-semibold text-ink">{cat.name_ar}</p>
                <p className="text-sm text-ink/50">{cat.name_en}</p>
              </div>
            )}

            <div className="flex items-center gap-3 ms-4">
              {editingId === cat.id ? (
                <>
                  <button onClick={() => saveEdit(cat.id)} className="text-pine"><Check size={18} /></button>
                  <button onClick={() => setEditingId(null)} className="text-ink/40"><X size={18} /></button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(cat)} className="text-pine"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(cat.id, t('confirmDeleteCategory'))} className="text-red-600"><Trash2 size={16} /></button>
                </>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-ink/50">{t('noCategories')}</p>}
      </div>
    </div>
  );
}