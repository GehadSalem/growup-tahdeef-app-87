import { AppHeader } from "@/components/ui/AppHeader";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, User } from "lucide-react";

export default function Menu() {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      id: 'profile',
      title: 'الملف الشخصي',
      description: 'إدارة حسابك وتحديث بياناتك',
      icon: <User className="h-6 w-6" />,
      path: '/profile'
    },
    {
      id: 'contact',
      title: 'تواصل مع الدعم',
      description: 'مساعدة في حل المشاكل والاستفسارات',
      icon: <Mail className="h-6 w-6" />,
      path: '/contact'
    },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="القائمة" showBackButton />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-lg mx-auto">
          <div className="grid gap-4">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                className="flex items-center justify-start gap-4 h-auto p-4 border-gray-200 text-right"
                onClick={() => navigate(item.path)}
              >
                <div className="p-2 bg-gray-100 rounded-full">
                  {item.icon}
                </div>
                <div className="text-right">
                  <div className="font-bold text-base">{item.title}</div>
                  <div className="text-gray-500 text-sm">{item.description}</div>
                </div>
              </Button>
            ))}
            
            <Button
              variant="outline"
              className="flex items-center justify-start gap-4 h-auto p-4 border-red-200 text-red-600 hover:bg-red-50 text-right"
              onClick={() => navigate('/logout')}
            >
              <div className="p-2 bg-red-100 rounded-full">
                <LogOut className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-right">
                <div className="font-bold text-base">تسجيل الخروج</div>
                <div className="text-red-400 text-sm">تسجيل الخروج من التطبيق</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
