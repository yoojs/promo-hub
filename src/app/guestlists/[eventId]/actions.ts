'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'



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