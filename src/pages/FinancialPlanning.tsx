
import React, { useState } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { PiggyBank, TrendingUp, Calculator, Shield, Target, CreditCard } from "lucide-react";
import { EmergencyFund } from "@/components/financial/EmergencyFund";
import { ExpenseTracker } from "@/components/financial/ExpenseTracker";
import { MonthlyReport } from "@/components/financial/MonthlyReport";
import { SavingsGoal } from "@/components/financial/SavingsGoal";
import { InstallmentCalculator } from "@/components/financial/InstallmentCalculator";
import { MonthlySummary } from "@/components/financial/MonthlySummary";
import { MonthlyObligations } from "@/components/financial/MonthlyObligations";
import { useQuery } from "@tanstack/react-query";
import { IncomeService } from "@/services/incomeService";
import { ExpenseService } from "@/services/expenseService";

const FinancialPlanning = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [monthlyIncome, setMonthlyIncome] = useState(12000);

  // Get incomes and expenses for calculations
  const { data: incomesData = [] } = useQuery({
    queryKey: ['incomes'],
    queryFn: IncomeService.getUserIncomes,
  });

  const { data: expensesData = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: ExpenseService.getExpenses,
  });

  const financialCards = [
    {
      id: "emergency",
      title: "صندوق الطوارئ",
      description: "احتياطي مالي للظروف الطارئة",
      icon: Shield,
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      id: "expenses",
      title: "تتبع المصروفات",
      description: "راقب وحلل مصروفاتك اليومية",
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      id: "savings",
      title: "أهداف الادخار",
      description: "حدد أهدافك المالية وحققها",
      icon: Target,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      id: "calculator",
      title: "حاسبة الأقساط",
      description: "احسب أقساطك والفوائد",
      icon: Calculator,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      id: "obligations",
      title: "الالتزامات الشهرية",
      description: "إدارة الأقساط والالتزامات",
      icon: CreditCard,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      id: "report",
      title: "التقرير الشهري",
      description: "ملخص شامل للوضع المالي",
      icon: PiggyBank,
      color: "text-growup",
      bgColor: "bg-growup/10"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <AppHeader 
        showMenu 
        title="التخطيط المالي" 
        onBackClick={() => navigate('/main-menu')} 
      />
      
      <div className="container mx-auto px-2 sm:px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-4 sm:mb-6 h-auto p-1">
              <TabsTrigger 
                value="summary" 
                className="text-xs md:text-sm py-2 px-1 data-[state=active]:bg-growup data-[state=active]:text-white"
              >
                الملخص
              </TabsTrigger>
              <TabsTrigger 
                value="emergency" 
                className="text-xs md:text-sm py-2 px-1 data-[state=active]:bg-growup data-[state=active]:text-white"
              >
                الطوارئ
              </TabsTrigger>
              <TabsTrigger 
                value="expenses" 
                className="text-xs md:text-sm py-2 px-1 data-[state=active]:bg-growup data-[state=active]:text-white"
              >
                المصروفات
              </TabsTrigger>
              <TabsTrigger 
                value="savings" 
                className="text-xs md:text-sm py-2 px-1 data-[state=active]:bg-growup data-[state=active]:text-white"
              >
                الادخار
              </TabsTrigger>
              <TabsTrigger 
                value="obligations" 
                className="text-xs md:text-sm py-2 px-1 data-[state=active]:bg-growup data-[state=active]:text-white"
              >
                الالتزامات
              </TabsTrigger>
              <TabsTrigger 
                value="report" 
                className="text-xs md:text-sm py-2 px-1 data-[state=active]:bg-growup data-[state=active]:text-white"
              >
                التقرير
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {financialCards.map((card) => (
                  <Card 
                    key={card.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                    onClick={() => setActiveTab(card.id)}
                  >
                    <CardHeader className="pb-2 sm:pb-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`p-1.5 sm:p-2 rounded-lg ${card.bgColor}`}>
                          <card.icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${card.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-xs sm:text-sm md:text-base">{card.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs md:text-sm text-gray-600">{card.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <MonthlySummary income={monthlyIncome} />
            </TabsContent>

            <TabsContent value="emergency">
              <EmergencyFund income={monthlyIncome} setIncome={setMonthlyIncome} />
            </TabsContent>

            <TabsContent value="expenses">
              <ExpenseTracker />
            </TabsContent>

            <TabsContent value="savings">
              <SavingsGoal income={monthlyIncome} />
            </TabsContent>

            <TabsContent value="calculator">
              <InstallmentCalculator />
            </TabsContent>

            <TabsContent value="obligations">
              <MonthlyObligations />
            </TabsContent>

            <TabsContent value="report">
              <MonthlyReport
                income={monthlyIncome}
                expenses={expensesData.map((expense: any, idx: number) => ({
                  name: expense.name ?? expense.title ?? `مصروف ${idx + 1}`,
                  value: expense.amount ?? expense.value ?? 0,
                  color: expense.color ?? "#8884d8"
                }))}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanning;
