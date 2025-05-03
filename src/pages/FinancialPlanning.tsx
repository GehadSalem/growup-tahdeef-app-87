
import { useState, useEffect } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, WalletCards } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MonthlyObligations } from "@/components/financial/MonthlyObligations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmergencyFund } from "@/components/financial/EmergencyFund";
import { ExpenseTracker } from "@/components/financial/ExpenseTracker";
import { MonthlySummary } from "@/components/financial/MonthlySummary";
import { SavingsGoal } from "@/components/financial/SavingsGoal";
import { FinancialTips } from "@/components/financial/FinancialTips";

export default function FinancialPlanning() {
  const { toast } = useToast();
  const [income, setIncome] = useState(0);
  const [tempIncome, setTempIncome] = useState(0);
  const [activeTab, setActiveTab] = useState("expenses");
  
  const handleIncomeChange = (value: number) => {
    setIncome(value);
    toast({
      title: "تم تحديث الدخل الشهري",
      description: `تم تحديث دخلك الشهري إلى ${value} ريال`,
    });
  };

  const handleSaveIncome = () => {
    handleIncomeChange(tempIncome);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showBackButton title="التخطيط المالي" />
      
      <div className="container mx-auto px-4 py-6">
        <Tabs
          defaultValue="expenses"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="expenses" className="font-cairo">المصروفات</TabsTrigger>
            <TabsTrigger value="obligations" className="font-cairo">الالتزامات الشهرية</TabsTrigger>
          </TabsList>
          
          <TabsContent value="expenses">
            {/* Monthly Income Input */}
            <section className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right font-cairo flex items-center justify-end gap-2">
                    <WalletCards className="h-5 w-5" />
                    الدخل الشهري
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label className="text-right block font-cairo" htmlFor="monthly-income">
                      أدخل دخلك الشهري (ر.س)
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveIncome}
                        className="bg-growup hover:bg-growup-dark"
                      >
                        حفظ
                      </Button>
                      <Input
                        id="monthly-income"
                        type="number"
                        min="0"
                        value={tempIncome || ''}
                        onChange={(e) => setTempIncome(Number(e.target.value))}
                        placeholder="مثال: 10000"
                        className="text-right"
                      />
                    </div>
                    {income > 0 && (
                      <div className="mt-2 text-right text-sm text-gray-600 font-cairo">
                        الدخل الشهري الحالي: {income} ريال
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Emergency Fund Section */}
            <section className="mb-6">
              <EmergencyFund income={income} setIncome={setIncome} />
            </section>

            {/* Income and Expenses Summary */}
            <MonthlySummary income={income} />
            
            {/* Add Expense Form */}
            <ExpenseTracker />
            
            {/* Savings Goal */}
            <SavingsGoal income={income} />
            
            {/* Financial Tips */}
            <FinancialTips />
          </TabsContent>
          
          <TabsContent value="obligations">
            <MonthlyObligations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
