
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ExpenseTracker } from "@/components/financial/ExpenseTracker";
import { MonthlySummary } from "@/components/financial/MonthlySummary";
import { MonthlyObligations } from "@/components/financial/MonthlyObligations";
import { SavingsGoal } from "@/components/financial/SavingsGoal";
import { EmergencyFund } from "@/components/financial/EmergencyFund";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { IncomeService } from "@/services/incomeService";

export default function FinancialPlanning() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [income, setIncome] = useState<number>(0);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Get user's incomes
  const { data: incomes = [] } = useQuery({
    queryKey: ['incomes'],
    queryFn: IncomeService.getUserIncomes,
    enabled: isAuthenticated,
  });

  // Calculate total monthly income
  useEffect(() => {
    if (incomes.length > 0) {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const monthlyIncomes = incomes.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() + 1 === currentMonth && 
               incomeDate.getFullYear() === currentYear;
      });
      
      const totalIncome = monthlyIncomes.reduce((sum, income) => sum + income.amount, 0);
      setIncome(totalIncome);
    }
  }, [incomes]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showMenu title="التخطيط المالي" onMenuClick={() => navigate('/menu')} />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        
        {/* قسم إعداد الدخل الشهري */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right font-cairo">الدخل الشهري</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-right block font-cairo" htmlFor="monthly-income">
                  الدخل الشهري (ر.س)
                </Label>
                <Input
                  id="monthly-income"
                  type="number"
                  value={income || ''}
                  onChange={e => setIncome(Number(e.target.value))}
                  className="text-right"
                  placeholder="مثال: 15000"
                />
              </div>
              <div className="flex items-end">
                <Button
                  className="bg-growup hover:bg-growup-dark w-full"
                  onClick={() => {
                    toast({
                      title: "تم التحديث",
                      description: "تم تحديث الدخل الشهري بنجاح"
                    });
                  }}
                >
                  تحديث الدخل
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* صندوق الطوارئ */}
        <EmergencyFund income={income} setIncome={setIncome} />
        
        {/* ملخص الشهر */}
        <MonthlySummary income={income} />
        
        {/* تتبع المصروفات */}
        <ExpenseTracker />
        
        {/* الالتزامات الشهرية */}
        <MonthlyObligations />
        
        {/* هدف التوفير */}
        <SavingsGoal income={income} />
      </div>
    </div>
  );
}
