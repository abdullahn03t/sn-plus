import { cache } from 'react';
import { supabase } from '@/lib/supabase';

export const getProduct = cache(async (id) => {
  return supabase
    .from('products')
    .select('*, categories(name_ar, name_en), companies(name_ar, name_en), product_variants(*)')
    .eq('id', id)
    .single();
});