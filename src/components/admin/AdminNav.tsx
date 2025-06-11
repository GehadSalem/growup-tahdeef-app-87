import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { 
  ChevronRight, 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  MessageCircle,
  Settings,
  Menu,
} from "lucide-react";

interface AdminNavProps {
  isMobile?: boolean;
  onItemClick?: () => void; // تغيير من onItemClick إلى onItemClick
}

const navItems = [
  {
    title: "لوحة التحكم",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "المستخدمين",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "الاشتراكات",
    href: "/admin/subscriptions",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "إدارة المحتوى",
    href: "/admin/content",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "الدعم",
    href: "/admin/support",
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    title: "الإعدادات",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function AdminNav({ isMobile = false, onItemClick }: AdminNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (href: string) => {
    if (isMobile && onItemClick) {
      onItemClick();
    }
    navigate(href);
  };

  return (
    <div
      className={cn(
        "border-l bg-card flex flex-col h-screen sticky top-0 p-4 transition-all duration-300",
        isMobile ? "w-full" : isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header with logo and collapse button */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b">
        {!isCollapsed && (
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => handleClick("/admin")}
          >
            <Logo size="sm" />
          </div>
        )}
        
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-full"
          >
            {isCollapsed ? <Menu /> : <ChevronRight />}
          </Button>
        )}
      </div>
      
      {/* Navigation items */}
      <div className="space-y-1 flex-1">
        {navItems.map((item) => (
          <div
            key={item.href}
            onClick={() => handleClick(item.href)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
              location.pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground",
              isCollapsed && !isMobile && "justify-center"
            )}
          >
            {item.icon}
            {(!isCollapsed || isMobile) && <span>{item.title}</span>}
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="mt-auto pt-4 border-t">
        <div
          onClick={() => handleClick("/menu")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer",
            "hover:bg-accent hover:text-accent-foreground",
            isCollapsed && !isMobile && "justify-center"
          )}
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
          {(!isCollapsed || isMobile) && <span>العودة للتطبيق</span>}
        </div>
      </div>
    </div>
  );
}