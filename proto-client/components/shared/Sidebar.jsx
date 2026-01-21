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
import { LogOut } from "lucide-react"

export function AppSidebar({menuItems}) {

  console.log('menuItems',menuItems)
  const { user, logout, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }
  const ignorePaths = ['/login', '/signup']

  const shouldIgnore = ignorePaths.some(path => pathname.includes(path))

  if (shouldIgnore || loading) {
    return null
  }

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        {menuItems.map((item, index) => {
          if (item.section) {
            return (
              <SidebarGroup key={item.section}>
                <SidebarGroupLabel>{item.section}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem?.id || subItem.title}>
                        <SidebarMenuButton asChild isActive={pathname === subItem.url}>
                          <Link href={subItem.url}>
                            <subItem.icon />
                            <span>{subItem.title}</span>
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
