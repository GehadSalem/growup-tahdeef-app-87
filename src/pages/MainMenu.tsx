
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  PiggyBank, 
  BookOpen, 
  CheckCircle2,
  Bell,
  User,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function MainMenu() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    {
      title: "لوحة التحكم",
      description: "عرض التقدم اليومي والإحصائيات",
      icon: <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-growup" />,
      route: "/dashboard",
      color: "bg-blue-50 hover:bg-blue-100"
    },
    {
      title: "الأهداف الكبيرة",
      description: "تحديد وتتبع أهدافك طويلة المدى",
      icon: <Target className="h-6 w-6 sm:h-8 sm:w-8 text-growup" />,
      route: "/major-goals", 
      color: "bg-green-50 hover:bg-green-100"
    },
    {
      title: "المهام اليومية",
      description: "إدارة وتنظيم مهامك اليومية",
      icon: <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-growup" />,
      route: "/daily-tasks",
      color: "bg-purple-50 hover:bg-purple-100"
    },
    {
      title: "التخطيط المالي",
      description: "إدارة أموالك وتخطيط ميزانيتك",
      icon: <PiggyBank className="h-6 w-6 sm:h-8 sm:w-8 text-growup" />,
      route: "/financial-planning",
      color: "bg-yellow-50 hover:bg-yellow-100"
    },
    {
      title: "تطوير الذات",
      description: "بناء عادات إيجابية للنمو الشخصي",
      icon: <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-growup" />,
      route: "/self-development",
      color: "bg-indigo-50 hover:bg-indigo-100"
    },
    {
      title: "كسر العادات السيئة",
      description: "التخلص من العادات الضارة",
      icon: <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-growup" />,
      route: "/break-habits",
      color: "bg-red-50 hover:bg-red-100"
    },
    {
      title: "الإشعارات",
      description: "عرض التنبيهات والتذكيرات",
      icon: <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-growup" />,
      route: "/notifications",
      color: "bg-orange-50 hover:bg-orange-100"
    },
    {
      title: "الملف الشخصي",
      description: "إعداداتك ومعلوماتك الشخصية",
      icon: <User className="h-6 w-6 sm:h-8 sm:w-8 text-growup" />,
      route: "/profile",
      color: "bg-gray-50 hover:bg-gray-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <AppHeader 
        showBackButton 
        title="القائمة الرئيسية" 
        onBackClick={() => navigate('/dashboard')} 
      />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 font-cairo">مرحباً بك في GrowUp</h1>
            <p className="text-sm sm:text-base text-gray-600 font-cairo">اختر القسم الذي تريد الوصول إليه</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {menuItems.map((item, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${item.color} border-0`}
                onClick={() => navigate(item.route)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base lg:text-lg font-cairo mb-1 sm:mb-2">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 font-cairo leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex items-center text-growup text-xs sm:text-sm font-medium">
                      <span className="font-cairo">اذهب</span>
                      <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
