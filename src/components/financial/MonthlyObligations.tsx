
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

export function MonthlyObligations() {
  const { toast } = useToast();
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [income, setIncome] = useState<number>(12000);
  const [savingsGoal, setSavingsGoal] = useState<number>(3000);
  const [activeTab, setActiveTab] = useState<string>("obligations");

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
    setObligations([...obligations, newObligation]);
  };

  // تعديل حالة الدفع
  const togglePaymentStatus = (id: string) => {
    setObligations(obligations.map(obligation => 
      obligation.id === id ? { ...obligation, isPaid: !obligation.isPaid } : obligation
    ));
  };

  // فحص الالتزامات القريبة وإرسال إشعارات
  useEffect(() => {
    const today = new Date();
    const threeDaysLater = addDays(today, 3);
    
    obligations.forEach(obligation => {
      if (!obligation.isPaid && obligation.enableNotifications) {
        const nextPaymentDate = new Date(getNextPaymentDate(obligation.dueDate, obligation.recurrence));
        
        // إشعار لليوم نفسه
        if (format(today, "yyyy-MM-dd") === format(nextPaymentDate, "yyyy-MM-dd") && !obligation.notificationSent) {
          toast({
            title: "موعد سداد اليوم!",
            description: `حان موعد سداد "${obligation.name}" بمبلغ ${obligation.amount} ريال`,
          });
          
          // تحديث حالة الإشعار
          setObligations(prev => prev.map(item => 
            item.id === obligation.id ? { ...item, notificationSent: true } : item
          ));
        }
        
        // إشعار قبل 3 أيام
        else if (
          isAfter(nextPaymentDate, today) && 
          isBefore(nextPaymentDate, threeDaysLater) && 
          !obligation.notificationSent
        ) {
          toast({
            title: "تذكير بموعد سداد قريب",
            description: `موعد سداد "${obligation.name}" سيكون في ${formatDate(nextPaymentDate.toString())}`,
          });
          
          // تحديث حالة الإشعار
          setObligations(prev => prev.map(item => 
            item.id === obligation.id ? { ...item, notificationSent: true } : item
          ));
        }
      }
    });
    
    // إعادة تعيين حالة الإشعارات كل يوم
    const resetNotifications = () => {
      setObligations(prev => prev.map(item => ({ ...item, notificationSent: false })));
    };
    
    const midnightReset = setInterval(resetNotifications, 86400000); // 24 ساعة
    
    return () => clearInterval(midnightReset);
  }, [obligations, toast]);

  // حساب تاريخ السداد القادم حسب التكرار
  const getNextPaymentDate = (dueDate: string, recurrence: string): string => {
    const date = new Date(dueDate);
    const today = new Date();
    
    let nextDate = new Date(date);
    
    // إذا كان التاريخ قد مر، نحسب التاريخ القادم
    if (isBefore(nextDate, today)) {
      switch (recurrence) {
        case "شهري":
          // نضيف شهر حتى نصل لتاريخ مستقبلي
          while (isBefore(nextDate, today)) {
            nextDate = addMonths(nextDate, 1);
          }
          break;
        case "ربع سنوي":
          // نضيف 3 أشهر حتى نصل لتاريخ مستقبلي
          while (isBefore(nextDate, today)) {
            nextDate = addMonths(nextDate, 3);
          }
          break;
        case "سنوي":
          // نضيف سنة (12 شهر) حتى نصل لتاريخ مستقبلي
          while (isBefore(nextDate, today)) {
            nextDate = addMonths(nextDate, 12);
          }
          break;
        case "مرة واحدة":
          // لا نغير التاريخ لأنه يحدث مرة واحدة فقط
          break;
      }
    }
    
    return format(nextDate, "yyyy-MM-dd");
  };

  // تنسيق التاريخ بالعربية
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: ar });
  };

  // استيراد التبعيات التي تحتاجها التنسيقات
  const { format, addMonths, addDays, isAfter, isBefore } = require("date-fns");
  const { ar } = require("date-fns/locale");

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
