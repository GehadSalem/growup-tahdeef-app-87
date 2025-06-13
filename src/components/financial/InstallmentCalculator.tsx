
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Calendar, AlertTriangle, Plus } from "lucide-react";
import { format, addMonths } from "date-fns";
import { ar } from "date-fns/locale";
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
  productName: z.string().min(1, { message: "يجب إدخال اسم المنتج" }),
  totalCost: z.coerce.number().positive({ message: "يجب أن يكون التكلفة الإجمالية أكبر من صفر" }),
  downPayment: z.coerce.number().min(0).optional(),
  monthsCount: z.coerce.number().int().min(1, { message: "يجب أن تكون عدد الأشهر أكبر من صفر" }),
  interestRate: z.coerce.number().min(0).optional(),
});

// تعريف نموذج إضافة قسط لخطة موجودة
const installmentFormSchema = z.object({
  amount: z.coerce.number().positive({ message: "يجب أن يكون المبلغ أكبر من صفر" }),
  paymentDate: z.string().min(1, { message: "يجب تحديد تاريخ الدفع" }),
  paymentMethod: z.string().optional(),
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
    queryFn: () => selectedPlanId ? InstallmentService.getInstallmentsByPlanId(selectedPlanId) : Promise.resolve([]),
    enabled: !!selectedPlanId,
  });

  // نموذج إنشاء خطة جديدة
  const planForm = useForm<z.infer<typeof planFormSchema>>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      productName: "",
      totalCost: 0,
      downPayment: 0,
      monthsCount: 12,
      interestRate: 0,
    },
  });

  // نموذج إضافة قسط
  const installmentForm = useForm<z.infer<typeof installmentFormSchema>>({
    resolver: zodResolver(installmentFormSchema),
    defaultValues: {
      amount: 0,
      paymentDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
      paymentMethod: "bank_transfer",
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
  const calculateMonthlyAmount = (totalCost: number, monthsCount: number, interestRate: number = 0, downPayment: number = 0) => {
    if (totalCost <= 0 || monthsCount <= 0) return 0;
    
    const loanAmount = totalCost - downPayment;
    
    if (interestRate > 0) {
      const monthlyRate = interestRate / 100 / 12;
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, monthsCount)) / (Math.pow(1 + monthlyRate, monthsCount) - 1);
      return monthlyPayment;
    }
    
    return loanAmount / monthsCount;
  };

  // معالج إرسال نموذج الخطة
  const onSubmitPlan = (values: z.infer<typeof planFormSchema>) => {
    const planData: CreateCustomInstallmentPlanRequest = {
      productName: values.productName,
      totalCost: values.totalCost,
      downPayment: values.downPayment || 0,
      monthsCount: values.monthsCount,
      interestRate: values.interestRate || 0,
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
      amount: values.amount,
      paymentDate: values.paymentDate,
      paymentMethod: values.paymentMethod || "bank_transfer",
      installmentPlanId: selectedPlanId,
      status: "pending",
    };

    console.log('Creating installment with data:', installmentData);
    createInstallmentMutation.mutate(installmentData);
  };

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
                        name="productName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right block">اسم المنتج</FormLabel>
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
                        name="totalCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right block">التكلفة الإجمالية (ر.س)</FormLabel>
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
                        name="downPayment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right block">الدفعة المقدمة (ر.س)</FormLabel>
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
                        control={planForm.control}
                        name="monthsCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right block">عدد الأشهر</FormLabel>
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

                    {/* عرض القسط المحسوب */}
                    {planForm.watch('totalCost') > 0 && planForm.watch('monthsCount') > 0 && (
                      <div className="bg-blue-50 p-4 rounded-lg text-right">
                        <p className="text-sm text-gray-600 mb-1">القسط الشهري المحسوب:</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {calculateMonthlyAmount(
                            planForm.watch('totalCost') || 0,
                            planForm.watch('monthsCount') || 1,
                            planForm.watch('interestRate') || 0,
                            planForm.watch('downPayment') || 0
                          ).toFixed(2)} ر.س
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
                            <h4 className="font-bold text-lg">{plan.productName}</h4>
                            <div className="flex gap-4 text-sm text-gray-600 justify-end mt-2">
                              <span>{plan.monthlyInstallment.toFixed(2)} ر.س/شهرياً</span>
                              <span>•</span>
                              <span>{plan.monthsCount} شهر</span>
                              <span>•</span>
                              <span>{plan.totalCost.toFixed(2)} ر.س إجمالي</span>
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
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-right block">مبلغ القسط (ر.س)</FormLabel>
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
                            name="paymentDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-right block">تاريخ الدفع</FormLabel>
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
                          
                          <FormField
                            control={installmentForm.control}
                            name="paymentMethod"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-right block">طريقة الدفع</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="تحويل بنكي"
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
                                  variant={installment.status === 'paid' ? "default" : "outline"}
                                  className={installment.status === 'paid' ? "bg-green-500 hover:bg-green-600" : ""}
                                >
                                  {installment.status === 'paid' ? "مدفوع" : "غير مدفوع"}
                                </Button>
                                
                                <div className="text-xs text-gray-500 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>{format(new Date(installment.paymentDate), "d MMMM yyyy", { locale: ar })}</span>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="font-bold">{installment.amount.toFixed(2)} ر.س</div>
                                <div className="text-sm text-gray-600">
                                  {installment.paymentMethod}
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
      </CardContent>
    </Card>
  );
}
