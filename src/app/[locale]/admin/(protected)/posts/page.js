import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import DeletePostButton from '@/components/DeletePostButton';
import { Plus } from 'lucide-react';

export default async function AdminPostsPage() {
  const t = await getTranslations('admin');
  const supabase = await createSupabaseServerClient();

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-2xl font-bold text-ink">{t('managePosts')}</h1>

      <Link href="/admin/posts/new" className="mt-6 inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity">
        <Plus size={18} />
        {t('addPost')}
      </Link>

      <div className="mt-8 space-y-3">
        {posts?.map((post) => (
          <div key={post.id} className="flex items-center justify-between rounded-xl bg-white border border-sage-line p-4">
            <div>
              <p className="font-semibold text-ink">{post.title_ar}</p>
              <p className="text-sm text-ink/50">{post.published ? t('published') : t('draft')}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/admin/posts/${post.id}/edit`} className="text-sm font-medium text-pine hover:underline">
                {t('edit')}
              </Link>
              <DeletePostButton postId={post.id} confirmLabel={t('confirmDeletePost')} />
            </div>
          </div>
        ))}
        {(!posts || posts.length === 0) && (
          <p className="text-ink/50">{t('noPosts')}</p>
        )}
      </div>
    </div>
  );
}