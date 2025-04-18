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

// New function to get a single event by its ID
export async function getEventById(eventId: string): Promise<Event | null> {
  if (!eventId) return null;

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single() // Use .single() to get one record or null

  if (error) {
    console.error(`Error fetching event with ID ${eventId}:`, error)
    return null
  }

  return data as Event | null
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