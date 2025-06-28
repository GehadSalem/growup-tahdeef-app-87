
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
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

export function ExpenseTracker() {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: "food",
    value: 0
  });

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

  return (
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
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                value={newExpense.value || ''}
                onChange={e => setNewExpense({...newExpense, value: Number(e.target.value)})}
                min={0}
                className="text-right"
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
  );
}
