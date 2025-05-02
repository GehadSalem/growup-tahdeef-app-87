
import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  
  // إضافة تكامل Google Auth
  useEffect(() => {
    // تحميل مكتبة Google API
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = initializeGoogleSignIn;
    };
    
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "YOUR_GOOGLE_CLIENT_ID", // يجب استبداله بمعرف العميل الخاص بك
          callback: handleGoogleCredentialResponse,
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { theme: "outline", size: "large", width: "100%", text: "continue_with" }
        );
      }
    };
    
    loadGoogleScript();
    
    return () => {
      // تنظيف عند إزالة المكون
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  const handleGoogleCredentialResponse = (response) => {
    setIsLoading(true);
    
    // هنا يمكنك التحقق من الرمز المميز باستخدام API الخاص بك
    console.log("Google token:", response.credential);
    
    // محاكاة نجاح تسجيل الدخول
    toast({
      title: "تم تسجيل الدخول بنجاح",
      description: "مرحباً بك في GrowUp!",
    });
    
    setTimeout(() => {
      setIsLoading(false);
      navigate("/subscription");
    }, 1000);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!email || !password || (!isLogin && !name)) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال جميع البيانات المطلوبة",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // محاكاة التحقق من API
    setTimeout(() => {
      if (isLogin) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك مجدداً!",
        });
      } else {
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "مرحباً بك في GrowUp!",
        });
      }
      
      setIsLoading(false);
      navigate("/subscription");
    }, 1000);
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
            
            <div id="google-signin-button" className="w-full mb-4"></div>
            
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -mr-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="mr-2">جاري التحميل...</span>
                  </span>
                ) : (
                  isLogin ? "تسجيل الدخول" : "إنشاء الحساب"
                )}
              </Button>
            </form>
          </div>
          
          <div className="text-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-growup hover:underline font-cairo"
              disabled={isLoading}
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

// إضافة الواجهة لمكتبة Google
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback: any) => void;
          renderButton: (element: HTMLElement | null, options: any) => void;
        };
      };
    };
  }
}
