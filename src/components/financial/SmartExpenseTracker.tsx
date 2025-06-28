
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, ShoppingCart, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EXPENSE_CATEGORIES, ExpenseItem } from '@/types/financial';

interface SmartExpenseTrackerProps {
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  monthlyBudget: number;
  currentExpenses: ExpenseItem[];
}

export function SmartExpenseTracker({ 
  onAddExpense, 
  monthlyBudget, 
  currentExpenses 
}: SmartExpenseTrackerProps) {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState(EXPENSE_CATEGORIES[0].id);
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');

  const handleAddExpense = () => {
    if (amount <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال مبلغ صحيح",
        variant: "destructive"
      });
      return;
    }

    const category = EXPENSE_CATEGORIES.find(c => c.id === selectedCategory);
    if (!category) return;

    // التحقق من الميزانية
    const totalExpenses = currentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const newTotal = totalExpenses + amount;
    
    if (newTotal > monthlyBudget * 0.8) {
      toast({
        title: "تحذير من الميزانية",
        description: "أنت تقترب من حد الإنفاق المسموح به!",
        variant: "destructive"
      });
    }

    const newExpense: Omit<ExpenseItem, 'id'> = {
      category: selectedCategory,
      categoryName: category.name,
      amount,
      description: description.trim() || undefined,
      date: new Date().toISOString()
    };

    onAddExpense(newExpense);
    
    // إعادة تعيين النموذج
    setAmount(0);
    setDescription('');
    
    toast({
      title: "تم إضافة المصروف",
      description: `تم إضافة ${amount} ريال لفئة ${category.name}`,
    });
  };

  // حساب الإنفاق حسب الفئة
  const getCategorySpending = (categoryId: string) => {
    return currentExpenses
      .filter(expense => expense.category === categoryId)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right font-cairo flex items-center justify-end gap-2">
          <ShoppingCart className="h-5 w-5" />
          تتبع المصروفات الذكي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* اختيار الفئة */}
          <div>
            <Label className="text-right block font-cairo mb-3">اختر فئة المصروف</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {EXPENSE_CATEGORIES.map((category) => {
                const categorySpending = getCategorySpending(category.id);
                const isSelected = selectedCategory === category.id;
                
                return (
                  <Button
                    key={category.id}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex flex-col items-center p-3 h-auto font-cairo text-xs relative ${
                      isSelected ? "bg-growup hover:bg-growup-dark" : ""
                    }`}
                  >
                    <span className="text-lg mb-1">{category.icon}</span>
                    <span>{category.name}</span>
                    {categorySpending > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="absolute -top-2 -right-2 text-xs bg-red-100 text-red-700"
                      >
                        {categorySpending} ر.س
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* إدخال المبلغ والوصف */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-right block font-cairo mb-2">المبلغ (ر.س)</Label>
              <Input
                type="number"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="أدخل المبلغ"
                className="text-right"
                min={0}
              />
            </div>
            
            <div>
              <Label className="text-right block font-cairo mb-2">وصف المصروف (اختياري)</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="مثال: عشاء في المطعم"
                className="text-right"
              />
            </div>
          </div>

          {/* زر الإضافة */}
          <Button
            onClick={handleAddExpense}
            className="w-full bg-growup hover:bg-growup-dark font-cairo"
            disabled={amount <= 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            إضافة المصروف
          </Button>

          {/* تحليل الإنفاق */}
          {currentExpenses.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-cairo font-bold text-right mb-3">تحليل الإنفاق هذا الشهر</h4>
              <div className="space-y-2">
                {EXPENSE_CATEGORIES.map((category) => {
                  const categorySpending = getCategorySpending(category.id);
                  const percentage = monthlyBudget > 0 ? (categorySpending / monthlyBudget) * 100 : 0;
                  
                  if (categorySpending === 0) return null;
                  
                  return (
                    <div key={category.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          style={{ borderColor: category.color, color: category.color }}
                        >
                          {percentage.toFixed(1)}%
                        </Badge>
                        <span className="text-sm">{categorySpending} ر.س</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-cairo">{category.name}</span>
                        <span>{category.icon}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
