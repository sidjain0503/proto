'use client'

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/shared/Sidebar"
import { SidebarTriggerWrapper } from "@/components/SidebarTriggerWrapper"

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="h-screen w-full flex flex-col">
        <SidebarTriggerWrapper />
        {children}
      </main>
    </SidebarProvider>
  )
}
