'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { X } from 'lucide-react';

export default function DeleteRatingButton({ ratingId }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.from('ratings').delete().eq('id', ratingId);
    setDeleting(false);
    router.refresh();
  }

  return (
    <button onClick={handleDelete} disabled={deleting} className="text-ink/40 hover:text-red-600">
      <X size={12} />
    </button>
  );
}