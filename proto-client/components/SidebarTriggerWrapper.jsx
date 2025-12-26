'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function SidebarTriggerWrapper() {
  const { isAuthenticated, loading } = useAuth()
  const pathname = usePathname()

  if (pathname === '/login' || (!isAuthenticated && !loading)) {
    return null
  }

  return <SidebarTrigger />
}

