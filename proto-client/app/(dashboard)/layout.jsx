'use client'

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/shared/Sidebar"
import { SidebarTriggerWrapper } from "@/components/SidebarTriggerWrapper"
import { useAppStore } from "@/contexts/Store"

export default function DashboardLayout({ children }) {

  const { menuItem } = useAppStore();


  return (
    <SidebarProvider>
      <AppSidebar menuItems={menuItem} />
      <main className="h-screen w-full flex flex-col">
        <SidebarTriggerWrapper />
        {children}
      </main>
    </SidebarProvider>
  )
}
