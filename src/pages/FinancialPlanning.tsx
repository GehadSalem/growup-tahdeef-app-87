
import { useState } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinancialData } from "@/hooks/useFinancialData";
import { MonthlyFinancialTable } from "@/components/financial/MonthlyFinancialTable";
import { SmartExpenseTracker } from "@/components/financial/SmartExpenseTracker";
import { MonthlyObligations } from "@/components/financial/MonthlyObligations";
import { MonthlyReport } from "@/components/financial/MonthlyReport";
import { EmergencyFund } from "@/components/financial/EmergencyFund";
import { SavingsGoal } from "@/components/financial/SavingsGoal";
import { FinancialTips } from "@/components/financial/FinancialTips";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Shield, TrendingUp, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FinancialPlanning() {
  const { toast } = useToast();
  const {
    currentMonthData,
    currentMonth,
    loading,
    updateIncome,
    addExpense,
    addInstallment,
    updateEmergencyFundPercentage,
    changeMonth
  } = useFinancialData();

  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-growup mx-auto mb-4"></div>
          <p className="font-cairo">جاري تحميل البيانات المالية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showBackButton title="التخطيط المالي الذكي" />
      
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="font-cairo">النظرة العامة</TabsTrigger>
            <TabsTrigger value="expenses" className="font-cairo">المصروفات</TabsTrigger>
            <TabsTrigger value="obligations" className="font-cairo">الالتزامات</TabsTrigger>
            <TabsTrigger value="reports" className="font-cairo">التقارير</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {/* جدول البيانات المالية الشهرية */}
              <MonthlyFinancialTable
                data={currentMonthData}
                onUpdateIncome={updateIncome}
                onChangeMonth={changeMonth}
              />

              {/* إعدادات صندوق الطوارئ */}
              {currentMonthData.income > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right font-cairo flex items-center justify-end gap-2">
                      <Shield className="h-5 w-5" />
                      إعدادات صندوق الطوارئ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-right block font-cairo mb-2">
                          نسبة صندوق الطوارئ من الدخل: {currentMonthData.emergencyFundPercentage}%
                        </Label>
                        <Slider
                          value={[currentMonthData.emergencyFundPercentage]}
                          onValueChange={(values) => updateEmergencyFundPercentage(values[0])}
                          max={30}
                          min={5}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>30%</span>
                          <span>5%</span>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="font-cairo text-sm text-blue-800">
                          💡 يُنصح بتخصيص 10-20% من الدخل لصندوق الطوارئ لتغطية النفقات غير المتوقعة
                        </p>
                        <p className="font-cairo text-sm text-blue-600 mt-1">
                          المبلغ المخصص حالياً: <span className="font-bold">{currentMonthData.emergencyFundAmount.toLocaleString()} ريال</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* نصائح مالية ذكية */}
              <FinancialTips />
            </div>
          </TabsContent>

          <TabsContent value="expenses">
            <div className="space-y-6">
              {/* تتبع المصروفات الذكي */}
              <SmartExpenseTracker
                onAddExpense={addExpense}
                monthlyBudget={currentMonthData.income}
                currentExpenses={currentMonthData.expenses}
              />

              {/* أهداف الادخار */}
              <SavingsGoal income={currentMonthData.income} />
            </div>
          </TabsContent>

          <TabsContent value="obligations">
            <MonthlyObligations />
          </TabsContent>

          <TabsContent value="reports">
            <MonthlyReport 
              income={currentMonthData.income}
              expenses={currentMonthData.expenses.map(exp => ({
                name: exp.categoryName,
                value: exp.amount,
                color: '#FF6384'
              }))}
              emergencyFund={{
                totalAmount: currentMonthData.emergencyFundAmount,
                withdrawals: []
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
