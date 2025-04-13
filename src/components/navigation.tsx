'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export function Navigation() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        setUserRole(profile?.role || null)
      }
    }

    checkUser()
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <nav className="relative z-10 bg-[#1e222a]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-white font-bold text-xl hover:text-blue-400 transition-colors"
            >
              WeOut
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link
              href="/promoters"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/promoters')
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Promoters
            </Link>
            {user && (userRole === 'promoter' || userRole === 'admin') && (
              <Link
                href="/guestlists"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/guestlists')
                    ? 'text-white border-b-2 border-blue-500'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Guest Lists
              </Link>
            )}
            {user && userRole === 'admin' && (
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin')
                    ? 'text-white border-b-2 border-blue-500'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Admin
              </Link>
            )}
            {user && (
              <>
                <Link
                  href="/account"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/account')
                      ? 'text-white border-b-2 border-blue-500'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Account
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            )}
            {!user && (
              <Link
                href="/login"
                className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 