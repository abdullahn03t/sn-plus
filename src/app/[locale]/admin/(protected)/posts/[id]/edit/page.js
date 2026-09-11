import { getTranslations } from 'next-intl/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import PostForm from '@/components/PostForm';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }) {
  const { id } = await params;
  const t = await getTranslations('admin');
  const supabase = await createSupabaseServerClient();

  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single();

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-2xl font-bold text-ink">{t('editPost')}</h1>
      <div className="mt-8">
        <PostForm initialData={post} postId={id} />
      </div>
    </div>
  );
}