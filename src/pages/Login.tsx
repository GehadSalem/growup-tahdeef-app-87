
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (!isLogin && !name)) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال جميع البيانات المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would make an API call for authentication
    if (isLogin) {
      // Simulate login success
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك مجدداً!",
      });
    } else {
      // Simulate registration success
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في GrowUp!",
      });
    }
    
    // Navigate to subscription page after login/signup
    navigate("/subscription");
  };
  
  const handleGoogleSignIn = () => {
    // In a real app, this would trigger Google OAuth
    toast({
      title: "جاري تسجيل الدخول",
      description: "سيتم تحويلك إلى Google للمتابعة",
    });
    
    // Simulate OAuth login after a short delay
    setTimeout(() => {
      navigate("/subscription");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-growup-light">
      <div className="flex flex-col flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Logo size="lg" className="mx-auto mb-8" />
          
          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className="text-2xl font-bold font-cairo mb-6 text-center">
              {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </h1>
            
            <Button 
              variant="outline" 
              className="w-full mb-4 flex items-center justify-center gap-2 font-cairo"
              onClick={handleGoogleSignIn}
            >
              <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" fill="#4285F4"/>
              </svg>
              <span>
                {isLogin ? "تسجيل الدخول بواسطة Google" : "تسجيل بواسطة Google"}
              </span>
            </Button>
            
            <div className="relative my-6">
              <hr className="border-gray-300" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-gray-500 font-cairo">
                أو
              </span>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-right block font-cairo">
                    الاسم
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="أدخل اسمك"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input-field"
                    dir="rtl"
                  />
                </div>
              )}
              
              <div className="space-y-1">
                <Label htmlFor="email" className="text-right block font-cairo">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field text-right"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="password" className="text-right block font-cairo">
                  كلمة المرور
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-growup hover:bg-growup-dark text-white h-12"
              >
                {isLogin ? "تسجيل الدخول" : "إنشاء الحساب"}
              </Button>
            </form>
          </div>
          
          <div className="text-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-growup hover:underline font-cairo"
            >
              {isLogin 
                ? "ليس لديك حساب؟ إنشاء حساب جديد" 
                : "لديك حساب بالفعل؟ تسجيل الدخول"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
