'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { PostgrestError } from '@supabase/supabase-js'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError

      router.push('/login?message=Check your email to confirm your account')
    } catch (error) {
      if (error instanceof PostgrestError) {
        setError(error.message)
      } else {
        setError('An error occurred during signup!')
      }
    } finally {
      setLoading(false)
    }
  }
  return notFound();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1d24] bg-cover bg-center bg-no-repeat">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md p-4">
        <div className="backdrop-blur-md bg-[#262b36]/80 rounded-lg shadow-xl p-8 border border-white/10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-medium text-white">Create Account</h2>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md px-4 py-3 bg-[#1e222a]/90 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-base"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md px-4 py-3 bg-[#1e222a]/90 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-base"
                placeholder="Create a password"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md px-4 py-3 bg-[#1e222a]/90 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-base"
                placeholder="Confirm your password"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 