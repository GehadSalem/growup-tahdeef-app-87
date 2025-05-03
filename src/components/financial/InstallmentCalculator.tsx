
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Calendar, AlertTriangle } from "lucide-react";
import { format, addMonths, isEqual } from "date-fns";
import { ar } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// تعريف نموذج البيانات
const formSchema = z.object({
  itemType: z.string().min(1, { message: "يجب إدخال نوع العنصر" }),
  itemPrice: z.coerce.number().positive({ message: "يجب أن يكون السعر أكبر من صفر" }),
  months: z.coerce.number().int().min(1, { message: "يجب أن يكون عدد الشهور أكبر من صفر" }),
  monthlyIncome: z.coerce.number().positive({ message: "يجب إدخال الدخل الشهري" }),
});

// تعريف واجهة القسط
interface Installment {
  id: string;
  itemType: string;
  itemPrice: number;
  monthlyAmount: number;
  totalMonths: number;
  remainingMonths: number;
  startDate: string;
  nextPaymentDate: string;
  percentageOfIncome: number;
  isPaid: boolean;
}

export function InstallmentCalculator() {
  const { toast } = useToast();
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);
  const [percentageOfIncome, setPercentageOfIncome] = useState<number | null>(null);
  const [isSuitable, setIsSuitable] = useState<boolean | null>(null);

  // تهيئة نموذج الحاسبة
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemType: "",
      itemPrice: 0,
      months: 12,
      monthlyIncome: 0,
    },
  });

  // حساب القسط الشهري
  const calculateMonthlyInstallment = (values: z.infer<typeof formSchema>) => {
    const { itemPrice, months, monthlyIncome } = values;
    
    // حساب القسط الشهري (بدون فائدة في هذا المثال البسيط)
    const monthlyAmount = itemPrice / months;
    
    // حساب نسبة القسط من الدخل
    const percentage = (monthlyAmount / monthlyIncome) * 100;
    
    // تحديد ما إذا كان القسط مناسب (أقل من 40% من الدخل)
    const suitable = percentage < 40;
    
    setCalculatedAmount(monthlyAmount);
    setPercentageOfIncome(percentage);
    setIsSuitable(suitable);
    
    return { monthlyAmount, percentage, suitable };
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { monthlyAmount, percentage, suitable } = calculateMonthlyInstallment(values);
    
    toast({
      title: "تم حساب القسط الشهري",
      description: `القسط الشهري: ${monthlyAmount.toFixed(2)} ريال`,
    });
    
    // إظهار نصيحة مناسبة
    if (!suitable) {
      toast({
        title: "تنبيه!",
        description: "ننصحك ألا يتجاوز القسط 40٪ من دخلك",
        variant: "destructive",
      });
    }
  };

  const handleAddInstallment = () => {
    const values = form.getValues();
    const { monthlyAmount, percentage } = calculateMonthlyInstallment(values);
    
    const startDate = new Date();
    const nextPaymentDate = addMonths(startDate, 1);
    
    const newInstallment: Installment = {
      id: `installment-${Date.now()}`,
      itemType: values.itemType,
      itemPrice: values.itemPrice,
      monthlyAmount: monthlyAmount,
      totalMonths: values.months,
      remainingMonths: values.months,
      startDate: format(startDate, "yyyy-MM-dd"),
      nextPaymentDate: format(nextPaymentDate, "yyyy-MM-dd"),
      percentageOfIncome: percentage,
      isPaid: false,
    };
    
    setInstallments([...installments, newInstallment]);
    
    toast({
      title: "تم إضافة القسط",
      description: "تمت إضافة القسط الجديد إلى قائمة الالتزامات",
    });
    
    form.reset();
    setCalculatedAmount(null);
    setPercentageOfIncome(null);
    setIsSuitable(null);
  };

  // تحديث حالة السداد
  const togglePaymentStatus = (id: string) => {
    setInstallments(prevInstallments =>
      prevInstallments.map(installment => {
        if (installment.id === id) {
          const isNowPaid = !installment.isPaid;
          const updatedInstallment = { ...installment, isPaid: isNowPaid };
          
          if (isNowPaid) {
            // إذا تم السداد، نقلل عدد الشهور المتبقية ونحدث تاريخ السداد التالي
            const remainingMonths = installment.remainingMonths - 1;
            if (remainingMonths > 0) {
              const nextDate = addMonths(new Date(installment.nextPaymentDate), 1);
              return {
                ...updatedInstallment,
                remainingMonths,
                nextPaymentDate: format(nextDate, "yyyy-MM-dd"),
              };
            } else {
              // القسط انتهى
              toast({
                title: "تهانينا!",
                description: `تم الانتهاء من سداد قسط ${installment.itemType} بنجاح!`,
              });
            }
          }
          
          return updatedInstallment;
        }
        return installment;
      })
    );
  };

  // التحقق من مواعيد السداد وإرسال إشعارات
  useEffect(() => {
    const checkPaymentDates = () => {
      const today = new Date();
      const todayFormatted = format(today, "yyyy-MM-dd");
      
      installments.forEach(installment => {
        if (!installment.isPaid && installment.nextPaymentDate === todayFormatted) {
          toast({
            title: "تذكير بالسداد!",
            description: `حان موعد سداد قسط ${installment.itemType} بمبلغ ${installment.monthlyAmount.toFixed(2)} ريال`,
          });
        }
      });
    };
    
    // التحقق عند تحميل المكون وعند تغيير الأقساط
    checkPaymentDates();
    
    // إعداد فحص يومي في الساعة 9 صباحًا
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    
    const timeUntilTomorrow = tomorrow.getTime() - now.getTime();
    
    const dailyCheck = setTimeout(() => {
      checkPaymentDates();
      // إعداد فحص متكرر كل 24 ساعة
      const interval = setInterval(checkPaymentDates, 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, timeUntilTomorrow);
    
    return () => clearTimeout(dailyCheck);
  }, [installments, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right font-cairo flex items-center justify-end gap-2">
          <Calculator className="h-5 w-5" />
          حاسبة الأقساط الشهرية
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="itemType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">نوع العنصر</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="مثل: سيارة، هاتف، أثاث..."
                          className="text-right"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="itemPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">سعر العنصر (ر.س)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="مثل: 50000"
                          className="text-right"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="months"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">عدد شهور التقسيط</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="مثل: 12"
                          className="text-right"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="monthlyIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">الدخل الشهري (ر.س)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="مثل: 10000"
                          className="text-right"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-2 justify-end">
                  <Button type="submit" className="bg-growup hover:bg-growup-dark">
                    حساب القسط
                  </Button>
                  
                  {calculatedAmount !== null && (
                    <Button
                      type="button"
                      onClick={handleAddInstallment}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      إضافة إلى الالتزامات
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
          
          {/* نتائج الحساب */}
          {calculatedAmount !== null && percentageOfIncome !== null && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-bold mb-4 text-right">نتائج الحساب:</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-cairo text-lg font-bold">{calculatedAmount.toFixed(2)} ر.س</span>
                    <span className="text-gray-700">القسط الشهري:</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-cairo text-lg font-bold">
                      {percentageOfIncome.toFixed(1)}٪
                    </span>
                    <span className="text-gray-700">نسبة القسط من الدخل:</span>
                  </div>
                  <Progress 
                    value={percentageOfIncome} 
                    className="h-2" 
                    indicatorClassName={percentageOfIncome > 40 ? "bg-red-500" : "bg-green-500"}
                  />
                </div>
                
                <div className="mt-4">
                  <div className={`p-3 rounded-md ${isSuitable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <div className="flex items-center justify-end gap-2 mb-1 font-bold">
                      <span>{isSuitable ? 'مناسب' : 'غير مناسب'}</span>
                      {!isSuitable && <AlertTriangle className="h-5 w-5" />}
                    </div>
                    <p className="text-right text-sm">
                      {isSuitable 
                        ? "القسط في حدود الميزانية المناسبة ولا يشكل عبئًا على دخلك الشهري."
                        : "ننصحك ألا يتجاوز القسط 40٪ من دخلك الشهري لتجنب الضغط المالي."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* قائمة الأقساط المضافة */}
        {installments.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4 text-right">الأقساط المضافة:</h3>
            <div className="space-y-3">
              {installments.map((installment) => (
                <Card key={installment.id} className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={installment.isPaid ? "default" : "outline"}
                          className={installment.isPaid ? "bg-green-500 hover:bg-green-600" : ""}
                          onClick={() => togglePaymentStatus(installment.id)}
                        >
                          {installment.isPaid ? "تم السداد" : "غير مدفوع"}
                        </Button>
                        
                        <div className="text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span dir="rtl">
                            {format(new Date(installment.nextPaymentDate), "d MMMM yyyy", { locale: ar })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold">{installment.itemType}</div>
                        <div className="flex gap-2 text-sm text-gray-600 justify-end">
                          <span>{installment.monthlyAmount.toFixed(2)} ر.س/شهريًا</span>
                          <span>•</span>
                          <span>{installment.remainingMonths} من {installment.totalMonths} شهر</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* نصائح للتقسيط */}
        <div className="mt-8">
          <Card className="bg-gradient-to-br from-growup/20 to-growup/5 border-none">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold font-cairo mb-3 text-right">نصائح للتقسيط الذكي</h3>
              
              <div className="space-y-3 text-right">
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-cairo">تأكد من أن إجمالي أقساطك الشهرية لا يتجاوز 40% من دخلك.</p>
                </div>
                
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-cairo">قم بمقارنة خيارات التقسيط المختلفة للحصول على أفضل سعر فائدة.</p>
                </div>
                
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-cairo">ضع في اعتبارك المصاريف الإضافية مثل التأمين والصيانة عند شراء سيارة بالتقسيط.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
