'use client'

import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#1a1d24] flex items-center justify-center">
      <Suspense fallback={
        <div className="bg-[#262b36] p-8 rounded-lg shadow-xl w-full max-w-md">
          <p className="text-gray-400 text-center">Loading...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}