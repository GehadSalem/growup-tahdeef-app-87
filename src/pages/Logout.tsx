
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
      <DrawerContent className="h-[30vh]">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-xl font-bold">تسجيل الخروج</DrawerTitle>
          <DrawerDescription>
            هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:gap-0">
          <Button
            variant="default"
            className="bg-red-500 hover:bg-red-600 sm:w-auto w-full"
            onClick={handleLogout}
          >
            تسجيل الخروج
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="sm:w-auto w-full"
          >
            إلغاء
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Logout;
