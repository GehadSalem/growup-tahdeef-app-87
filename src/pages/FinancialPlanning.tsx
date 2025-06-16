
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Plus, Wallet, Target, Calculator, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const FinancialPlanning = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [emergencyFund, setEmergencyFund] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expenses, setExpenses] = useState<Array<{id: string, amount: number, category: string, description: string, date: string}>>([]);
  const [obligations, setObligations] = useState<Array<{id: string, name: string, amount: number, dueDate: number}>>([]);
  
  // Dialog states
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showObligationDialog, setShowObligationDialog] = useState(false);
  
  // Form states
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [obligationName, setObligationName] = useState("");
  const [obligationAmount, setObligationAmount] = useState(0);
  const [obligationDueDate, setObligationDueDate] = useState(1);

  // Calculate emergency fund (10% of income)
  useEffect(() => {
    setEmergencyFund(monthlyIncome * 0.1);
  }, [monthlyIncome]);

  // Calculate remaining balance
  const remainingBalance = monthlyIncome - emergencyFund - totalExpenses;
  const emergencyFundProgress = monthlyIncome > 0 ? (emergencyFund / (monthlyIncome * 6)) * 100 : 0;

  const expenseCategories = [
    "طعام ومشروبات",
    "مواصلات",
    "فواتير",
    "ترفيه",
    "ملابس",
    "صحة",
    "تعليم",
    "أخرى"
  ];

  const handleAddExpense = () => {
    if (expenseAmount > 0 && expenseCategory && expenseDescription) {
      const newExpense = {
        id: Date.now().toString(),
        amount: expenseAmount,
        category: expenseCategory,
        description: expenseDescription,
        date: new Date().toISOString().split('T')[0]
      };
      
      setExpenses([...expenses, newExpense]);
      setTotalExpenses(prev => prev + expenseAmount);
      
      // Reset form
      setExpenseAmount(0);
      setExpenseCategory("");
      setExpenseDescription("");
      setShowExpenseDialog(false);
      
      toast({
        title: "تم إضافة المصروف",
        description: `تم خصم ${expenseAmount} ريال من رصيدك`
      });
    }
  };

  const handleAddObligation = () => {
    if (obligationName && obligationAmount > 0) {
      const newObligation = {
        id: Date.now().toString(),
        name: obligationName,
        amount: obligationAmount,
        dueDate: obligationDueDate
      };
      
      setObligations([...obligations, newObligation]);
      
      // Reset form
      setObligationName("");
      setObligationAmount(0);
      setObligationDueDate(1);
      setShowObligationDialog(false);
      
      toast({
        title: "تم إضافة الالتزام",
        description: `تم إضافة التزام شهري: ${obligationName}`
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-cairo">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/main-menu')}>
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
            <CardTitle className="text-right flex items-center gap-2 justify-end">
              <Wallet className="h-5 w-5" />
              الدخل الشهري
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-right block mb-2">الدخل الشهري (ريال)</Label>
                <Input
                  type="number"
                  value={monthlyIncome || ''}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="text-right text-lg"
                  placeholder="أدخل دخلك الشهري"
                />
              </div>
              
              {monthlyIncome > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{emergencyFund.toFixed(0)}</div>
                      <div className="text-sm text-green-700">صندوق الطوارئ (10%)</div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{totalExpenses.toFixed(0)}</div>
                      <div className="text-sm text-red-700">إجمالي المصروفات</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{remainingBalance.toFixed(0)}</div>
                      <div className="text-sm text-blue-700">الرصيد المتبقي</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {monthlyIncome > 0 && (
          <>
            {/* Emergency Fund Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2 justify-end">
                  <Target className="h-5 w-5" />
                  تقدم صندوق الطوارئ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{Math.min(emergencyFundProgress, 100).toFixed(1)}%</span>
                    <span className="font-bold">{emergencyFund.toFixed(0)} / {(monthlyIncome * 6).toFixed(0)} ريال</span>
                  </div>
                  <Progress value={Math.min(emergencyFundProgress, 100)} className="h-3" />
                  <p className="text-sm text-gray-600 text-right">
                    الهدف: توفير 6 أشهر من الدخل كصندوق طوارئ
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Daily Expenses Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2 justify-between">
                  <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        إضافة مصروف
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>إضافة مصروف جديد</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>المبلغ (ريال)</Label>
                          <Input
                            type="number"
                            value={expenseAmount || ''}
                            onChange={(e) => setExpenseAmount(Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>الفئة</Label>
                          <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الفئة" />
                            </SelectTrigger>
                            <SelectContent>
                              {expenseCategories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>الوصف</Label>
                          <Textarea
                            value={expenseDescription}
                            onChange={(e) => setExpenseDescription(e.target.value)}
                            placeholder="وصف المصروف"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setShowExpenseDialog(false)}>
                            إلغاء
                          </Button>
                          <Button onClick={handleAddExpense}>
                            إضافة
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <span className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    المصروفات اليومية
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {expenses.length > 0 ? (
                  <div className="space-y-3">
                    {expenses.slice(-5).map(expense => (
                      <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-right">
                          <div className="font-medium">{expense.description}</div>
                          <div className="text-sm text-gray-500">{expense.category}</div>
                          <div className="text-xs text-gray-400">{expense.date}</div>
                        </div>
                        <div className="text-red-600 font-bold">-{expense.amount} ريال</div>
                      </div>
                    ))}
                    {expenses.length > 5 && (
                      <div className="text-center text-sm text-gray-500">
                        وآخرين {expenses.length - 5}...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    لم تسجل أي مصروفات بعد
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Monthly Obligations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2 justify-between">
                  <Dialog open={showObligationDialog} onOpenChange={setShowObligationDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" />
                        إضافة التزام
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>إضافة التزام شهري</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>اسم الالتزام</Label>
                          <Input
                            value={obligationName}
                            onChange={(e) => setObligationName(e.target.value)}
                            placeholder="مثل: قسط السيارة"
                          />
                        </div>
                        <div>
                          <Label>المبلغ الشهري (ريال)</Label>
                          <Input
                            type="number"
                            value={obligationAmount || ''}
                            onChange={(e) => setObligationAmount(Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>يوم الاستحقاق في الشهر</Label>
                          <Select value={obligationDueDate.toString()} onValueChange={(value) => setObligationDueDate(Number(value))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: 28}, (_, i) => i + 1).map(day => (
                                <SelectItem key={day} value={day.toString()}>يوم {day}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setShowObligationDialog(false)}>
                            إلغاء
                          </Button>
                          <Button onClick={handleAddObligation}>
                            إضافة
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <span className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    الالتزامات الشهرية
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {obligations.length > 0 ? (
                  <div className="space-y-3">
                    {obligations.map(obligation => (
                      <div key={obligation.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-right">
                          <div className="font-medium">{obligation.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            يوم {obligation.dueDate} من كل شهر
                          </div>
                        </div>
                        <div className="text-orange-600 font-bold">{obligation.amount} ريال</div>
                      </div>
                    ))}
                    <div className="text-center pt-2 border-t">
                      <div className="text-sm text-gray-600">
                        إجمالي الالتزامات الشهرية: <span className="font-bold text-orange-600">
                          {obligations.reduce((sum, o) => sum + o.amount, 0)} ريال
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    لم تضف أي التزامات شهرية بعد
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default FinancialPlanning;
