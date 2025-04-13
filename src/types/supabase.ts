export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          role: string
          updated_at: string
          social_media: Json
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          updated_at?: string
          social_media?: Json
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          updated_at?: string
          social_media?: Json
          description?: string | null
        }
      }
      venues: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          created_at: string
          venue_id: string
          name: string
          date: string
          start_time: string
          end_time: string
          metadata: Json
          created_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          venue_id: string
          name: string
          date: string
          start_time: string
          end_time: string
          metadata?: Json
          created_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          venue_id?: string
          name?: string
          date?: string
          start_time?: string
          end_time?: string
          metadata?: Json
          created_by?: string | null
          updated_at?: string
        }
      }
      guests: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string | null
          birthday: string | null
          instagram: string | null
          metadata: Json
          created_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email?: string | null
          birthday?: string | null
          instagram?: string | null
          metadata?: Json
          created_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string | null
          birthday?: string | null
          instagram?: string | null
          metadata?: Json
          created_by?: string | null
          updated_at?: string
        }
      }
      guest_events: {
        Row: {
          id: string
          created_at: string
          guest_id: string
          event_id: string
          added_by: string | null
          checked_in: boolean
          metadata: Json
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          guest_id: string
          event_id: string
          added_by?: string | null
          checked_in?: boolean
          metadata?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          guest_id?: string
          event_id?: string
          added_by?: string | null
          checked_in?: boolean
          metadata?: Json
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          created_at: string
          name: string
          phone: string
          message: string
          status: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          phone: string
          message: string
          status?: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          phone?: string
          message?: string
          status?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 