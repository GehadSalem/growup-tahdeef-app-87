
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Sample savings goal
const initialSavingsGoal = 20000;

export function SavingsGoal({ income }) {
  const { toast } = useToast();
  const [savingsGoal, setSavingsGoal] = useState(initialSavingsGoal);
  const [expenses, setExpenses] = useState([]);
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate savings
  const savings = income - totalExpenses;
  const savingsPercentage = income > 0 ? (savings / income) * 100 : 0;
  
  // Calculate progress toward savings goal
  const savingsProgress = savingsGoal > 0 ? (savings / savingsGoal) * 100 : 0;

  // Check for savings milestones
  useEffect(() => {
    // Celebrate savings milestones
    if (savings > 0 && savings >= savingsGoal * 0.5) {
      toast({
        title: "أحسنت!",
        description: "أنت في الطريق الصحيح لتحقيق هدف التوفير",
      });
    }
  }, [savings, savingsGoal, toast]);

  return (
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
                  className="text-right"
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
  );
}
