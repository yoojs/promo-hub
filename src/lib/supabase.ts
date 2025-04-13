import { createClient as createClientFromClient } from '@/utils/supabase/client'

// Legacy supabase client for backward compatibility
// It's better to use the more specific client or server clients directly
export const supabase = createClientFromClient() 