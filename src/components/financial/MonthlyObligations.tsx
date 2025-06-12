
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
    onSuccess: () => {
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
    onSuccess: () => {
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
    
    // Convert installments
    if (installments && Array.isArray(installments)) {
      installments.forEach(installment => {
        if (installment && typeof installment === 'object') {
          convertedObligations.push({
            id: installment.id || Math.random().toString(),
            name: installment.name || 'قسط غير محدد',
            type: "loan" as Obligation["type"],
            amount: installment.monthlyAmount || 0,
            dueDate: installment.dueDate || new Date().toISOString(),
            recurrence: "monthly" as Obligation["recurrence"],
            isPaid: installment.isPaid || false,
            salaryImpactPercentage: income > 0 ? ((installment.monthlyAmount || 0) / income) * 100 : 0,
            notes: `المبلغ الإجمالي: ${installment.totalAmount || 0} ر.س - المتبقي: ${installment.remainingAmount || 0} ر.س`
          });
        }
      });
    }

    // Convert custom plans
    if (customPlans && Array.isArray(customPlans)) {
      customPlans.forEach(plan => {
        if (plan && typeof plan === 'object' && plan.isActive) {
          convertedObligations.push({
            id: plan.id || Math.random().toString(),
            name: plan.name || 'خطة غير محددة',
            type: "subscription" as Obligation["type"],
            amount: plan.monthlyAmount || 0,
            dueDate: plan.endDate || new Date().toISOString(),
            recurrence: "monthly" as Obligation["recurrence"],
            isPaid: false,
            salaryImpactPercentage: income > 0 ? ((plan.monthlyAmount || 0) / income) * 100 : 0,
            notes: plan.description || ''
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
      // Add to installments API
      addInstallmentMutation.mutate({
        name: newObligation.name,
        totalAmount: (newObligation.amount || 0) * 12, // Assume 12 months for now
        monthlyAmount: newObligation.amount || 0,
        dueDate: newObligation.dueDate
      });
    } else if (newObligation.type === 'subscription' as Obligation['type']) {
      // Add to custom plans API
      addCustomPlanMutation.mutate({
        name: newObligation.name,
        description: newObligation.notes || '',
        totalAmount: (newObligation.amount || 0) * 12,
        monthlyAmount: newObligation.amount || 0,
        duration: 12,
        startDate: new Date().toISOString()
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-right font-cairo flex items-center justify-end gap-2">
            <PiggyBank className="h-5 w-5" />
            الالتزامات الشهرية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="obligations" className="font-cairo">الالتزامات</TabsTrigger>
              <TabsTrigger value="calculator" className="font-cairo">حاسبة الأقساط</TabsTrigger>
            </TabsList>
            
            <TabsContent value="obligations">
              <div className="flex justify-between items-center mb-6">
                <AddObligationDialog onAddObligation={handleAddObligation} />
                
                <div className="text-right text-lg font-bold font-cairo">
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
