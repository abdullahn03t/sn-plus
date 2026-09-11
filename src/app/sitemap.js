import { supabase } from '@/lib/supabase';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap() {
  const staticPaths = ['', '/products', '/about', '/contact', '/blog'];
  const locales = ['ar', 'en'];

  const staticEntries = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
    }))
  );

  const { data: products } = await supabase.from('products').select('id, updated_at');

  const productEntries = (products || []).flatMap((product) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/products/${product.id}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    }))
  );

  const { data: posts } = await supabase.from('posts').select('id, updated_at').eq('published', true);

  const postEntries = (posts || []).flatMap((post) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${post.id}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    }))
  );

  return [...staticEntries, ...productEntries, ...postEntries];
}