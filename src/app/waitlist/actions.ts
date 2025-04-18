'use server';

import { createClient } from '@/utils/supabase/server';
import { WaitlistEntry } from '@/types/waitlist';

export async function addToWaitlist(data: Omit<WaitlistEntry, 'created_at'>) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('waitlist')
    .insert([{
      full_name: data.full_name,
      email: data.email,
      role: data.role
    }]);

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('This email is already on our waitlist');
    }
    throw new Error('Failed to join waitlist');
  }

  return { success: true };
}