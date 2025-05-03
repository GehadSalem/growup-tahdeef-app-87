import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/Logo";
import { 
  BookText, 
  CircleX, 
  Home, 
  LogOut, 
  PiggyBank, 
  Settings,
  Target
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: "الرئيسية",
      icon: <Home />,
      path: "/dashboard",
    },
    {
      title: "تطوير الذات",
      icon: <BookText />,
      path: "/self-development",
    },
    {
      title: "كسر العادات السيئة",
      icon: <CircleX />,
      path: "/break-habits",
    },
    {
      title: "التخطيط المالي",
      icon: <PiggyBank />,
      path: "/financial-planning",
    },
    {
      title: "أهدافي الكبرى",
      icon: <Target />,
      path: "/major-goals",
    }
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <Sidebar className="border-l">
      <SidebarHeader className="px-6 py-5 flex items-center justify-start">
        <Logo />
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton 
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold font-cairo transition-colors",
                  isActive(item.path) 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center",
                  isActive(item.path) ? "text-primary-foreground" : "text-sidebar-foreground"
                )}>
                  {item.icon}
                </div>
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => navigate('/settings')}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold font-cairo transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            >
              <Settings className="h-5 w-5" />
              <span>الإعدادات</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => navigate('/logout')}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold font-cairo transition-colors hover:bg-red-100 text-red-500"
            >
              <LogOut className="h-5 w-5" />
              <span>تسجيل الخروج</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
