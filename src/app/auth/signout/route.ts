import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    await supabase.auth.signOut()
  }

  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL!), {
    status: 302,
  })
} 