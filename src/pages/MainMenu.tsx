
import { AppHeader } from "@/components/ui/AppHeader";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  BookText, 
  CircleX, 
  PiggyBank, 
  Target,
  LayoutGrid,
  FileText,
  Star,
  CheckSquare
} from "lucide-react";

export default function MainMenu() {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      id: 'dashboard',
      title: 'الرئيسية',
      icon: <Home className="h-8 w-8" />,
      path: '/dashboard',
      color: 'bg-growup hover:bg-growup-dark'
    },
    {
      id: 'self-development',
      title: 'تطوير الذات',
      description: 'عادات لتطوير نفسك',
      icon: <BookText className="h-6 w-6" />,
      path: '/self-development',
      color: 'bg-gray-100 hover:bg-gray-200'
    },
    {
      id: 'daily-tasks',
      title: 'المهام اليومية',
      description: 'إدارة مهامك اليومية',
      icon: <CheckSquare className="h-6 w-6" />,
      path: '/daily-tasks',
      color: 'bg-gray-100 hover:bg-gray-200'
    },
    {
      id: 'break-habits',
      title: 'كسر العادات السيئة',
      description: 'التخلص من العادات الضارة',
      icon: <CircleX className="h-6 w-6" />,
      path: '/break-habits',
      color: 'bg-gray-100 hover:bg-gray-200'
    },
    {
      id: 'financial-planning',
      title: 'التخطيط المالي',
      description: 'إدارة أموالك بذكاء',
      icon: <PiggyBank className="h-6 w-6" />,
      path: '/financial-planning',
      color: 'bg-gray-100 hover:bg-gray-200'
    },
    {
      id: 'major-goals',
      title: 'أهدافي الكبرى',
      description: 'تحقيق أهدافك الطموحة',
      icon: <Target className="h-6 w-6" />,
      path: '/major-goals',
      color: 'bg-gray-100 hover:bg-gray-200'
    },
    {
      id: 'legal',
      title: 'المستندات القانونية',
      description: 'الشروط والسياسات',
      icon: <FileText className="h-6 w-6" />,
      path: '/legal',
      color: 'bg-gray-100 hover:bg-gray-200'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="قائمة GrowUp" showBackButton />
      
      <div className="container mx-auto px-8 py-6">
        <div className="max-w-lg mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-2 font-cairo">قائمة GrowUp</h1>
            <p className="text-gray-600 font-cairo">اختر من القائمة الجانبية أو عد للصفحة الرئيسية</p>
          </div>
          
          {/* Main Dashboard Button */}
          <Button
            className={`w-full h-16 mb-6 text-lg font-bold ${menuItems[0].color}`}
            onClick={() => navigate(menuItems[0].path)}
          >
            <div className="flex items-center gap-3">
              {menuItems[0].icon}
              <span>{menuItems[0].title}</span>
            </div>
          </Button>
          
          {/* Other Menu Items */}
          <div className="space-y-3">
            {menuItems.slice(1).map((item) => (
              <Card 
                key={item.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(item.path)}
              >
                <CardContent className="p-4 flex items-center">
                  <div className={`h-12 w-12 rounded-full ${item.color} flex items-center justify-center ml-4`}>
                    {item.icon}
                  </div>
                  <div className="text-right flex-1">
                    <h3 className="font-bold font-cairo">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm font-cairo">{item.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Premium Subscription Button */}
          <Button
            className="w-full h-16 mt-6 bg-growup hover:bg-growup-dark text-lg font-bold"
            onClick={() => navigate('/subscription')}
          >
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6" />
              <span>اشترك في العضوية المميزة</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
