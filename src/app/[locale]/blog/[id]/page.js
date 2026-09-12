import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getPost } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const { data: post } = await getPost(id);

  if (!post) return {};

  const title = locale === 'en' ? post.title_en : post.title_ar;
  const excerpt = locale === 'en' ? post.excerpt_en : post.excerpt_ar;

  return {
    title,
    description: excerpt || undefined,
    openGraph: {
      title: `${title} — SN+`,
      description: excerpt || undefined,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { id, locale } = await params;
  const t = await getTranslations('blog');

  const { data: post } = await getPost(id);

  if (!post) {
    notFound();
  }

  const title = locale === 'en' ? post.title_en : post.title_ar;
  const content = locale === 'en' ? post.content_en : post.content_ar;
  const BackIcon = locale === 'en' ? ChevronLeft : ChevronRight;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-pine">
        <BackIcon size={16} />
        {t('backToBlog')}
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-ink">{title}</h1>

      {post.cover_image && (
        <div className="mt-8 aspect-video rounded-2xl overflow-hidden bg-stone relative">
          <Image src={post.cover_image} alt={title} fill className="object-cover" />
        </div>
      )}

      <div className="mt-8 text-ink/80 leading-relaxed whitespace-pre-line">
        {content}
      </div>
    </div>
  );
}