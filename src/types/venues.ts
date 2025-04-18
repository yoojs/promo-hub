import { Event } from './events';

export interface Venue {
  id: string;
  name: string;
  address?: string;
  description?: string;
  created_at: string;
  events?: Event[];
  image_url?: string;
}