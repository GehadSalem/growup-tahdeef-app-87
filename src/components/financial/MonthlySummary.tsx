
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ExpenseService } from "@/services/expenseService";

// Sample data for income/expense
const initialMonthlyData = [
  { name: "الدخل", value: 0, color: "#4CAF50" },
  { name: "المصروفات", value: 0, color: "#F44336" },
];

const EXPENSE_CATEGORIES = [
  { id: "food", name: "طعام", color: "#FF8042" },
  { id: "transport", name: "مواصلات", color: "#00C49F" },
  { id: "entertainment", name: "ترفيه", color: "#FFBB28" },
  { id: "bills", name: "فواتير", color: "#0088FE" },
  { id: "shopping", name: "تسوق", color: "#FF8042" },
  { id: "health", name: "صحة", color: "#8884d8" },
  { id: "education", name: "تعليم", color: "#82ca9d" },
  { id: "other", name: "أخرى", color: "#ffc658" }
];

export function MonthlySummary({ income }) {
  const { toast } = useToast();
  const [monthlyData, setMonthlyData] = useState(initialMonthlyData);
  const [expensesByCategory, setExpensesByCategory] = useState([]);

  // Get expenses from API
  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: ExpenseService.getExpenses,
  });

  // Calculate total expenses and group by category
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate savings
  const savings = income - totalExpenses;
  
  // Update monthly data whenever income or expenses change
  useEffect(() => {
    setMonthlyData([
      { name: "الدخل", value: income, color: "#4CAF50" },
      { name: "المصروفات", value: totalExpenses, color: "#F44336" }
    ]);

    // Group expenses by category
    const categoryGroups = expenses.reduce((acc, expense) => {
      const category = EXPENSE_CATEGORIES.find(cat => cat.id === expense.category);
      const categoryName = category?.name || expense.category;
      const categoryColor = category?.color || "#8884d8";
      
      if (!acc[expense.category]) {
        acc[expense.category] = {
          name: categoryName,
          value: 0,
          color: categoryColor
        };
      }
      acc[expense.category].value += expense.amount;
      return acc;
    }, {});

    setExpensesByCategory(Object.values(categoryGroups));

    // Check if expenses are getting too high
    if (totalExpenses > income * 0.8 && income > 0) {
      toast({
        title: "تنبيه!",
        description: "المصروفات تقترب من حد الدخل الشهري",
        variant: "destructive"
      });
    }
  }, [income, totalExpenses, expenses, toast]);

  return (
    <section className="mb-4 sm:mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-right font-cairo text-lg sm:text-xl">ملخص الشهر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <Bar dataKey="value">
                    {monthlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                  <Tooltip 
                    formatter={(value) => [`${value} ريال`, ""]}
                    labelFormatter={() => ""}
                    contentStyle={{ textAlign: 'right', fontFamily: 'Cairo Variable', fontSize: '12px' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#4CAF50] mr-2"></div>
                  <span className="font-cairo">{income} ر.س</span>
                </div>
                <span className="font-cairo">الدخل</span>
              </div>
              
              <div className="flex justify-between items-center text-sm sm:text-base">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#F44336] mr-2"></div>
                  <span className="font-cairo">{totalExpenses} ر.س</span>
                </div>
                <span className="font-cairo">المصروفات</span>
              </div>
              
              <div className="flex justify-between items-center font-bold text-sm sm:text-base">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#2196F3] mr-2"></div>
                  <span className="font-cairo">{savings} ر.س</span>
                </div>
                <span className="font-cairo">التوفير</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-right font-cairo text-lg sm:text-xl">توزيع المصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            {expensesByCategory.length > 0 ? (
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelStyle={{ fontSize: '10px' }}
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} ر.س`, ""]}
                      contentStyle={{ textAlign: 'right', fontFamily: 'Cairo Variable', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 text-sm sm:text-base">
                لا توجد مصروفات لعرضها
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
