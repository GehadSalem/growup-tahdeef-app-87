
import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthService } from "@/services/authService";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<{ type: string; message: string } | null>(null);


  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setAuthError(null);
  };

  useEffect(() => {
    // Check if user is already logged in when component mounts
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      const userData = JSON.parse(user);
      navigate(userData.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, []);

  const handleAuthSuccess = (response: any) => {
    // Save user data to localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));

    // Show success message
    toast({
      title: "تم تسجيل الدخول بنجاح",
      description: "مرحباً بك في GrowUp!",
      duration: 2000
    });

    // Navigate after a short delay to allow toast to show
    setTimeout(() => {
      navigate(response.user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }, 500);
  };
  const signInWithGoogle = async () => {
    setIsLoading(true);
    setAuthError(null);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      if (!result.user) throw new Error("فشل الحصول على بيانات المستخدم من جوجل");

      const idToken = await result.user.getIdToken();
      if (!idToken) throw new Error("فشل في إنشاء رمز المصادقة");

      const response = await AuthService.googleAuth(idToken);
      handleAuthSuccess(response);
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      let errorMessage = "حدث خطأ أثناء تسجيل الدخول بجوجل";

      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "تم إغلاق نافذة التسجيل قبل إكمال العملية";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "تم إلغاء طلب التسجيل";
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = "هذا البريد الإلكتروني مسجل بالفعل بطريقة تسجيل مختلفة";
      }

      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.response?.data?.message || errorMessage,
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    if (!email || !password || (!isLogin && !name)) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال جميع الحقول المطلوبة",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      let response: Awaited<ReturnType<typeof AuthService.login>> | Awaited<ReturnType<typeof AuthService.register>>;
      if (isLogin) {
        response = await AuthService.login({ email, password });
      } else {
        response = await AuthService.register({ email, password, name });
      }
      handleAuthSuccess(response);
    } catch (error: any) {
      console.error("Auth error:", error);
      const errData = error.response?.data;
      if (errData) handleAuthErrors(errData);

      if (!authError) {
        toast({
          title: "خطأ",
          description: errData?.message || error.message || "حدث خطأ غير متوقع",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthErrors = (errorData: any) => {
    const messages: Record<string, string> = {
      user_not_found: "لا يوجد حساب مرتبط بهذا البريد الإلكتروني. هل ترغب في إنشاء حساب جديد؟",
      invalid_password: "كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
      email_exists: "البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.",
    };

    setAuthError({
      type: errorData.errorType || "general_error",
      message: messages[errorData.errorType] || errorData.message || "حدث خطأ أثناء المصادقة",
    });
  };
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
                  className={`p-3 rounded-md font-cairo text-sm ${
                    authError.type === "user_not_found"
                      ? "bg-blue-50 text-blue-800"
                      : authError.type === "email_exists"
                      ? "bg-yellow-50 text-yellow-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {authError.message}

                  {authError.type === "user_not_found" && (
                    <div className="text-center mt-2">
                      <button
                        onClick={toggleAuthMode}
                        className="text-growup hover:underline"
                        disabled={isLoading}
                      >
                        إنشاء حساب جديد
                      </button>
                    </div>
                  )}
                  {authError.type === "email_exists" && (
                    <div className="text-center mt-2">
                      <button
                        onClick={() => setIsLogin(true)}
                        className="text-growup hover:underline"
                        disabled={isLoading}
                      >
                        تسجيل الدخول
                      </button>
                    </div>
                  )}
                  {authError.type === "invalid_password" && (
                    <div className="text-left mt-2">
                      <Link
                        to="/forgot-password"
                        className="text-sm text-growup hover:underline"
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
