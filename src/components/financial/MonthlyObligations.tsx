
import { useState, useEffect } from "react";
import { PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InstallmentCalculator } from "./InstallmentCalculator";
import { AddObligationDialog, Obligation } from "./obligations/AddObligationDialog";
import { ObligationsSummary } from "./obligations/ObligationsSummary";
import { ObligationsList } from "./obligations/ObligationsList";
import { ObligationsCharts } from "./obligations/ObligationsCharts";
import { ObligationsTips } from "./obligations/ObligationsTips";
import { checkUpcomingObligations } from "./utils/dateUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InstallmentService } from "@/services/installmentService";
import { CustomInstallmentPlanService } from "@/services/customInstallmentPlanService";

export function MonthlyObligations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [income, setIncome] = useState<number>(12000);
  const [savingsGoal, setSavingsGoal] = useState<number>(3000);
  const [activeTab, setActiveTab] = useState<string>("obligations");

  // Get installments from API
  const { data: installments = [], isLoading: installmentsLoading } = useQuery({
    queryKey: ['installments'],
    queryFn: InstallmentService.getUserInstallments,
  });

  // Get custom installment plans from API
  const { data: customPlans = [], isLoading: customPlansLoading } = useQuery({
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
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحديث حالة القسط",
        variant: "destructive"
      });
    }
  });

  // Convert API installments to obligations format
  useEffect(() => {
    if (installments.length > 0) {
      const convertedObligations: Obligation[] = installments.map(installment => ({
        id: installment.id,
        name: installment.name,
        type: "loan" as const,
        amount: installment.monthlyAmount,
        dueDate: installment.dueDate,
        frequency: "monthly" as const,
        isPaid: installment.isPaid,
        salaryImpactPercentage: income > 0 ? (installment.monthlyAmount / income) * 100 : 0,
        notes: `المبلغ الإجمالي: ${installment.totalAmount} ر.س - المتبقي: ${installment.remainingAmount} ر.س`
      }));
      
      setObligations(convertedObligations);
    }
  }, [installments, income]);

  // حساب إجمالي الالتزامات
  const totalObligations = obligations.reduce((sum, obligation) => sum + obligation.amount, 0);
  
  // حساب المتبقي من الراتب بعد الالتزامات
  const remainingIncome = income - totalObligations;
  
  // حساب المتبقي للادخار
  const savingsRemaining = remainingIncome - savingsGoal;
  
  // حساب نسبة الالتزامات من الراتب
  const obligationPercentage = (totalObligations / income) * 100;

  // إضافة التزام جديد
  const handleAddObligation = (newObligation: Obligation) => {
    // Add to API if it's a new installment
    if (newObligation.type === "loan") {
      addInstallmentMutation.mutate({
        name: newObligation.name,
        totalAmount: newObligation.amount * 12, // Assume 12 months for now
        monthlyAmount: newObligation.amount,
        dueDate: newObligation.dueDate
      });
    } else {
      // For other types, just add locally for now
      setObligations([...obligations, newObligation]);
    }
  };

  // تعديل حالة الدفع
  const togglePaymentStatus = (id: string) => {
    const installment = installments.find(inst => inst.id === id);
    if (installment) {
      // Update via API
      markPaidMutation.mutate(id);
    } else {
      // Update locally for non-API obligations
      setObligations(obligations.map(obligation => 
        obligation.id === id ? { ...obligation, isPaid: !obligation.isPaid } : obligation
      ));
    }
  };

  // فحص الالتزامات القريبة وإرسال إشعارات
  useEffect(() => {
    const notify = (title: string, description: string) => {
      toast({ title, description });
    };
    
    const updatedObligations = checkUpcomingObligations(obligations, notify);
    
    // تحديث حالة الإشعارات إذا تغيرت
    if (JSON.stringify(updatedObligations) !== JSON.stringify(obligations)) {
      setObligations(updatedObligations);
    }
    
    // إعادة تعيين حالة الإشعارات كل يوم
    const resetNotifications = () => {
      setObligations(prev => prev.map(item => ({ ...item, notificationSent: false })));
    };
    
    const midnightReset = setInterval(resetNotifications, 86400000); // 24 ساعة
    
    return () => clearInterval(midnightReset);
  }, [obligations, toast]);

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
