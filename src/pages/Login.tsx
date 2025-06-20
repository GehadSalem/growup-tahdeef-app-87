
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, register, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<{ type: string; message: string } | null>(null);
  const submitInProgress = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        redirectBasedOnRole(user.role || 'user');
      }
    }
  }, [isAuthenticated, authLoading, navigate]);

  const redirectBasedOnRole = (role: 'user' | 'admin') => {
    navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true });
  };

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setAuthError(null);
  };

  const signInWithGoogle = async () => {
    if (isLoading || submitInProgress.current) return;
    
    setIsLoading(true);
    setAuthError(null);
    submitInProgress.current = true;
    
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      
      if (!result.user) {
        throw new Error("فشل الحصول على بيانات المستخدم من جوجل");
      }

      const idToken = await result.user.getIdToken();
      
      if (!idToken) {
        throw new Error("فشل في إنشاء رمز المصادقة");
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "فشل في المصادقة مع الخادم");
      }

      const res = await response.json();

      if (!res.user || !res.token) {
        throw new Error("استجابة غير صالحة من الخادم");
      }

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      toast({ 
        title: "تم تسجيل الدخول بنجاح", 
        description: "مرحباً بك في GrowUp!",
        duration: 5000 
      });
      
      redirectBasedOnRole(res.user.role || 'user');
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      
      let errorMessage = "حدث خطأ أثناء تسجيل الدخول بجوجل";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "تم إغلاق نافذة التسجيل قبل إكمال العملية";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "تم إلغاء طلب التسجيل";
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = "هذا البريد الإلكتروني مسجل بالفعل بطريقة تسجيل مختلفة";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "خطأ في تسجيل الدخول",
        description: errorMessage,
        variant: "destructive",
        duration: 8000
      });
    } finally {
      setIsLoading(false);
      submitInProgress.current = false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading || submitInProgress.current) return;
    
    setIsLoading(true);
    setAuthError(null);
    submitInProgress.current = true;

    if (!email || !password || (!isLogin && !name)) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال جميع الحقول المطلوبة",
        variant: "destructive",
        duration: 5000
      });
      setIsLoading(false);
      submitInProgress.current = false;
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      
      // Navigation will be handled by the useEffect that watches isAuthenticated
    } catch (error: any) {
      console.error("Auth error:", error);
      
      const errorData = error.response?.data;
      
      if (errorData?.errorType) {
        handleAuthErrors(errorData);
      } else {
        // Show a persistent error message
        const errorMessage = errorData?.message || error.message || "حدث خطأ غير متوقع";
        setAuthError({
          type: "general_error",
          message: errorMessage
        });
      }
    } finally {
      setIsLoading(false);
      submitInProgress.current = false;
    }
  };

  const handleAuthErrors = (errorData: any) => {
    const messages: Record<string, string> = {
      user_not_found: "لا يوجد حساب مرتبط بهذا البريد الإلكتروني. هل ترغب في إنشاء حساب جديد؟",
      invalid_password: "كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
      email_exists: "البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.",
      validation_error: "البيانات المدخلة غير صحيحة. يرجى التحقق من صحة البيانات.",
    };

    setAuthError({
      type: errorData.errorType || "general_error",
      message: messages[errorData.errorType] || errorData.message || "حدث خطأ أثناء المصادقة",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-growup-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-cairo text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-growup-light">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-lg">
          <Logo size="lg" className="mx-auto mb-8" />

          <div className="bg-white rounded-xl shadow-md p-8 w-full">
            <h1 className="text-2xl font-bold font-cairo mb-6 text-center">
              {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </h1>

            <Button
              type="button"
              variant="outline"
              className="w-full mb-4 gap-2"
              onClick={signInWithGoogle}
              disabled={isLoading}
            >
              <img src="/icons/google.svg" alt="Google" className="w-4 h-4" />
              {isLogin ? "تسجيل الدخول باستخدام Google" : "التسجيل باستخدام Google"}
            </Button>

            <div className="relative my-6">
              <hr className="border-gray-300" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-gray-500 font-cairo">
                أو
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {authError && (
                <div
                  className={`p-4 rounded-md font-cairo text-sm border ${
                    authError.type === "user_not_found"
                      ? "bg-blue-50 text-blue-800 border-blue-200"
                      : authError.type === "email_exists"
                      ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                      : "bg-red-50 text-red-800 border-red-200"
                  }`}
                >
                  <p className="mb-2">{authError.message}</p>

                  {authError.type === "user_not_found" && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={toggleAuthMode}
                        className="text-growup hover:underline font-medium"
                        disabled={isLoading}
                      >
                        إنشاء حساب جديد
                      </button>
                    </div>
                  )}
                  {authError.type === "email_exists" && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className="text-growup hover:underline font-medium"
                        disabled={isLoading}
                      >
                        تسجيل الدخول
                      </button>
                    </div>
                  )}
                  {authError.type === "invalid_password" && (
                    <div className="text-center">
                      <Link
                        to="/forgot-password"
                        className="text-sm text-growup hover:underline font-medium"
                      >
                        نسيت كلمة المرور؟
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {!isLogin && (
                <div className="space-y-1">
                  <Label htmlFor="name" className="block text-right font-cairo">
                    الاسم
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسمك"
                    dir="rtl"
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="email" className="block text-right font-cairo">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="text-right"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="block text-right font-cairo">
                  كلمة المرور
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>

              {isLogin && (
                <div className="text-left">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-growup hover:underline font-cairo"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-growup hover:bg-growup-dark text-white h-12"
                disabled={isLoading}
              >
                {isLoading ? "جاري المعالجة..." : isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm font-cairo">
              {isLogin ? "ليس لديك حساب؟" : "هل لديك حساب؟"}{" "}
              <button
                onClick={toggleAuthMode}
                className="text-growup hover:underline"
                disabled={isLoading}
              >
                {isLogin ? "أنشئ حسابًا" : "تسجيل الدخول"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
