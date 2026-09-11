import { supabase } from '@/lib/supabase';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap() {
  const staticPaths = ['', '/products', '/about', '/contact'];
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

  return [...staticEntries, ...productEntries];
}