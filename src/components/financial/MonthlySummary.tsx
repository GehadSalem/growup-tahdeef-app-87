
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { ExpenseService } from "@/services/expenseService";
import { IncomeService } from "@/services/incomeService";

interface MonthlySummaryProps {
  income: number;
}

export function MonthlySummary({ income }: MonthlySummaryProps) {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  // Get expenses from API
  const { data: expensesData = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: ExpenseService.getExpenses,
  });

  // Get incomes from API
  const { data: incomesData = [] } = useQuery({
    queryKey: ['incomes'],
    queryFn: IncomeService.getUserIncomes,
  });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Filter current month expenses
  const monthlyExpenses = expensesData.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() + 1 === currentMonth && 
           expenseDate.getFullYear() === currentYear;
  });

  // Filter current month incomes
  const monthlyIncomes = incomesData.filter(income => {
    const incomeDate = new Date(income.date);
    return incomeDate.getMonth() + 1 === currentMonth && 
           incomeDate.getFullYear() === currentYear;
  });

  // Calculate totals
  const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const totalMonthlyIncome = monthlyIncomes.reduce((sum, income) => sum + (income.amount || 0), 0);
  const actualIncome = totalMonthlyIncome || income || 0;
  
  // Calculate percentage and remaining amount
  const expensePercentage = actualIncome > 0 ? (totalExpenses / actualIncome) * 100 : 0;
  const remainingAmount = actualIncome - totalExpenses;

  useEffect(() => {
    if (monthlyExpenses.length > 0) {
      // Group expenses by category for chart
      const categoryData = monthlyExpenses.reduce((acc, expense) => {
        const category = expense.category || 'غير محدد';
        const amount = expense.amount || 0;
        
        const existingCategory = acc.find(item => item.name === category);
        if (existingCategory) {
          existingCategory.value += amount;
        } else {
          acc.push({ name: category, value: amount });
        }
        return acc;
      }, []);
      
      setMonthlyData(categoryData);
    } else {
      setMonthlyData([]);
    }
  }, [monthlyExpenses]);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const formatCurrency = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return '0 ر.س';
    
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
            {/* الإحصائيات النصية */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 ml-2" />
                  <span className="text-lg sm:text-xl font-bold text-blue-600">{formatCurrency(actualIncome)}</span>
                </div>
                <span className="text-gray-700 font-cairo text-sm sm:text-base">الدخل الشهري</span>
              </div>
              
              <div className="flex justify-between items-center p-3 sm:p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 ml-2" />
                  <span className="text-lg sm:text-xl font-bold text-red-600">{formatCurrency(totalExpenses)}</span>
                </div>
                <span className="text-gray-700 font-cairo text-sm sm:text-base">إجمالي المصروفات</span>
              </div>
              
              <div className={`flex justify-between items-center p-3 sm:p-4 rounded-lg ${remainingAmount >= 0 ? 'bg-green-50' : 'bg-orange-50'}`}>
                <div className="flex items-center">
                  <TrendingUp className={`h-4 w-4 sm:h-5 sm:w-5 ml-2 ${remainingAmount >= 0 ? 'text-green-600' : 'text-orange-600'}`} />
                  <span className={`text-lg sm:text-xl font-bold ${remainingAmount >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {formatCurrency(Math.abs(remainingAmount))}
                  </span>
                </div>
                <span className="text-gray-700 font-cairo text-sm sm:text-base">
                  {remainingAmount >= 0 ? 'المتبقي' : 'العجز'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-cairo">{isNaN(expensePercentage) ? '0' : expensePercentage.toFixed(1)}%</span>
                  <span className="text-gray-600 font-cairo">نسبة المصروفات من الدخل</span>
                </div>
                <Progress 
                  value={isNaN(expensePercentage) ? 0 : (expensePercentage > 100 ? 100 : expensePercentage)} 
                  className="h-2"
                />
                {expensePercentage > 80 && !isNaN(expensePercentage) && (
                  <p className="text-xs sm:text-sm text-orange-600 text-right font-cairo">
                    تحذير: نسبة المصروفات مرتفعة! حاول تقليل المصروفات غير الضرورية.
                  </p>
                )}
              </div>
            </div>
            
            {/* المخطط الدائري */}
            {monthlyData.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-end gap-2 mb-3">
                  <span className="font-cairo font-bold text-sm sm:text-base">توزيع المصروفات</span>
                  <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
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
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {monthlyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), 'المبلغ']}
                        labelStyle={{ direction: 'rtl' }}
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
