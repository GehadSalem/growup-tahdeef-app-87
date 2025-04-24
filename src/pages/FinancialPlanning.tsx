import { useState, useEffect } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plus, WalletCards } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample expense categories
const EXPENSE_CATEGORIES = [
  { id: "food", name: "طعام", color: "#FF8042" },
  { id: "transport", name: "مواصلات", color: "#00C49F" },
  { id: "entertainment", name: "ترفيه", color: "#FFBB28" },
  { id: "bills", name: "فواتير", color: "#0088FE" },
  { id: "shopping", name: "تسوق", color: "#FF8042" },
  { id: "other", name: "أخرى", color: "#8884d8" }
];

// Initial empty expenses array
const initialExpenses = [];

// Sample data for income/expense
const initialMonthlyData = [
  { name: "الدخل", value: 0, color: "#4CAF50" },
  { name: "المصروفات", value: 0, color: "#F44336" },
];

// Sample savings goal
const initialSavingsGoal = 20000;

export default function FinancialPlanning() {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState(initialExpenses);
  const [monthlyData, setMonthlyData] = useState(initialMonthlyData);
  const [income, setIncome] = useState(0);
  const [tempIncome, setTempIncome] = useState(0);
  const [savingsGoal, setSavingsGoal] = useState(initialSavingsGoal);
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate savings
  const savings = income - totalExpenses;
  const savingsPercentage = (savings / income) * 100;
  
  // Calculate progress toward savings goal
  const savingsProgress = (savings / savingsGoal) * 100;

  // Update monthly data whenever income or expenses change
  useEffect(() => {
    setMonthlyData([
      { name: "الدخل", value: income, color: "#4CAF50" },
      { name: "المصروفات", value: totalExpenses, color: "#F44336" }
    ]);

    // Check if expenses are getting too high
    if (totalExpenses > income * 0.8) {
      toast({
        title: "تنبيه!",
        description: "المصروفات تقترب من حد الدخل الشهري",
        variant: "destructive"
      });
    }

    // Celebrate savings milestones
    if (savings > 0 && savings >= savingsGoal * 0.5) {
      toast({
        title: "أحسنت!",
        description: "أنت في الطريق الصحيح لتحقيق هدف التوفير",
      });
    }
  }, [income, totalExpenses, savingsGoal]);
  
  // Add new expense
  const [newExpense, setNewExpense] = useState({
    category: "food",
    value: 0
  });

  const handleIncomeChange = (value: number) => {
    setIncome(value);
    toast({
      title: "تم تحديث الدخل الشهري",
      description: `تم تحديث دخلك الشهري إلى ${value} ريال`,
    });
  };
  
  const handleAddExpense = () => {
    if (newExpense.value <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال قيمة صحيحة",
        variant: "destructive"
      });
      return;
    }
    
    const category = EXPENSE_CATEGORIES.find(c => c.id === newExpense.category);
    if (!category) return;
    
    // Check if category exists
    const existingExpenseIndex = expenses.findIndex(e => e.category === newExpense.category);
    
    if (existingExpenseIndex >= 0) {
      // Update existing expense
      const updatedExpenses = [...expenses];
      updatedExpenses[existingExpenseIndex].value += newExpense.value;
      setExpenses(updatedExpenses);
    } else {
      // Add new expense
      setExpenses([...expenses, {
        category: newExpense.category,
        name: category.name,
        value: newExpense.value,
        color: category.color
      }]);
    }
    
    setNewExpense({
      category: "food",
      value: 0
    });
    
    toast({
      title: "تم الإضافة",
      description: "تمت إضافة المصروف بنجاح",
    });
  };

  const handleSaveIncome = () => {
    setIncome(tempIncome);
    toast({
      title: "تم حفظ الدخل الشهري",
      description: `تم تحديث دخلك الشهري إلى ${tempIncome} ريال`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showBackButton title="التخطيط المالي" />
      
      <div className="container mx-auto px-4 py-6">
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

        {/* Income and Expenses Summary */}
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
        
        {/* Add Expense Form */}
        <section className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right font-cairo">إضافة مصروف جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-right block font-cairo" htmlFor="expense-category">الفئة</Label>
                  <select
                    id="expense-category"
                    className="input-field"
                    value={newExpense.category}
                    onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                  >
                    {EXPENSE_CATEGORIES.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-right block font-cairo" htmlFor="expense-value">المبلغ (ر.س)</Label>
                  <Input
                    id="expense-value"
                    type="number"
                    className="input-field"
                    value={newExpense.value || ''}
                    onChange={e => setNewExpense({...newExpense, value: Number(e.target.value)})}
                    min={0}
                  />
                </div>
              </div>
              
              <Button
                className="mt-4 bg-growup hover:bg-growup-dark w-full"
                onClick={handleAddExpense}
              >
                <Plus className="mr-0 ml-2 h-4 w-4" />
                إضافة مصروف
              </Button>
            </CardContent>
          </Card>
        </section>
        
        {/* Savings Goal */}
        <section className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right font-cairo">هدف التوفير الشهري</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 font-cairo">
                    {Math.round(savingsProgress)}% من الهدف
                  </div>
                  <div className="font-cairo font-bold">
                    {savings} / {savingsGoal} ر.س
                  </div>
                </div>
                
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-growup rounded-full"
                    style={{ width: `${Math.min(savingsProgress, 100)}%` }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-right block font-cairo" htmlFor="savings-goal">تعديل هدف التوفير</Label>
                  <div className="flex gap-2">
                    <Button 
                      className="bg-growup hover:bg-growup-dark"
                      onClick={() => {
                        setSavingsGoal(savingsGoal);
                        toast({
                          title: "تم التحديث",
                          description: "تم تحديث هدف التوفير الشهري"
                        });
                      }}
                    >
                      تحديث
                    </Button>
                    <Input
                      id="savings-goal"
                      type="number"
                      className="input-field"
                      value={savingsGoal}
                      onChange={e => setSavingsGoal(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Financial Tips */}
        <section className="mb-6">
          <Card className="bg-gradient-to-br from-growup/20 to-growup/5 border-none">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold font-cairo mb-3 text-right">نصائح مالية</h3>
              
              <div className="space-y-3 text-right">
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-cairo">وفر 15-20% من دخلك الشهري وابدأ بالاستثمار المبكر.</p>
                </div>
                
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-cairo">سجل مصاريفك اليومية للتعرف على أنماط الإنفاق.</p>
                </div>
                
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-cairo">قارن بين الأسعار قبل الشراء وامتنع عن المشتريات غير الضرورية.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
