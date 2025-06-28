
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Book,
  Calendar,
  CheckCircle,
  FileText,
  Flame,
  Home,
  LayoutDashboard,
  ListChecks,
  LucideIcon,
  MessageSquare,
  PiggyBank,
  Settings,
  ShoppingBag,
  Bell,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from '@/contexts/NotificationContext';

interface MenuItem {
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  color: string;
  bgColor: string;
  badge?: number;
}

const MainMenu = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  
  const { unreadCount } = useNotifications();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems: MenuItem[] = [
    {
      title: "الرئيسية",
      description: "نظرة عامة على حسابك",
      icon: Home,
      route: "/dashboard",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "الأهداف الكبرى",
      description: "خطط لأهدافك طويلة الأجل",
      icon: Target,
      route: "/major-goals",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "التخطيط المالي",
      description: "إدارة المصروفات والادخار",
      icon: PiggyBank,
      route: "/financial-planning",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      title: "تحدي العادات السيئة",
      description: "تخلص من العادات السيئة",
      icon: Flame,
      route: "/break-habits",
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      title: "قائمة المهام",
      description: "إدارة المهام اليومية",
      icon: ListChecks,
      route: "/daily-tasks",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    },
    {
      title: "المدونة",
      description: "مقالات ونصائح مالية",
      icon: Book,
      route: "/blog",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50"
    },
    {
      title: "الإشعارات",
      description: "تنبيهات وتذكيرات مهمة",
      icon: Bell,
      route: "/notifications",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      title: "الإعدادات",
      description: "تخصيص التطبيق",
      icon: Settings,
      route: "/settings",
      color: "text-gray-500",
      bgColor: "bg-gray-50"
    },
    {
      title: "المستندات القانونية",
      description: "الشروط والسياسات",
      icon: FileText,
      route: "/legal",
      color: "text-gray-500",
      bgColor: "bg-gray-50"
    }
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="القائمة الرئيسية" onBackClick={handleLogout} />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(item.route)}
            >
              <CardContent className="p-4 flex items-start">
                <div className={`h-12 w-12 rounded-full ${item.bgColor} flex items-center justify-center ml-4`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="text-right flex-1">
                  <h3 className="font-bold">{item.title} {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-900">
                      {item.badge}
                    </span>
                  )}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
