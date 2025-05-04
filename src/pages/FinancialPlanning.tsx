
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
import { MonthlyReport } from "@/components/financial/MonthlyReport";

export default function FinancialPlanning() {
  const { toast } = useToast();
  const [income, setIncome] = useState(0);
  const [tempIncome, setTempIncome] = useState(0);
  const [activeTab, setActiveTab] = useState("expenses");
  const [expenses, setExpenses] = useState([]);
  const [emergencyFundData, setEmergencyFundData] = useState({
    totalAmount: 0,
    withdrawals: []
  });
  
  // Simulate expenses for demo
  useEffect(() => {
    // Sample data for demonstration
    const demoExpenses = [
      { name: "الطعام والشراب", value: 1200, color: "#FF6384" },
      { name: "المواصلات", value: 800, color: "#36A2EB" },
      { name: "اشتراكات وخدمات", value: 400, color: "#FFCE56" },
      { name: "ترفيه وتسوق", value: 600, color: "#4BC0C0" },
      { name: "التزامات", value: 1500, color: "#9966FF" }
    ];
    
    setExpenses(demoExpenses);
  }, []);
  
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
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="expenses" className="font-cairo">المصروفات</TabsTrigger>
            <TabsTrigger value="obligations" className="font-cairo">الالتزامات</TabsTrigger>
            <TabsTrigger value="reports" className="font-cairo">التقارير</TabsTrigger>
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
          
          <TabsContent value="reports">
            {/* Monthly Report Component */}
            <MonthlyReport 
              income={income} 
              expenses={expenses}
              emergencyFund={emergencyFundData} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
