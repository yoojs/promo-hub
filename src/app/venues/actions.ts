'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getVenues() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching venues:', error);
    return null;
  }

  return data;
}

export async function getVenueById(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('venues')
    .select(`
      *,
      events (
        id,
        name,
        date,
        start_time,
        end_time,
        description
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching venue:', error);
    return null;
  }

  return data;
}

export async function createVenue(venueData: {
  name: string;
  location?: string;
  description?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('venues')
    .insert([venueData])
    .select()
    .single();

  if (error) {
    console.error('Error creating venue:', error);
    return null;
  }

  revalidatePath('/venues');
  return data;
}

export async function updateVenue(
  id: string,
  venueData: {
    name: string;
    location?: string;
    description?: string;
  }
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('venues')
    .update(venueData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating venue:', error);
    return null;
  }

  revalidatePath(`/venues/${id}`);
  revalidatePath('/venues');
  return data;
}