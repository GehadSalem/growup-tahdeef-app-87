
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Calendar, AlertTriangle, Plus, Edit, Trash2 } from "lucide-react";
import { format, addMonths } from "date-fns";
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
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomInstallmentPlanService, CreateCustomInstallmentPlanRequest } from "@/services/customInstallmentPlanService";
import { InstallmentService, CreateInstallmentRequest } from "@/services/installmentService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// تعريف نموذج إنشاء خطة مخصصة
const planFormSchema = z.object({
  name: z.string().min(1, { message: "يجب إدخال اسم الخطة" }),
  description: z.string().optional(),
  totalAmount: z.coerce.number().positive({ message: "يجب أن يكون المبلغ الإجمالي أكبر من صفر" }),
  monthlyAmount: z.coerce.number().positive({ message: "يجب أن يكون القسط الشهري أكبر من صفر" }),
  duration: z.coerce.number().int().min(1, { message: "يجب أن تكون المدة أكبر من صفر" }),
  interestRate: z.coerce.number().min(0).optional(),
});

// تعريف نموذج إضافة قسط لخطة موجودة
const installmentFormSchema = z.object({
  name: z.string().min(1, { message: "يجب إدخال اسم القسط" }),
  totalAmount: z.coerce.number().positive({ message: "يجب أن يكون المبلغ الإجمالي أكبر من صفر" }),
  monthlyAmount: z.coerce.number().positive({ message: "يجب أن يكون القسط الشهري أكبر من صفر" }),
  dueDate: z.string().min(1, { message: "يجب تحديد تاريخ الاستحقاق" }),
});

