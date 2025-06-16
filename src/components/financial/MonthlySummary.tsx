import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from "lucide-react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { ExpenseService } from "@/services/expenseService";

interface MonthlySummaryProps {
  income: number;
}

export function MonthlySummary({ income }: MonthlySummaryProps) {
  const [expenses, setExpenses] = useState<{ amount: number; category: string; date: string }[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ name: string; value: number }[]>([]);

  const { data: expensesData = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: ExpenseService.getExpenses,
  });

  useEffect(() => {
    if (expensesData.length > 0) {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const monthlyExpenses = expensesData.filter((expense: any) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() + 1 === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      });
      
      setExpenses(monthlyExpenses);
      
      const categoryData = monthlyExpenses.reduce((acc: { name: string; value: number }[], expense: any) => {
  const amount = parseFloat(expense.amount) || 0;
  const existingCategory = acc.find(item => item.name === expense.category);
  
  if (existingCategory) {
    existingCategory.value += amount;
  } else {
    acc.push({ name: expense.category, value: amount });
  }
  return acc;
}, []);

      
      setMonthlyData(categoryData);
    }
  }, [expensesData]);

const totalExpenses = expenses.reduce((sum, expense) => sum + (typeof expense.amount === "number" ? expense.amount : parseFloat(expense.amount) || 0), 0);
  const expensePercentage = income > 0 ? (totalExpenses / income) * 100 : 0;
  const remainingAmount = income - totalExpenses;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(value);
  };

  return (
    <section className="mb-4 sm:mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-right font-cairo text-base sm:text-lg lg:text-xl">ملخص الشهر الحالي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              {/* باقي الكود */}
            </div>
            
            {monthlyData.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-end gap-2 mb-3">
                  <span className="font-cairo font-bold text-sm sm:text-base">توزيع المصروفات</span>
                  <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                </div>
                <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={monthlyData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                      >
                        {monthlyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [formatCurrency(Number(value)), 'المبلغ']}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}