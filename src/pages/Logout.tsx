
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { 
  Drawer, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle 
} from "@/components/ui/drawer";
import { Logo } from "@/components/ui/Logo";
import { LogOut, DoorOpen } from "lucide-react";

const Logout = () => {
  const navigate = useNavigate();
  
  // تنفيذ عملية تسجيل الخروج
  const handleLogout = () => {
    // في تطبيق حقيقي، هنا نقوم بحذف بيانات الجلسة والتوكن
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    
    toast.success("تم تسجيل الخروج بنجاح");
    
    // توجيه المستخدم إلى صفحة تسجيل الدخول
    navigate("/login");
  };
  
  // العودة إلى الصفحة السابقة
  const handleCancel = () => {
    navigate(-1);
  };
  
  return (
    <Drawer open={true} onOpenChange={handleCancel}>
      <DrawerContent className="h-[50vh] bg-gradient-to-br from-white to-growup-light/30">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-growup-light to-growup"></div>
        
        <DrawerHeader className="text-center pt-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <DrawerTitle className="text-2xl font-bold text-growup mb-2">تسجيل الخروج</DrawerTitle>
          <DrawerDescription className="max-w-md mx-auto text-base">
            <p className="mb-3">هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟</p>
            <p className="text-muted-foreground text-sm italic">
              "كل نهاية هي بداية جديدة، سنكون بانتظار عودتك لمواصلة رحلة التطوير والنمو معنا"
            </p>
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="flex justify-center my-4">
          <div className="w-16 h-16 rounded-full bg-growup-light/50 flex items-center justify-center">
            <DoorOpen className="h-8 w-8 text-growup" />
          </div>
        </div>
        
        <DrawerFooter className="gap-2 sm:gap-0 px-8">
          <Button
            variant="default"
            className="bg-red-500 hover:bg-red-600 sm:w-auto w-full gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            تسجيل الخروج
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="sm:w-auto w-full border-growup text-growup hover:bg-growup-light/50"
          >
            العودة للتطبيق
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Logout;
