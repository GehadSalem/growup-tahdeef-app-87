
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
import MonthlyObligations from "@/components/financial/MonthlyObligations";
import { SavingsGoal } from "@/components/financial/SavingsGoal";
import { EmergencyFund } from "@/components/financial/EmergencyFund";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IncomeService } from "@/services/incomeService";
import { ExpenseService } from "@/services/expenseService";
import { EmergencyService } from "@/services/emergencyService";
import { SavingsGoalsService } from "@/services/savingsGoalsService";
import { MajorGoalsService } from "@/services/majorGoalsService";

export default function FinancialPlanning() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [income, setIncome] = useState<number>(0);
  const [incomeDescription, setIncomeDescription] = useState<string>("");

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

  // Get expenses
  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: ExpenseService.getExpenses,
    enabled: isAuthenticated,
  });

  // Get emergency fund
  const { data: emergencyFund } = useQuery({
    queryKey: ['emergency'],
    queryFn: EmergencyService.getEmergencyFunds,
    enabled: isAuthenticated,
  });

  // Get savings goals
  const { data: savingsGoals = [] } = useQuery({
    queryKey: ['savingsGoals'],
    queryFn: SavingsGoalsService.getUserSavingsGoals,
    enabled: isAuthenticated,
  });

  // Get major goals
  const { data: majorGoals = [] } = useQuery({
    queryKey: ['majorGoals'],
    queryFn: MajorGoalsService.getUserMajorGoals,
    enabled: isAuthenticated,
  });

  // Add income mutation with all required fields
  const addIncomeMutation = useMutation({
    mutationFn: IncomeService.addIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      setIncomeDescription(""); // Clear description after success
      toast({
        title: "تم إضافة الدخل",
        description: "تم إضافة الدخل بنجاح"
      });
    },
    onError: (error: any) => {
      console.error('Income API Error:', error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في إضافة الدخل",
        variant: "destructive"
      });
    }
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

  const handleUpdateIncome = () => {
    if (income > 0 && incomeDescription.trim()) {
      addIncomeMutation.mutate({
        amount: income,
        source: "راتب شهري",
        description: incomeDescription
      });
    } else {
      toast({
        title: "خطأ",
        description: "يرجى إدخال قيمة صحيحة للدخل ووصف",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <AppHeader showMenu title="التخطيط المالي" onBackClick={() => navigate('/main-menu')} />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* قسم إعداد الدخل الشهري */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right font-cairo text-lg sm:text-xl">الدخل الشهري</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-right block font-cairo text-sm sm:text-base" htmlFor="monthly-income">
                  الدخل الشهري (ر.س)
                </Label>
                <Input
                  id="monthly-income"
                  type="number"
                  value={income || ''}
                  onChange={e => setIncome(Number(e.target.value))}
                  className="text-right text-sm sm:text-base"
                  placeholder="مثال: 15000"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-right block font-cairo text-sm sm:text-base" htmlFor="income-description">
                  وصف الدخل
                </Label>
                <Input
                  id="income-description"
                  type="text"
                  value={incomeDescription}
                  onChange={e => setIncomeDescription(e.target.value)}
                  className="text-right text-sm sm:text-base"
                  placeholder="مثال: راتب شهر ديسمبر"
                />
              </div>
              <div className="w-full">
                <Button
                  className="bg-growup hover:bg-growup-dark w-full text-sm sm:text-base py-2 sm:py-3"
                  onClick={handleUpdateIncome}
                  disabled={addIncomeMutation.isPending}
                >
                  {addIncomeMutation.isPending ? "جاري الإضافة..." : "إضافة الدخل"}
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
