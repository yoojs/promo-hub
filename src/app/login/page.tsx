'use client'

import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#1a1d24] flex items-center justify-center">
      <Suspense fallback={
        <div className="bg-[#262b36] p-8 rounded-lg shadow-xl w-full max-w-md">
          <p className="text-gray-400 text-center">Loading...</p>
        </div>
      }>
        <div className="w-full max-w-md">
          <LoginForm />
          <div className="mt-4 text-center">
            <p className="text-gray-400">
              Not registered yet?{' '}
              <Link 
                href="/waitlist" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Join our waitlist
              </Link>
            </p>
          </div>
        </div>
      </Suspense>
    </div>
  );
}