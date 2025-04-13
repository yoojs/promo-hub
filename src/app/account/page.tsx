import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AccountForm from './account-form'
import { NavigationWrapper } from '@/components/navigation-wrapper'

export default async function AccountPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <NavigationWrapper/>

      {/* Main Content */}
      <div className="relative z-10 py-12 px-4">
        <div className="w-full max-w-md mx-auto">
          <AccountForm user={user} />
        </div>
      </div>
    </div>
  )
} 