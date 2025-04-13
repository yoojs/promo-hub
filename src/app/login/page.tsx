'use client'

import { login } from './actions'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
export default function LoginPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  return (
    <div className="min-h-screen bg-[#1a1d24] flex items-center justify-center">
      <div className="bg-[#262b36] p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6">Welcome to WeOut</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-md">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {message && (
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-md">
            <p className="text-blue-400 text-sm">{message}</p>
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            <button
              formAction={login}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Log in
            </button>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
} 