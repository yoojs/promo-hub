'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getProfile } from '@/app/account/actions'

export async function getEvent(eventId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

  if (error) {
    console.error('Error fetching event:', error)
    return null
  }

  return data
}
export async function getVenue(venueId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('id', venueId)
    .single()

  if (error) {
    console.error('Error fetching venue:', error)
    return null
  }

  return data
}
export async function checkInGuest(eventId: string, guestId: string) {
  const supabase = await createClient()
  
  // Get current event metadata
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('guests')
    .eq('id', eventId)
    .single()

  if (eventError) throw eventError

  // Update the guest's checked_in status in metadata
  const guests = {
    ...event?.guests,
    [guestId]: {
      ...event?.guests[guestId],
      checked_in: !event?.guests[guestId].checked_in,
      check_in_time: event?.guests[guestId].checked_in ? null : new Date().toISOString()

    },
  }

  const { error: updateError } = await supabase
    .from('events')
    .update({
      guests
    })
    .eq('id', eventId)

  if (updateError) throw updateError

  revalidatePath(`/guestlists/${eventId}`)
}

export async function importGuestList(eventId: string, csvContent: string) {
  const supabase = await createClient()
  const profile = await getProfile()
  const userId = profile?.full_name || profile?.id
  // Get current event metadata
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('guests')
    .eq('id', eventId)
    .single()

  if (eventError) throw eventError

  // Parse CSV content
  const rows = csvContent.split('\n').map(row => row.split(','))
  const headers = rows[0].map(header => header.trim().toLowerCase())
  
  // Create new guests object
  const newGuests = rows.slice(1).reduce((acc, row) => {
    const guestId = crypto.randomUUID()
    const guest = {
      id: guestId,
      full_name: row[headers.indexOf('name')]?.trim() || '',
      email: row[headers.indexOf('email')]?.trim() || '',
      phone: row[headers.indexOf('phone')]?.trim() || '',
      checked_in: false,
      check_in_time: null,
      added_at: new Date().toISOString(),
      added_by: userId
    }
    
    return {
      ...acc,
      [guestId]: guest
    }
  }, {})

  // Merge with existing guests
  const guests = {
    ...event?.guests,
    ...newGuests
  }

  const { error: updateError } = await supabase
    .from('events')
    .update({
      guests
    })
    .eq('id', eventId)

  if (updateError) throw updateError

  revalidatePath(`/guestlists/${eventId}`)
}

export async function deleteGuest(eventId: string, guestId: string) {
  const supabase = await createClient();

  // Get current event data
  const { data: event } = await supabase
    .from('events')
    .select('guests')
    .eq('id', eventId)
    .single();

  if (!event?.guests) {
    throw new Error('Event or guests not found');
  }

  // Create new guests object without the deleted guest
  const updatedGuests = { ...event.guests };
  delete updatedGuests[guestId];

  // Update the event with new guests object
  const { error } = await supabase
    .from('events')
    .update({ guests: updatedGuests })
    .eq('id', eventId);

  if (error) {
    console.error('Error deleting guest:', error);
    throw new Error('Failed to delete guest');
  }

  revalidatePath(`/guestlists/${eventId}`);
  return { success: true };
}