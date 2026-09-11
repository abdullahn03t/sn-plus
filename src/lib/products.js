import { cache } from 'react';
import { supabase } from '@/lib/supabase';

export const getProduct = cache(async (id) => {
  return supabase
    .from('products')
    .select('*, categories(name_ar, name_en)')
    .eq('id', id)
    .single();
});