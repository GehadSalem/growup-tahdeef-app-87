import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Plus, Wallet, Target, Calculator, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IncomeService } from "@/services/incomeService";
import { ExpenseService } from "@/services/expenseService";
import { EmergencyService } from "@/services/emergencyService";
import { useExpensesAPI } from "@/hooks/useExpensesAPI";
import { InstallmentCalculator } from "@/components/financial/InstallmentCalculator.tsx";
import MonthlyObligations from "@/components/financial/MonthlyObligations.tsx";

const FinancialPlanning = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { addExpense, isAdding } = useExpensesAPI();

  // State management
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [emergencyFund, setEmergencyFund] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expenses, setExpenses] = useState<
    Array<{
      id: string;
      amount: number;
      category: string;
      description: string;
      date: string;
    }>
  >([]);
  const [obligations, setObligations] = useState<
  Array<{ id: string; name: string; amount: number; dueDate: Date }>
>([]);

  // Dialog states
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showObligationDialog, setShowObligationDialog] = useState(false);

  // Form states
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [obligationName, setObligationName] = useState("");
  const [obligationAmount, setObligationAmount] = useState(0);
const [obligationDueDate, setObligationDueDate] = useState<Date | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Get user's incomes from API
  const { data: incomesData = [] } = useQuery({
    queryKey: ["incomes"],
    queryFn: IncomeService.getUserIncomes,
    enabled: isAuthenticated,
  });

  // Get expenses from API
  const { data: expensesData = [] } = useQuery({
    queryKey: ["expenses"],
    queryFn: ExpenseService.getExpenses,
    enabled: isAuthenticated,
  });

  // Get emergency fund from API
  const { data: emergencyData } = useQuery({
    queryKey: ["emergency"],
    queryFn: EmergencyService.getEmergencyFunds,
    enabled: isAuthenticated,
  });

  // Add income mutation
  const addIncomeMutation = useMutation({
    mutationFn: IncomeService.addIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      toast({
        title: "تم تحديث الدخل",
        description: "تم تحديث الدخل الشهري بنجاح",
      });
    },
    onError: (error: any) => {
      console.error("Income API Error:", error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحديث الدخل",
        variant: "destructive",
      });
    },
  });

  // Add to emergency fund mutation
  const addToEmergencyMutation = useMutation({
    mutationFn: EmergencyService.addToEmergencyFund,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency"] });
      toast({
        title: "تم إضافة المبلغ",
        description: "تم إضافة المبلغ لصندوق الطوارئ بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إضافة المبلغ",
        variant: "destructive",
      });
    },
  });

  // Calculate monthly income from API data
  useEffect(() => {
    if (incomesData.length > 0) {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const monthlyIncomes = incomesData.filter((income) => {
        const incomeDate = new Date(income.date);
        return (
          incomeDate.getMonth() + 1 === currentMonth &&
          incomeDate.getFullYear() === currentYear
        );
      });

      const totalIncome = monthlyIncomes.reduce(
        (sum, income) => sum + income.amount,
        0
      );
      setMonthlyIncome(totalIncome);
    }
  }, [incomesData]);

  // Calculate expenses from API data
  useEffect(() => {
    if (expensesData.length > 0) {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const monthlyExpenses = expensesData.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() + 1 === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      });

      const total = monthlyExpenses.reduce(
        (sum, expense) => sum + +expense.amount,
        0
      );
      setTotalExpenses(total);

      // Convert API expenses to local format
      const formattedExpenses = monthlyExpenses.map((expense) => ({
        id: expense.id,
        amount: expense.amount,
        category: expense.category,
        description: expense.description || "",
        date: new Date(expense.date).toISOString().split("T")[0],
      }));
      setExpenses(formattedExpenses);
    }
  }, [expensesData]);

  // Calculate emergency fund from API data
  useEffect(() => {
    if (emergencyData) {
      setEmergencyFund(emergencyData.totalAmount || monthlyIncome * 0.1);
    } else {
      setEmergencyFund(monthlyIncome * 0.1);
    }
  }, [emergencyData, monthlyIncome]);

  // Calculate remaining balance
  const remainingBalance = monthlyIncome - emergencyFund - totalExpenses;
  console.log(monthlyIncome, emergencyFund, totalExpenses, remainingBalance);

  const emergencyFundProgress =
    monthlyIncome > 0 ? (emergencyFund / (monthlyIncome * 6)) * 100 : 0;

  const expenseCategories = [
    "طعام ومشروبات",
    "مواصلات",
    "فواتير",
    "ترفيه",
    "ملابس",
    "صحة",
    "تعليم",
    "أخرى",
  ];

  const handleUpdateIncome = () => {
    if (monthlyIncome > 0) {
      addIncomeMutation.mutate({
        amount: monthlyIncome,
        source: "راتب شهري",
        description: "تحديث الدخل الشهري",
        incomeDate: new Date().toISOString(),
      });
    } else {
      toast({
        title: "خطأ",
        description: "يرجى إدخال قيمة صحيحة للدخل",
        variant: "destructive",
      });
    }
  };

  const handleAddExpense = () => {
    if (expenseAmount > 0 && expenseCategory && expenseDescription) {
      // Add to API
      addExpense({
        amount: expenseAmount,
        category: expenseCategory,
        description: expenseDescription,
        date: new Date().toISOString(),
      });

      // Reset form
      setExpenseAmount(0);
      setExpenseCategory("");
      setExpenseDescription("");
      setShowExpenseDialog(false);

      toast({
        title: "تم إضافة المصروف",
        description: `تم خصم ${expenseAmount} ريال من رصيدك`,
      });
    }
  };

  const handleAddObligation = () => {
    if (obligationName && obligationAmount > 0) {
      const newObligation = {
        id: Date.now().toString(),
        name: obligationName,
        amount: obligationAmount,
        dueDate: obligationDueDate,
      };

      setObligations([...obligations, newObligation]);

      // Reset form
      setObligationName("");
      setObligationAmount(0);
      setObligationDueDate(null);
      setShowObligationDialog(false);

      toast({
        title: "تم إضافة الالتزام",
        description: `تم إضافة التزام شهري: ${obligationName}`,
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-cairo">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/main-menu")}>
              ← العودة
            </Button>
            <h1 className="text-xl font-bold">التخطيط المالي</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        {/* Monthly Income Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right text-[20px] flex items-center gap-2 justify-start">
              <Wallet className="h-5 w-5" />
              الدخل الشهري
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-right block mb-2">
                  الدخل الشهري (ريال)
                </Label>
                <Input
                  type="number"
                  value={monthlyIncome || ""}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="text-right text-lg"
                  placeholder="أدخل دخلك الشهري"
                />
              </div>

              <Button
                className="w-full bg-growup hover:bg-growup-dark"
                onClick={handleUpdateIncome}
                disabled={addIncomeMutation.isPending}
              >
                {addIncomeMutation.isPending
                  ? "جاري التحديث..."
                  : "تحديث الدخل"}
              </Button>

              {monthlyIncome > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {incomesData.map((income) => (
                    <div
                      key={income.id}
                      className="flex justify-between items-center bg-gray-100 rounded p-2 text-sm"
                    >
                      <div className="text-right">
                        <div className="font-medium">{income.description}</div>
                        <div className="text-gray-500">
                          {new Date(income.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="font-bold text-green-600">
                        +{income.amount} ريال
                      </div>
                    </div>
                  ))}
                  <div className="mb-4 text-right text-gray-500 text-sm">
                    الدخل الشهري الحالي:{" "}
                    <span className="font-bold text-gray-700">
                      {monthlyIncome} ريال
                    </span>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {emergencyFund.toFixed(0)}
                      </div>
                      <div className="text-sm text-green-700">
                        صندوق الطوارئ (10%)
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {totalExpenses}
                      </div>
                      <div className="text-sm text-red-700">
                        إجمالي المصروفات
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {remainingBalance.toFixed(0)}
                      </div>
                      <div className="text-sm text-blue-700">
                        الرصيد المتبقي
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

            <MonthlyObligations />
      </div>
    </div>
  );
};

export default FinancialPlanning;
