
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

export function AdminNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  return (
    <div
      className={cn(
        "border-l bg-card flex flex-col h-screen sticky top-0 p-4 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b">
        {!isCollapsed && (
          <Link to="/admin" className="flex items-center">
            <Logo size="sm" />
            <span className="mr-1 font-bold text-lg">لوحة التحكم</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-full"
        >
          {isCollapsed ? <Menu /> : <ChevronRight />}
        </Button>
      </div>
      
      <div className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              location.pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground",
              isCollapsed && "justify-center"
            )}
          >
            {item.icon}
            {!isCollapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </div>
      
      <div className="mt-auto pt-4 border-t">
        <Link
          to="/menu"
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            isCollapsed && "justify-center"
          )}
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
          {!isCollapsed && <span>العودة للتطبيق</span>}
        </Link>
      </div>
    </div>
  );
}
