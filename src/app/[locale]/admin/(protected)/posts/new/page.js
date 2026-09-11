import { getTranslations } from 'next-intl/server';
import PostForm from '@/components/PostForm';

export default async function NewPostPage() {
  const t = await getTranslations('admin');

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-2xl font-bold text-ink">{t('addPost')}</h1>
      <div className="mt-8">
        <PostForm />
      </div>
    </div>
  );
}