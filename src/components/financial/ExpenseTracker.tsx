
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ExpenseService, CreateExpenseRequest } from "@/services/expenseService";

// Sample expense categories
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

export function ExpenseTracker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newExpense, setNewExpense] = useState({
    category: "food",
    amount: 0,
    description: ""
  });

  // Get expenses from API
  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: ExpenseService.getExpenses,
  });

  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: (expenseData: CreateExpenseRequest) => ExpenseService.addExpense(expenseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "تم إضافة المصروف",
        description: "تمت إضافة المصروف بنجاح"
      });
      setNewExpense({
        category: "food",
        amount: 0,
        description: ""
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة المصروف",
        variant: "destructive"
      });
    }
  });

  const handleAddExpense = () => {
    if (newExpense.amount <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال قيمة صحيحة",
        variant: "destructive"
      });
      return;
    }
    
    addExpenseMutation.mutate({
      amount: newExpense.amount,
      category: newExpense.category,
      description: newExpense.description || undefined,
      date: new Date().toISOString()
    });
  };

  return (
    <section className="mb-4 sm:mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-right font-cairo text-lg sm:text-xl">إضافة مصروف جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className="text-right block font-cairo text-sm sm:text-base" htmlFor="expense-category">الفئة</Label>
              <select
                id="expense-category"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              <Label className="text-right block font-cairo text-sm sm:text-base" htmlFor="expense-amount">المبلغ (ر.س)</Label>
              <Input
                id="expense-amount"
                type="number"
                value={newExpense.amount || ''}
                onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                min={0}
                className="text-right text-sm sm:text-base"
                placeholder="مثال: 50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right block font-cairo text-sm sm:text-base" htmlFor="expense-description">الوصف (اختياري)</Label>
              <Input
                id="expense-description"
                type="text"
                value={newExpense.description}
                onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                className="text-right text-sm sm:text-base"
                placeholder="مثال: غداء مع الأصدقاء"
              />
            </div>
          </div>
          
          <Button
            className="mt-4 bg-growup hover:bg-growup-dark w-full text-sm sm:text-base py-2 sm:py-3"
            onClick={handleAddExpense}
            disabled={addExpenseMutation.isPending}
          >
            <Plus className="mr-0 ml-2 h-4 w-4" />
            {addExpenseMutation.isPending ? "جاري الإضافة..." : "إضافة مصروف"}
          </Button>

          {/* Display recent expenses */}
          {expenses.length > 0 && (
            <div className="mt-6">
              <h3 className="text-right font-cairo font-bold mb-3 text-sm sm:text-base">المصروفات الأخيرة</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-md">
                    <span className="text-sm sm:text-base font-cairo">{expense.amount} ر.س</span>
                    <div className="text-right">
                      <div className="font-bold text-xs sm:text-sm">{EXPENSE_CATEGORIES.find(cat => cat.id === expense.category)?.name || expense.category}</div>
                      {expense.description && (
                        <div className="text-gray-600 text-xs">{expense.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
