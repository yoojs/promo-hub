'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Event } from '@/types/events'

export async function getEvents() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return data as Event[]
}

export async function createEvent(eventData: Omit<Event, 'id'>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .insert([eventData])
    .select()
    .single()

  if (error) {
    console.error('Error creating event:', error)
    throw error
  }

  revalidatePath('/events')
  return data as Event
}

export async function updateEvent(eventId: string, eventData: Partial<Event>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', eventId)
    .select()
    .single()

  if (error) {
    console.error('Error updating event:', error)
    throw error
  }

  revalidatePath('/events')
  return data as Event
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)

  if (error) {
    console.error('Error deleting event:', error)
    throw error
  }

  revalidatePath('/events')
} 