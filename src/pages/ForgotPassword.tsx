
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال البريد الإلكتروني",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // محاكاة إرسال طلب استعادة كلمة المرور
      // في تطبيق حقيقي، سيتم إرسال طلب إلى الخادم لإرسال رابط إعادة تعيين كلمة المرور
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // عرض شاشة التأكيد بعد تقديم الطلب
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-growup-light">
        <div className="flex flex-col flex-1 items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Logo size="lg" className="mx-auto mb-8" />
            <div className="bg-white rounded-xl shadow-md p-8">
              <h1 className="text-2xl font-bold font-cairo mb-6 text-center">
                تم إرسال رابط إعادة التعيين
              </h1>
              <p className="text-center text-gray-600 mb-6">
                لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد الخاص بك واتباع التعليمات.
              </p>
              <Button 
                className="w-full bg-growup hover:bg-growup-dark text-white h-12"
                onClick={() => navigate("/login")}
              >
                العودة إلى تسجيل الدخول
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-growup-light">
      <div className="flex flex-col flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Logo size="lg" className="mx-auto mb-8" />
          
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-center mb-6">
              <Lock className="h-8 w-8 text-growup mr-2" />
              <h1 className="text-2xl font-bold font-cairo text-center">
                استعادة كلمة المرور
              </h1>
            </div>
            
            <p className="text-gray-600 mb-6 text-center font-cairo">
              أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-right block font-cairo">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field text-right"
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
                    <span className="mr-2">جاري الإرسال...</span>
                  </span>
                ) : (
                  "إرسال رابط إعادة التعيين"
                )}
              </Button>
            </form>
            
            <div className="text-center mt-4">
              <button
                onClick={() => navigate("/login")}
                className="text-growup hover:underline font-cairo"
              >
                العودة إلى تسجيل الدخول
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
