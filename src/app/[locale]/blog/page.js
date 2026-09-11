import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { supabase } from '@/lib/supabase';
import { Newspaper } from 'lucide-react';
import Image from 'next/image';

export async function generateMetadata() {
  const t = await getTranslations('blog');
  return { title: t('title') };
}

export default async function BlogPage() {
  const locale = await getLocale();
  const t = await getTranslations('blog');

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-ink">{t('title')}</h1>
      <p className="mt-3 text-ink/60">{t('subtitle')}</p>

      {posts && posts.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const title = locale === 'ar' ? post.title_ar : post.title_en;
            const excerpt = locale === 'ar' ? post.excerpt_ar : post.excerpt_en;
            return (
              <Link key={post.id} href={`/blog/${post.id}`} className="group rounded-2xl bg-white border border-sage-line overflow-hidden hover:border-pine transition-colors">
                <div className="aspect-video bg-stone relative">
                  {post.cover_image ? (
                    <Image src={post.cover_image} alt={title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Newspaper className="text-sage-line" size={40} />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-ink group-hover:text-pine transition-colors">{title}</h3>
                  {excerpt && <p className="mt-1 text-sm text-ink/60 line-clamp-2">{excerpt}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="mt-10 text-ink/60">{t('empty')}</p>
      )}
    </div>
  );
}