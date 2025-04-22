
import { useState } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgressCircle } from "@/components/ui/ProgressCircle";
import { useToast } from "@/hooks/use-toast";
import { CalendarClock, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";

interface BadHabit {
  id: string;
  name: string;
  goal: string;
  dayCount: number;
  alternativeAction: string;
}

const initialHabits: BadHabit[] = [
  {
    id: "1",
    name: "الإقلاع عن التدخين",
    goal: "30 يوم بدون تدخين",
    dayCount: 7,
    alternativeAction: "امشِ 5 دقائق عندما تشعر برغبة في التدخين"
  }
];

export default function BreakHabits() {
  const { toast } = useToast();
  const [badHabits, setBadHabits] = useState<BadHabit[]>(initialHabits);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    goal: "",
    alternativeAction: ""
  });
  
  const handleAddHabit = () => {
    if (!newHabit.name || !newHabit.goal) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم العادة والهدف",
        variant: "destructive"
      });
      return;
    }
    
    const habit: BadHabit = {
      id: Date.now().toString(),
      name: newHabit.name,
      goal: newHabit.goal,
      dayCount: 0,
      alternativeAction: newHabit.alternativeAction || "جرب ممارسة التنفس العميق لمدة دقيقة"
    };
    
    setBadHabits([...badHabits, habit]);
    setNewHabit({ name: "", goal: "", alternativeAction: "" });
    setShowAddForm(false);
    
    toast({
      title: "تم الإضافة",
      description: "تمت إضافة العادة بنجاح. أنت تستطيع!"
    });
  };
  
  const incrementDay = (id: string) => {
    setBadHabits(badHabits.map(habit => 
      habit.id === id ? { ...habit, dayCount: habit.dayCount + 1 } : habit
    ));
    
    toast({
      title: "أحسنت!",
      description: "يوم إضافي من النجاح! استمر!"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showBackButton title="كسر العادات السيئة" />
      
      <div className="container mx-auto px-4 py-6">
        <section className="mb-6">
          <div className="bg-white rounded-xl p-6 shadow-md text-center border border-gray-100">
            <h2 className="text-xl font-bold font-cairo mb-2">مسار التغيير</h2>
            <p className="text-gray-600 mb-4 font-cairo">كل يوم تصمد فيه هو انتصار على نفسك</p>
            <div className="flex justify-center">
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center justify-center gap-2 text-growup font-bold hover:bg-growup/5 rounded-lg px-4 py-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>إضافة عادة للتخلص منها</span>
              </button>
            </div>
          </div>
        </section>
        
        {/* Add Form */}
        {showAddForm && (
          <section className="mb-6">
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
                  onClick={() => setShowAddForm(false)}
                >
                  إلغاء
                </Button>
                <Button
                  className="bg-growup hover:bg-growup-dark"
                  onClick={handleAddHabit}
                >
                  إضافة
                </Button>
              </CardFooter>
            </Card>
          </section>
        )}
        
        {/* Habits List */}
        <section className="space-y-6">
          {badHabits.map(habit => (
            <Card key={habit.id} className="border-2 border-growup/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-right font-cairo">{habit.name}</CardTitle>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-growup/10 text-growup font-medium">
                    {habit.goal}
                  </span>
                </div>
                <CardDescription className="text-right font-cairo">
                  كم يوم صامد؟
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="text-growup h-5 w-5" />
                    <div className="text-2xl font-bold font-cairo text-growup">
                      {habit.dayCount} <span className="text-sm font-normal">أيام</span>
                    </div>
                  </div>
                  
                  <ProgressCircle 
                    percentage={Math.min(Math.round((habit.dayCount / 30) * 100), 100)} 
                    size={80} 
                    strokeWidth={8} 
                  />
                </div>
                
                <div className="mt-6 p-3 bg-growup/10 rounded-lg">
                  <p className="font-cairo font-medium text-right">
                    <span className="font-bold">البديل: </span>
                    {habit.alternativeAction}
                  </p>
                </div>
                
                <div className="mt-4 text-center">
                  <Button 
                    className="bg-growup hover:bg-growup-dark" 
                    onClick={() => incrementDay(habit.id)}
                  >
                    أضف يوم نجاح ✅
                  </Button>
                </div>
              </CardContent>
              
              <CardFooter className="justify-center border-t pt-4">
                <p className="text-sm text-center text-growup-text font-cairo">
                  "ما في عادة أقوى من إرادتك. انت قادر!"
                </p>
              </CardFooter>
            </Card>
          ))}
          
          {badHabits.length === 0 && !showAddForm && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 mb-4 font-cairo">لم تقم بإضافة أي عادات بعد</p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-growup hover:bg-growup-dark"
              >
                <Plus className="mr-0 ml-2 h-4 w-4" />
                إضافة عادة للتخلص منها
              </Button>
            </div>
          )}
        </section>
        
        {/* Motivational Section */}
        <section className="mt-8">
          <Card className="bg-gradient-to-r from-growup/20 to-growup/5 border-none">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold font-cairo mb-3 text-right">نصائح للتغلب على العادات السيئة</h3>
              <ul className="space-y-2 text-right font-cairo">
                <li className="flex items-center justify-end gap-2">
                  <span>تجنب المحفزات التي تدفعك للعودة للعادة السيئة</span>
                  <span className="text-growup text-lg">✓</span>
                </li>
                <li className="flex items-center justify-end gap-2">
                  <span>استبدل العادة السيئة بعادة إيجابية</span>
                  <span className="text-growup text-lg">✓</span>
                </li>
                <li className="flex items-center justify-end gap-2">
                  <span>شارك تقدمك مع صديق مقرب</span>
                  <span className="text-growup text-lg">✓</span>
                </li>
                <li className="flex items-center justify-end gap-2">
                  <span>كافئ نفسك على كل إنجاز صغير</span>
                  <span className="text-growup text-lg">✓</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
