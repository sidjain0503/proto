'use client'
import { menuItems } from "@/app/menu"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import {
    Profile,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
  
  export function AppSidebar() {
    const { user, logout, isAuthenticated, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
      logout()
      router.push('/login')
    }

    if (pathname === '/login' || loading) {
      return null
    }

    return (
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup />
          <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter>
          {user && (
            <>
              <Profile 
                user={{ name: user.name || "User", email: user.email || "" }} 
                img="/profile.jpeg" 
              />
              <div className="px-2 pb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </>
          )}
        </SidebarFooter>
      </Sidebar>
    )
  }
