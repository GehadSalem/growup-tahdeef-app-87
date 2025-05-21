
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";

// تعريف مخطط التحقق
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }),
  confirmPassword: z
    .string()
    .min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // إعداد نموذج التحكم
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      toast({
        title: "خطأ",
        description: "رمز إعادة التعيين غير صالح أو منتهي الصلاحية",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // هنا سيتم التكامل مع API لإعادة تعيين كلمة المرور
      // في تطبيق حقيقي، سيتم إرسال الرمز وكلمة المرور الجديدة إلى الخادم
      
      // محاكاة الاستجابة من الخادم
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "تم إعادة تعيين كلمة المرور",
        description: "يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة",
      });
      
      navigate("/login");
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-growup-light">
        <div className="flex flex-col flex-1 items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Logo size="lg" className="mx-auto mb-8" />
            <div className="bg-white rounded-xl shadow-md p-8">
              <h1 className="text-2xl font-bold font-cairo mb-6 text-center">
                رابط غير صالح
              </h1>
              <p className="text-center text-gray-600 mb-6">
                رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية
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
                إعادة تعيين كلمة المرور
              </h1>
            </div>
            
            <p className="text-gray-600 mb-6 text-center font-cairo">
              أدخل كلمة المرور الجديدة لحسابك
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-right block font-cairo">
                        كلمة المرور الجديدة
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="input-field"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-right block font-cairo">
                        تأكيد كلمة المرور
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="input-field"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-growup hover:bg-growup-dark text-white h-12 mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -mr-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="mr-2">جاري المعالجة...</span>
                    </span>
                  ) : (
                    "إعادة تعيين كلمة المرور"
                  )}
                </Button>
              </form>
            </Form>
            
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
