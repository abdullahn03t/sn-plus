import { cache } from 'react';
import { supabase } from '@/lib/supabase';

export const getPost = cache(async (id) => {
  return supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single();
});