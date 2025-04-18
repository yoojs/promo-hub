export type WaitlistRole = 'promoter' | 'user' | 'venue';

export interface WaitlistEntry {
  full_name: string;
  email: string;
  role: WaitlistRole;
  created_at?: string;
}