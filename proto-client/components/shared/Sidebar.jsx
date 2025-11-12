import { menuItems } from "@/app/menu"
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
  
  export function AppSidebar() {
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
        <SidebarFooter >
            <Profile user={{ name: "Siddharth Chopda", email: "siddharth.chopda@gmail.com" }} img="/profile.jpeg" />
        </SidebarFooter>
      </Sidebar>
    )
  }
