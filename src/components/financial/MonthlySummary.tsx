
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useToast } from "@/hooks/use-toast";

// Initial empty expenses array
const initialExpenses = [];

// Sample data for income/expense
const initialMonthlyData = [
  { name: "الدخل", value: 0, color: "#4CAF50" },
  { name: "المصروفات", value: 0, color: "#F44336" },
];

export function MonthlySummary({ income }) {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState(initialExpenses);
  const [monthlyData, setMonthlyData] = useState(initialMonthlyData);
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate savings
  const savings = income - totalExpenses;
  
  // Update monthly data whenever income or expenses change
  useEffect(() => {
    setMonthlyData([
      { name: "الدخل", value: income, color: "#4CAF50" },
      { name: "المصروفات", value: totalExpenses, color: "#F44336" }
    ]);

    // Check if expenses are getting too high
    if (totalExpenses > income * 0.8 && income > 0) {
      toast({
        title: "تنبيه!",
        description: "المصروفات تقترب من حد الدخل الشهري",
        variant: "destructive"
      });
    }
  }, [income, totalExpenses, toast]);

  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-right font-cairo">ملخص الشهر</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <Bar dataKey="value">
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <Tooltip 
                  formatter={(value) => [`${value} ريال`, ""]}
                  labelFormatter={() => ""}
                  contentStyle={{ textAlign: 'right', fontFamily: 'Cairo Variable' }}
                />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#4CAF50] mr-2"></div>
                  <span className="font-cairo">{income} ر.س</span>
                </div>
                <span className="font-cairo">الدخل</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#F44336] mr-2"></div>
                  <span className="font-cairo">{totalExpenses} ر.س</span>
                </div>
                <span className="font-cairo">المصروفات</span>
              </div>
              
              <div className="flex justify-between items-center font-bold">
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
            <CardTitle className="text-right font-cairo">توزيع المصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={expenses}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name }) => name}
                >
                  {expenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend layout="vertical" align="right" verticalAlign="middle" />
                <Tooltip 
                  formatter={(value) => [`${value} ر.س`, ""]}
                  contentStyle={{ textAlign: 'right', fontFamily: 'Cairo Variable' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
