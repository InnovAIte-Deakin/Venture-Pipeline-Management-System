"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VentureIntakeRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push('/dashboard/venture-intake')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to Venture Intake...</p>
      </div>
    </div>
  )
} 