'use server';
import { supabase } from '@/app/_lib/supabase';

export async function getUserProfile(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  if (error) {
    throw new Error('Error getting user profile');
  }
  return data;
}
