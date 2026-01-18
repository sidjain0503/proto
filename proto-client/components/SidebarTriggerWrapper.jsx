'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function SidebarTriggerWrapper() {
  const { isAuthenticated, loading } = useAuth()
  const pathname = usePathname()

const ignorePaths = ['/login', '/signup']

const shouldIgnore = ignorePaths.some(path => pathname.includes(path))

if (shouldIgnore || loading) {
  return null
}

  return <SidebarTrigger />
}

