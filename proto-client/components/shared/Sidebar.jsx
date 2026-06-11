'use client'

import { useAuth } from "@/contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  Profile,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LogOut, MessageSquarePlus, Zap } from "lucide-react"
import { appConfig } from "@/config/app.config"

export function AppSidebar({ menuItems }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const ignorePaths = ['/login', '/signup']
  const shouldIgnore = ignorePaths.some((path) => pathname.includes(path))

  if (shouldIgnore) {
    return null
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 rounded-md px-1 py-1 transition-colors hover:bg-sidebar-accent"
          aria-label={`${appConfig.app.name} dashboard`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 ring-1 ring-cyan-500/20">
            <Zap className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">{appConfig.app.name}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Workspace
            </span>
          </div>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full justify-start gap-2 border-cyan-500/20 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
          onClick={() => router.push('/chat')}
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((item, index) => {
          if (item.section) {
            const isHistory = item.section === 'History'
            return (
              <SidebarGroup
                key={item.section}
                className={isHistory ? 'max-h-64 overflow-y-auto' : undefined}
              >
                <SidebarGroupLabel>{item.section}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem?.id || subItem.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === subItem.url}
                          tooltip={subItem.title}
                        >
                          <Link href={subItem.url}>
                            <subItem.icon />
                            <span className="truncate">{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )
          }

          return (
            <SidebarGroup key={item.id || index}>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        {user && (
          <>
            <Profile
              user={{ name: user.name || "User", email: user.email || "" }}
            />
            <div className="px-2 pb-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
