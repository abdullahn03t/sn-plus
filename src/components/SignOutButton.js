'use client';

import { useRouter } from '@/i18n/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function SignOutButton({ label }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button onClick={handleSignOut} className="text-sm font-medium text-ink/60 hover:text-pine">
      {label}
    </button>
  );
}