'use client'

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/shared/Sidebar"
import { AppHeader } from "@/components/shared/AppHeader"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAppStore } from "@/contexts/Store"
import { buildNavFromFeatures } from "@/config/app.config"
import { useEffect } from "react"

export default function AppLayout({ children }) {
  const { menuItem, setMenuItem } = useAppStore()

  useEffect(() => {
    if (!menuItem.length) {
      setMenuItem(buildNavFromFeatures())
    }
  }, [menuItem.length, setMenuItem])

  const navItems = menuItem.length ? menuItem : buildNavFromFeatures()

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar menuItems={navItems} />
        <main className="flex h-screen w-full flex-col bg-background">
          <AppHeader />
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
