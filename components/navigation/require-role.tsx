'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'

interface RequireRoleProps {
  role: 'admin' | 'agent' | 'farmer'
  children: React.ReactNode
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!profile) {
      router.replace('/sign-in')
      return
    }

    if (profile.role !== role) {
      // Redirect to their correct dashboard
      if (profile.role === 'admin') router.replace('/admin/dashboard')
      if (profile.role === 'agent') router.replace('/agent/dashboard')
      if (profile.role === 'farmer') router.replace('/farmer/dashboard')
    }
  }, [profile, loading, role, router])

  if (loading || !profile || profile.role !== role) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking access...
      </div>
    )
  }

  return <>{children}</>
}
