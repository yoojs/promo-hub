'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

interface AddGuestData {
  name: string;
  phone: string;
  email?: string;
  instagram?: string;
  eventId: string;
  promoterId: string;
}
export async function getEvent(eventId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    if (error) {
        console.error('Error fetching event:', error);
        return null;
    }
    return data;
}
export async function getPromoter(promoterId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', promoterId)
      .single();
    if (error) {
        console.error('Error fetching promoter:', error);
        return null;
    }
    return data;
}

export async function addGuestToEvent(data: AddGuestData) {
  const supabase = await createClient();

  try {
    // Fetch current event data
    const { data: event } = await supabase
      .from('events')
      .select('guests')
      .eq('id', data.eventId)
      .single();

    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    // Create new guest entry
    const guestId = crypto.randomUUID();
    const newGuest = {
      id: guestId,
      full_name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || '',
      instagram: data.instagram?.trim() || '',
      added_by: data.promoterId,
      added_at: new Date().toISOString(),
      checked_in: false,
      rejected: false
    };

    // Update event's guests
    const { error } = await supabase
      .from('events')
      .update({
        guests: {
          ...event.guests,
          [guestId]: newGuest
        }
      })
      .eq('id', data.eventId);

    if (error) throw error;

    revalidatePath(`/guestlists/${data.eventId}`);
    return { success: true };
  } catch (error) {
    console.error('Error adding guest:', error);
    return { success: false, message: 'Failed to add to guest list' };
  }
}