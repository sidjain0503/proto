'use client'

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/shared/Sidebar"
import { AppHeader } from "@/components/shared/AppHeader"
import { useAppStore } from "@/contexts/Store"

export default function DashboardLayout({ children }) {
  const { menuItem } = useAppStore()

  return (
    <SidebarProvider>
      <AppSidebar menuItems={menuItem} />
      <main className="flex h-screen w-full flex-col bg-background">
        <AppHeader />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
