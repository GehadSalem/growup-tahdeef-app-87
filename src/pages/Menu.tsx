
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { FileText, Star } from "lucide-react";

// تحديد قائمة الأزرار لسهولة التعديل والصيانة
const menuItems = [
  { title: "الرئيسية", route: "/dashboard-app", isPrimary: true },
  { title: "تطوير الذات", route: "/self-development" },
  { title: "كسر العادات السيئة", route: "/break-habits" },
  { title: "التخطيط المالي", route: "/financial-planning" },
  { title: "أهدافي الكبرى", route: "/major-goals" },
];

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">قائمة GrowUp</h1>
        <p className="text-muted-foreground mb-6">اختر من القائمة الجانبية أو عد للصفحة الرئيسية</p>
        
        <div className="grid gap-4 w-full max-w-md">
          {/* عرض قائمة الأزرار بشكل ديناميكي */}
          {menuItems.map((item) => (
            <Button 
              key={item.route}
              variant={item.isPrimary ? "default" : "outline"} 
              size="lg" 
              className="w-full" 
              onClick={() => navigate(item.route)}
            >
              {item.title}
            </Button>
          ))}
          
          {/* زر المستندات القانونية */}
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full" 
            onClick={() => navigate('/legal')}
          >
            <FileText className="h-4 w-4 mr-0 ml-2" />
            المستندات القانونية
          </Button>
          
          {/* زر الاشتراك المميز */}
          <Button 
            variant="default" 
            size="lg" 
            className="w-full mt-4 bg-gradient-to-r from-growup to-growup-dark" 
            onClick={() => navigate('/subscription')}
          >
            <Star className="h-4 w-4 mr-0 ml-2 fill-yellow-200" />
            اشترك في العضوية المميزة
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
