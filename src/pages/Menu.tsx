
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/sidebar/AppSidebar";

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">قائمة GrowUp</h1>
        <p className="text-muted-foreground mb-6">اختر من القائمة الجانبية أو عد للصفحة الرئيسية</p>
        
        <div className="grid gap-4 w-full max-w-md">
          <Button 
            variant="default" 
            size="lg" 
            className="w-full" 
            onClick={() => navigate('/dashboard')}
          >
            الرئيسية
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full" 
            onClick={() => navigate('/self-development')}
          >
            تطوير الذات
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full" 
            onClick={() => navigate('/break-habits')}
          >
            كسر العادات السيئة
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full" 
            onClick={() => navigate('/financial-planning')}
          >
            التخطيط المالي
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full" 
            onClick={() => navigate('/investment')}
          >
            الاستثمار الذكي
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full" 
            onClick={() => navigate('/major-goals')}
          >
            أهدافي الكبرى
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
