
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface BadHabitFormProps {
  onAddHabit: (habit: { name: string; goal: string; alternativeAction: string }) => void;
  onCancel: () => void;
}

export function BadHabitForm({ onAddHabit, onCancel }: BadHabitFormProps) {
  const [newHabit, setNewHabit] = useState({
    name: "",
    goal: "",
    alternativeAction: ""
  });
  
  const handleSubmit = () => {
    onAddHabit(newHabit);
    setNewHabit({ name: "", goal: "", alternativeAction: "" });
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-right font-cairo">إضافة عادة جديدة</CardTitle>
        <CardDescription className="text-right font-cairo">
          سجل العادة التي تريد الإقلاع عنها
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-right block font-cairo" htmlFor="habit-name">العادة السيئة</Label>
          <Input 
            id="habit-name"
            placeholder="مثال: التدخين، السهر المتأخر..."
            className="input-field"
            value={newHabit.name}
            onChange={e => setNewHabit({...newHabit, name: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-right block font-cairo" htmlFor="habit-goal">الهدف</Label>
          <Input 
            id="habit-goal"
            placeholder="مثال: 30 يوم بدون تدخين"
            className="input-field"
            value={newHabit.goal}
            onChange={e => setNewHabit({...newHabit, goal: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-right block font-cairo" htmlFor="habit-alternative">البديل (اختياري)</Label>
          <Input 
            id="habit-alternative"
            placeholder="ماذا ستفعل بدلاً من هذه العادة؟"
            className="input-field"
            value={newHabit.alternativeAction}
            onChange={e => setNewHabit({...newHabit, alternativeAction: e.target.value})}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          إلغاء
        </Button>
        <Button
          className="bg-growup hover:bg-growup-dark"
          onClick={handleSubmit}
        >
          إضافة
        </Button>
      </CardFooter>
    </Card>
  );
}
