
import { useState, useEffect } from "react";
import { PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InstallmentCalculator } from "./InstallmentCalculator";
import { AddObligationDialog } from "./obligations/AddObligationDialog";
import { ObligationsSummary } from "./obligations/ObligationsSummary";
import { ObligationsList } from "./obligations/ObligationsList";
import { ObligationsCharts } from "./obligations/ObligationsCharts";
import { ObligationsTips } from "./obligations/ObligationsTips";
import { checkUpcomingObligations } from "./utils/dateUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InstallmentService } from "@/services/installmentService";
import { CustomInstallmentPlanService } from "@/services/customInstallmentPlanService";

export interface Obligation {
  id: string;
  name: string;
  type: "loan" | "subscription" | "purchase" | "other";
  amount: number;
  dueDate: string;
  recurrence: "monthly" | "quarterly" | "yearly" | "one-time";
  notes?: string;
  isPaid: boolean;
  enableNotifications?: boolean;
  salaryImpactPercentage?: number;
  notificationSent?: boolean;
}

export function MonthlyObligations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [income, setIncome] = useState<number>(12000);
  const [savingsGoal, setSavingsGoal] = useState<number>(3000);
  const [activeTab, setActiveTab] = useState<string>("obligations");

  // Get installments from API
  const { data: installments = [], isLoading: installmentsLoading, error: installmentsError } = useQuery({
    queryKey: ['installments'],
    queryFn: InstallmentService.getUserInstallments,
  });

  // Get custom installment plans from API
  const { data: customPlans = [], isLoading: customPlansLoading, error: customPlansError } = useQuery({
    queryKey: ['custom-installment-plans'],
    queryFn: CustomInstallmentPlanService.getPlans,
  });

  // Add installment mutation
  const addInstallmentMutation = useMutation({
    mutationFn: InstallmentService.addInstallment,
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['installments'] });
      toast({
        title: "تم إضافة القسط",
        description: "تم إضافة القسط بنجاح"
      });
    },
    onError: (error: any) => {
      console.error('Add installment error:', error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في إضافة القسط",
        variant: "destructive"
      });
    }
  });

  // Mark installment as paid mutation
  const markPaidMutation = useMutation({
    mutationFn: InstallmentService.markInstallmentPaid,
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['installments'] });
      toast({
        title: "تم تحديث حالة القسط",
        description: "تم تحديث حالة السداد بنجاح"
      });
    },
    onError: (error: any) => {
      console.error('Mark paid error:', error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحديث حالة القسط",
        variant: "destructive"
      });
    }
  });

  // Add custom plan mutation
  const addCustomPlanMutation = useMutation({
    mutationFn: CustomInstallmentPlanService.addPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-installment-plans'] });
      toast({
        title: "تم إضافة الخطة",
        description: "تم إضافة خطة التقسيط بنجاح"
      });
    },
    onError: (error: any) => {
      console.error('Add custom plan error:', error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في إضافة خطة التقسيط",
        variant: "destructive"
      });
    }
  });

  // Convert API installments to obligations format
  useEffect(() => {
    const convertedObligations: Obligation[] = [];
    
    // Convert installments using correct property names
    if (installments && Array.isArray(installments)) {
      installments.forEach(installment => {
        if (installment && typeof installment === 'object') {
          convertedObligations.push({
            id: installment.id || Math.random().toString(),
            name: `قسط - ${installment.paymentMethod || 'غير محدد'}`,
            type: "loan" as Obligation["type"],
            amount: installment.amount || 0,
            dueDate: installment.paymentDate || new Date().toISOString(),
            recurrence: "monthly" as Obligation["recurrence"],
            isPaid: installment.status === 'paid',
            salaryImpactPercentage: income > 0 ? ((installment.amount || 0) / income) * 100 : 0,
            notes: `حالة الدفع: ${installment.status || 'غير محدد'}`,
            notificationSent: false
          });
        }
      });
    }

    // Convert custom plans using correct property names
    if (customPlans && Array.isArray(customPlans)) {
      customPlans.forEach(plan => {
        if (plan && typeof plan === 'object') {
          convertedObligations.push({
            id: plan.id || Math.random().toString(),
            name: plan.productName || 'خطة غير محددة',
            type: "subscription" as Obligation["type"],
            amount: plan.monthlyInstallment || 0,
            dueDate: plan.createdAt || new Date().toISOString(),
            recurrence: "monthly" as Obligation["recurrence"],
            isPaid: false,
            salaryImpactPercentage: income > 0 ? ((plan.monthlyInstallment || 0) / income) * 100 : 0,
            notes: `إجمالي التكلفة: ${plan.totalCost || 0} ر.س - عدد الأشهر: ${plan.monthsCount || 0}`,
            notificationSent: false
          });
        }
      });
    }

    setObligations(convertedObligations);
  }, [installments, customPlans, income]);

  // حساب إجمالي الالتزامات
  const totalObligations = obligations.reduce((sum, obligation) => sum + (obligation.amount || 0), 0);
  
  // حساب المتبقي من الراتب بعد الالتزامات
  const remainingIncome = income - totalObligations;
  
  // حساب المتبقي للادخار
  const savingsRemaining = remainingIncome - savingsGoal;
  
  // حساب نسبة الالتزامات من الراتب
  const obligationPercentage = income > 0 ? (totalObligations / income) * 100 : 0;

  // إضافة التزام جديد
  const handleAddObligation = (newObligation: Obligation) => {
    console.log('Adding new obligation:', newObligation);
    
    if (newObligation.type === 'loan' as Obligation['type']) {
      // Add to installments API with proper fields
      addInstallmentMutation.mutate({
        amount: newObligation.amount || 0,
        paymentDate: newObligation.dueDate,
        installmentPlanId: 'temp-plan-id' // This would need to be selected from existing plans
      });
    } else {
      // For other types, just add locally for now
      setObligations(prev => [...prev, newObligation]);
    }
  };

  // تعديل حالة الدفع
  const togglePaymentStatus = (id: string) => {
    const installment = installments.find(inst => inst && inst.id === id);
    if (installment) {
      // Update via API
      markPaidMutation.mutate(id);
    } else {
      // Update locally for non-API obligations
      setObligations(prev => prev.map(obligation => 
        obligation.id === id ? { ...obligation, isPaid: !obligation.isPaid } : obligation
      ));
    }
  };

  // فحص الالتزامات القريبة وإرسال إشعارات
  useEffect(() => {
    if (obligations.length === 0) return;
    
    const notify = (title: string, description: string) => {
      toast({ title, description });
    };
    
    try {
      const updatedObligations = checkUpcomingObligations(obligations, notify);
      
      // تحديث حالة الإشعارات إذا تغيرت
      if (JSON.stringify(updatedObligations) !== JSON.stringify(obligations)) {
        setObligations(updatedObligations);
      }
    } catch (error) {
      console.error('Error checking upcoming obligations:', error);
    }
  }, [obligations.length, toast]);

  if (installmentsLoading || customPlansLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-cairo text-gray-600">جاري تحميل الالتزامات...</p>
        </div>
      </div>
    );
  }

  if (installmentsError || customPlansError) {
    console.error('Installments error:', installmentsError);
    console.error('Custom plans error:', customPlansError);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-right font-cairo flex items-center justify-end gap-2 text-base sm:text-lg">
            <PiggyBank className="h-4 w-4 sm:h-5 sm:w-5" />
            الالتزامات الشهرية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4 sm:mb-6">
            <TabsList className="grid grid-cols-2 mb-4 w-full">
              <TabsTrigger value="obligations" className="font-cairo text-xs sm:text-sm">الالتزامات</TabsTrigger>
              <TabsTrigger value="calculator" className="font-cairo text-xs sm:text-sm">حاسبة الأقساط</TabsTrigger>
            </TabsList>
            
            <TabsContent value="obligations">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
                <AddObligationDialog onAddObligation={handleAddObligation} />
                
                <div className="text-right text-base sm:text-lg font-bold font-cairo">
                  إدارة الالتزامات المالية
                </div>
              </div>
              
              {/* ملخص الالتزامات */}
              <ObligationsSummary 
                totalObligations={totalObligations}
                remainingIncome={remainingIncome}
                savingsRemaining={savingsRemaining}
                obligationPercentage={obligationPercentage}
              />
              
              {/* جدول الالتزامات */}
              <ObligationsList 
                obligations={obligations}
                income={income}
                togglePaymentStatus={togglePaymentStatus}
              />
              
              {/* الرسوم البيانية والتحليلات */}
              {obligations.length > 0 && (
                <ObligationsCharts obligations={obligations} />
              )}
              
              {/* نصائح مالية */}
              <ObligationsTips />
            </TabsContent>
            
            <TabsContent value="calculator">
              <InstallmentCalculator />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