export function InstallmentCalculator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("plans");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // استعلام الخطط المخصصة
  const { data: customPlans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['custom-installment-plans'],
    queryFn: CustomInstallmentPlanService.getPlans,
  });

  // استعلام الأقساط للخطة المحددة
  const { data: installments = [], isLoading: installmentsLoading } = useQuery({
    queryKey: ['installments', selectedPlanId],
    queryFn: () => selectedPlanId ? InstallmentService.getInstallmentsByPlanId(selectedPlanId) : InstallmentService.getUserInstallments(),
    enabled: !!selectedPlanId,
  });

  // نموذج إنشاء خطة جديدة
  const planForm = useForm<z.infer<typeof planFormSchema>>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: "",
      description: "",
      totalAmount: 0,
      monthlyAmount: 0,
      duration: 12,
      interestRate: 0,
    },
  });

  // نموذج إضافة قسط
  const installmentForm = useForm<z.infer<typeof installmentFormSchema>>({
    resolver: zodResolver(installmentFormSchema),
    defaultValues: {
      name: "",
      totalAmount: 0,
      monthlyAmount: 0,
      dueDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
    },
  });

  // إضافة خطة مخصصة جديدة
  const createPlanMutation = useMutation({
    mutationFn: CustomInstallmentPlanService.addPlan,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['custom-installment-plans'] });
      toast({
        title: "تم إنشاء الخطة",
        description: "تم إنشاء خطة التقسيط المخصصة بنجاح",
      });
      planForm.reset();
      setSelectedPlanId(data.id);
      setActiveTab("installments");
    },
    onError: (error: any) => {
      console.error('Create plan error:', error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في إنشاء الخطة",
        variant: "destructive",
      });
    }
  });

  // إضافة قسط لخطة موجودة
  const createInstallmentMutation = useMutation({
    mutationFn: InstallmentService.addInstallment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['installments', selectedPlanId] });
      toast({
        title: "تم إضافة القسط",
        description: "تم إضافة القسط للخطة بنجاح",
      });
      installmentForm.reset();
    },
    onError: (error: any) => {
      console.error('Create installment error:', error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في إضافة القسط",
        variant: "destructive",
      });
    }
  });

  // حساب القسط الشهري المقترح
  const calculateMonthlyAmount = (totalAmount: number, duration: number, interestRate: number = 0) => {
    if (totalAmount <= 0 || duration <= 0) return 0;
    
    if (interestRate > 0) {
      const monthlyRate = interestRate / 100 / 12;
      const monthlyPayment = totalAmount * (monthlyRate * Math.pow(1 + monthlyRate, duration)) / (Math.pow(1 + monthlyRate, duration) - 1);
      return monthlyPayment;
    }
    
    return totalAmount / duration;
  };

  // معالج إرسال نموذج الخطة
  const onSubmitPlan = (values: z.infer<typeof planFormSchema>) => {
    const startDate = new Date();
    
    const planData: CreateCustomInstallmentPlanRequest = {
      name: values.name,
      description: values.description,
      totalAmount: values.totalAmount,
      monthlyAmount: values.monthlyAmount,
      duration: values.duration,
      interestRate: values.interestRate,
      startDate: startDate.toISOString(),
    };

    console.log('Creating plan with data:', planData);
    createPlanMutation.mutate(planData);
  };

  // معالج إرسال نموذج القسط
  const onSubmitInstallment = (values: z.infer<typeof installmentFormSchema>) => {
    if (!selectedPlanId) {
      toast({
        title: "خطأ",
        description: "يجب اختيار خطة أولاً",
        variant: "destructive",
      });
      return;
    }

    const installmentData: CreateInstallmentRequest = {
      name: values.name,
      totalAmount: values.totalAmount,
      monthlyAmount: values.monthlyAmount,
      dueDate: values.dueDate,
      planId: selectedPlanId, // ربط القسط بالخطة المحددة
    };

    console.log('Creating installment with data:', installmentData);
    createInstallmentMutation.mutate(installmentData);
  };

  // تحديث القسط الشهري تلقائياً عند تغيير المبلغ أو المدة
  useEffect(() => {
    const subscription = planForm.watch((value) => {
      if (value.totalAmount && value.duration) {
        const calculatedAmount = calculateMonthlyAmount(
          value.totalAmount,
          value.duration,
          value.interestRate || 0
        );
        planForm.setValue('monthlyAmount', Math.round(calculatedAmount));
      }
    });
    return () => subscription.unsubscribe();
  }, [planForm]);

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-cairo text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right font-cairo flex items-center justify-end gap-2">
          <Calculator className="h-5 w-5" />
          إدارة خطط التقسيط
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plans">الخطط المخصصة</TabsTrigger>
            <TabsTrigger value="installments">إدارة الأقساط</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6">
            {/* نموذج إنشاء خطة جديدة */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-right text-lg">إنشاء خطة تقسيط مخصصة</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...planForm}>
                  <form onSubmit={planForm.handleSubmit(onSubmitPlan)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={planForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right block">اسم الخطة</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="مثل: سيارة جديدة، أثاث المنزل..."
                                className="text-right"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-right" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={planForm.control}
                        name="totalAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right block">المبلغ الإجمالي (ر.س)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="50000"
                                className="text-right"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-right" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={planForm.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right block">المدة (بالشهور)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="12"
                                className="text-right"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-right" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={planForm.control}
                        name="interestRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right block">معدل الفائدة (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="5"
                                className="text-right"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-right text-sm">
                              اتركه فارغاً إذا لم توجد فائدة
                            </FormDescription>
                            <FormMessage className="text-right" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={planForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-right block">وصف الخطة (اختياري)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="تفاصيل إضافية عن الخطة..."
                              className="text-right"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-right" />
                        </FormItem>
                      )}
                    />

                    {/* عرض القسط المحسوب */}
                    {planForm.watch('monthlyAmount') > 0 && (
                      <div className="bg-blue-50 p-4 rounded-lg text-right">
                        <p className="text-sm text-gray-600 mb-1">القسط الشهري المحسوب:</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {planForm.watch('monthlyAmount')?.toFixed(2)} ر.س
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="bg-growup hover:bg-growup-dark w-full"
                      disabled={createPlanMutation.isPending}
                    >
                      {createPlanMutation.isPending ? "جاري الإنشاء..." : "إنشاء الخطة"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* عرض الخطط الموجودة */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-right">الخطط المخصصة الموجودة</h3>
              {customPlans.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">لا توجد خطط مخصصة بعد</p>
                  <p className="text-sm text-gray-400 mt-2">ابدأ بإنشاء خطة جديدة أعلاه</p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {customPlans.map((plan) => (
                    <Card key={plan.id} className={cn(
                      "cursor-pointer transition-all",
                      selectedPlanId === plan.id ? "ring-2 ring-growup bg-growup/5" : ""
                    )}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedPlanId(plan.id);
                                setActiveTab("installments");
                              }}
                              className="bg-growup hover:bg-growup-dark"
                            >
                              إدارة الأقساط
                            </Button>
                          </div>
                          <div className="text-right">
                            <h4 className="font-bold text-lg">{plan.name}</h4>
                            <p className="text-sm text-gray-600">{plan.description}</p>
                            <div className="flex gap-4 text-sm text-gray-600 justify-end mt-2">
                              <span>{plan.monthlyAmount.toFixed(2)} ر.س/شهرياً</span>
                              <span>•</span>
                              <span>{plan.duration} شهر</span>
                              <span>•</span>
                              <span>{plan.totalAmount.toFixed(2)} ر.س إجمالي</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="installments" className="space-y-6">
            {!selectedPlanId ? (
              <Card className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-lg font-bold mb-2">اختر خطة أولاً</p>
                <p className="text-gray-500 mb-4">يجب اختيار خطة تقسيط من التبويب السابق لإدارة الأقساط</p>
                <Button onClick={() => setActiveTab("plans")} className="bg-growup hover:bg-growup-dark">
                  العودة للخطط
                </Button>
              </Card>
            ) : (
              <>
                {/* نموذج إضافة قسط جديد */}
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-right text-lg">إضافة قسط جديد</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...installmentForm}>
                      <form onSubmit={installmentForm.handleSubmit(onSubmitInstallment)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={installmentForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-right block">اسم القسط</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="قسط شهر يناير"
                                    className="text-right"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-right" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={installmentForm.control}
                            name="totalAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-right block">المبلغ الإجمالي (ر.س)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="10000"
                                    className="text-right"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-right" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={installmentForm.control}
                            name="monthlyAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-right block">القسط الشهري (ر.س)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="1000"
                                    className="text-right"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-right" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={installmentForm.control}
                            name="dueDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-right block">تاريخ الاستحقاق</FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    className="text-right"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-right" />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="bg-blue-500 hover:bg-blue-600 w-full"
                          disabled={createInstallmentMutation.isPending}
                        >
                          {createInstallmentMutation.isPending ? "جاري الإضافة..." : "إضافة القسط"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* عرض الأقساط المرتبطة بالخطة */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-right">أقساط الخطة المحددة</h3>
                  {installmentsLoading ? (
                    <div className="text-center p-4">
                      <div className="w-6 h-6 border-4 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : installments.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-gray-500">لا توجد أقساط لهذه الخطة بعد</p>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {installments.map((installment) => (
                        <Card key={installment.id} className="bg-white">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2 items-center">
                                <Button
                                  size="sm"
                                  variant={installment.isPaid ? "default" : "outline"}
                                  className={installment.isPaid ? "bg-green-500 hover:bg-green-600" : ""}
                                >
                                  {installment.isPaid ? "مدفوع" : "غير مدفوع"}
                                </Button>
                                
                                <div className="text-xs text-gray-500 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>{format(new Date(installment.dueDate), "d MMMM yyyy", { locale: ar })}</span>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="font-bold">{installment.name}</div>
                                <div className="flex gap-2 text-sm text-gray-600 justify-end">
                                  <span>{installment.monthlyAmount.toFixed(2)} ر.س/شهرياً</span>
                                  <span>•</span>
                                  <span>متبقي: {installment.remainingAmount.toFixed(2)} ر.س</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* نصائح للتقسيط */}
        <div className="mt-8">
          <Card className="bg-gradient-to-br from-growup/20 to-growup/5 border-none">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold font-cairo mb-3 text-right">نصائح للتقسيط الذكي</h3>
              
              <div className="space-y-3 text-right">
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-cairo">ابدأ بإنشاء خطة تقسيط مخصصة تناسب احتياجاتك وقدرتك المالية.</p>
                </div>
                
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-cairo">أضف أقساط منتظمة للخطة وتابع مواعيد السداد لتجنب التأخير.</p>
                </div>
                
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-cairo">تأكد من أن إجمالي أقساطك الشهرية لا يتجاوز 40% من دخلك.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

