export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  number_of_guests: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'cancelled';
  created_at: string;
  updated_at: string;
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
} 