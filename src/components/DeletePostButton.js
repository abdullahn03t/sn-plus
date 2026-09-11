'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { Trash2 } from 'lucide-react';

export default function DeletePostButton({ postId, confirmLabel }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(confirmLabel)) return;

    setDeleting(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.from('posts').delete().eq('id', postId);
    setDeleting(false);
    router.refresh();
  }

  return (
    <button onClick={handleDelete} disabled={deleting} className="text-red-600 hover:opacity-70 disabled:opacity-40">
      <Trash2 size={16} />
    </button>
  );
}