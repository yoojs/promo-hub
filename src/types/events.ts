export interface Guest {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  instagram?: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'checked_in' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  host_guest?: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  description?: string;
  venue_id: string;
  promoters: string[];
  guests?: Record<string, Guest>;
  image_url?: string;
  created_by: string;
} 

export interface AdditionalGuest {
  full_name: string;
  email?: string;
  phone: string;
  instagram?: string;
  host_guest?: string;
}