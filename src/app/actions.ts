'use server'

import { createClient } from '@/utils/supabase/server'

interface Promoter {
  id: string;
  full_name: string;
  company?: string;
  role?: string;
  event_count: number;
  avatar_url?: string;
}

interface Guest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  checked_in: boolean;
  check_in_time: string | null;
  added_at: string;
}

interface EventWithRelations {
  id: string;
  name: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  venue_id: string;
  venue: {
    name: string;
  };
  guests: {
    [key: string]: Guest;
  };
  promoters: string[];
  created_at: string;
  updated_at: string;
}

export async function getPromoters(page: number = 1, limit: number = 9) {
  const supabase = await createClient()
  const start = (page - 1) * limit
  const end = start + limit - 1

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'promoter')
    .range(start, end);

  if (error) {
    console.error('Error fetching promoters:', error)
    return { promoters: [], total: 0 }
  }

  const promoters = data.map(profile => ({
    id: profile.id,
    full_name: profile.full_name,
    company: profile.company,
    role: profile.role,
    event_count: profile.events?.[0]?.count || 0,
    avatar_url: profile.avatar_url
  }))

  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'promoter')

  return {
    promoters: promoters as Promoter[],
    total: count || 0
  }
}

export async function getEvents(page: number = 1, limit: number = 10) {
  const supabase = await createClient()
  const start = (page - 1) * limit
  const end = start + limit - 1

  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      venue:venues(name)
    `)
    .range(start, end)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching events:', error)
    return { events: [], total: 0 }
  }

  const events = data.map(event => ({
    ...event,
    guests: event.guests || {},
    promoters: event.promoters || []
  }))

  const { count } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })

  return {
    events: events as EventWithRelations[],
    total: count || 0
  }
}

export async function getEvent(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select(`
      *
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching event:', error)
    return null
  }

  return {
    ...data
  } as EventWithRelations
}
export async function getAllVenues() {
  const supabase = await createClient()

  const { data: venues, error } = await supabase
    .from('venues')
    .select('*')

  if (error) {
    console.error('Error fetching venues:', error)
    return []
  }

  return venues
}
export async function getVenues(page = 1) {
  const supabase = await createClient()

  const { data: venues, error, count } = await supabase
    .from('venues')
    .select(`
      *,
      events(*)
    `, { count: 'exact' })
    .range((page - 1) * 10, page * 10 - 1)

  if (error) {
    console.error('Error fetching venues:', error)
    return { venues: [], total: 0 }
  }

  return { venues, total: count ?? 0 }
}
export async function getAllPromoters() {
  const supabase = await createClient()

  const { data: promoters, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'promoter')

  if (error) {
    console.error('Error fetching promoters:', error)
    return []
  }

  return promoters
}