
import React, { useState } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// أنواع الأهداف الكبرى
const GOAL_TYPES = [
  { id: "marriage", name: "الزواج", icon: "💍" },
  { id: "car", name: "شراء سيارة", icon: "🚗" },
  { id: "house", name: "شراء منزل", icon: "🏠" },
  { id: "business", name: "بدء مشروع", icon: "💼" },
  { id: "education", name: "التعليم", icon: "🎓" },
  { id: "other", name: "أخرى", icon: "🎯" }
];

// الفرص المهنية لزيادة الدخل
const CAREER_OPPORTUNITIES = [
  {
    title: "التطوير البرمجي",
    description: "تعلم البرمجة لتطوير تطبيقات الويب والهواتف",
    avgIncome: "5000-20000 ريال شهرياً",
    resources: ["Udemy", "Coursera", "freeCodeCamp"]
  },
  {
    title: "التسويق الرقمي",
    description: "إدارة حملات التسويق الرقمي والتسويق عبر وسائل التواصل",
    avgIncome: "4000-15000 ريال شهرياً",
    resources: ["Google Digital Garage", "HubSpot Academy"]
  },
  {
    title: "التصميم الجرافيكي",
    description: "تصميم الشعارات والهويات البصرية والمحتوى المرئي",
    avgIncome: "3000-12000 ريال شهرياً",
    resources: ["Adobe Tutorials", "Behance", "Dribbble"]
  }
];

interface Goal {
  id: string;
  type: string;
  name: string;
  cost: number;
  targetDate: string;
  monthlySaving: number;
  currentSaving: number;
}

export default function MajorGoals() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  
  // نموذج لإضافة هدف جديد
  const [newGoal, setNewGoal] = useState<Omit<Goal, "id">>({
    type: "marriage",
    name: "",
    cost: 0,
    targetDate: "",
    monthlySaving: 0,
    currentSaving: 0
  });
  
  // حساب المدة المتبقية بالشهور للوصول للهدف
  const calculateMonthsToGoal = (goal: Omit<Goal, "id"> | Goal): number => {
    if (goal.monthlySaving <= 0) return 0;
    
    const remainingAmount = goal.cost - goal.currentSaving;
    return Math.ceil(remainingAmount / goal.monthlySaving);
  };
  
  // حساب المبلغ الشهري اللازم توفيره للوصول للهدف في الوقت المحدد
  const calculateRequiredMonthlySaving = (goal: Omit<Goal, "id"> | Goal): number => {
    if (!goal.targetDate) return 0;
    
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    
    // حساب الفرق بالشهور
    const monthsDiff = 
      (targetDate.getFullYear() - today.getFullYear()) * 12 + 
      (targetDate.getMonth() - today.getMonth());
    
    if (monthsDiff <= 0) return 0;
    
    const remainingAmount = goal.cost - goal.currentSaving;
    return Math.ceil(remainingAmount / monthsDiff);
  };
  
  // إضافة هدف جديد
  const handleAddGoal = () => {
    if (newGoal.name.trim() === "") {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الهدف",
        variant: "destructive"
      });
      return;
    }
    
    if (newGoal.cost <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال تكلفة صحيحة للهدف",
        variant: "destructive"
      });
      return;
    }
    
    if (!newGoal.targetDate) {
      toast({
        title: "خطأ",
        description: "يرجى تحديد تاريخ مستهدف للهدف",
        variant: "destructive"
      });
      return;
    }
    
    const targetDate = new Date(newGoal.targetDate);
    const today = new Date();
    
    if (targetDate <= today) {
      toast({
        title: "خطأ",
        description: "يجب أن يكون التاريخ المستهدف في المستقبل",
        variant: "destructive"
      });
      return;
    }
    
    // حساب المبلغ الشهري اللازم
    const requiredMonthlySaving = calculateRequiredMonthlySaving(newGoal);
    
    const newId = `goal-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    setGoals([...goals, {
      ...newGoal,
      id: newId,
      monthlySaving: newGoal.monthlySaving || requiredMonthlySaving
    }]);
    
    // إعادة تعيين نموذج الهدف الجديد
    setNewGoal({
      type: "marriage",
      name: "",
      cost: 0,
      targetDate: "",
      monthlySaving: 0,
      currentSaving: 0
    });
    
    toast({
      title: "تم الإضافة",
      description: "تم إضافة الهدف الجديد بنجاح",
    });
  };
  
  // حساب نسبة التقدم نحو الهدف
  const calculateProgress = (goal: Goal): number => {
    return Math.min(100, (goal.currentSaving / goal.cost) * 100);
  };
  
  // تنسيق التاريخ بشكل مقروء
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  // الحصول على أيقونة الهدف
  const getGoalIcon = (type: string): string => {
    const goalType = GOAL_TYPES.find(g => g.id === type);
    return goalType ? goalType.icon : "🎯";
  };
  
  // حذف هدف
  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
    
    toast({
      title: "تم الحذف",
      description: "تم حذف الهدف بنجاح",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showBackButton title="أهدافي الكبرى" />
      
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2 font-cairo">حوّل أحلامك إلى خطة واضحة</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            ابدأ رحلتك نحو تحقيق أهدافك الكبرى بخطوات واقعية ومحسوبة
          </p>
        </div>
        
        {/* القسم الأول: إضافة هدف جديد */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-right font-cairo flex items-center justify-end gap-2">
                <Target className="h-5 w-5" />
                إضافة هدف جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-right block">نوع الهدف</Label>
                  <select 
                    className="w-full p-2 border rounded text-right" 
                    value={newGoal.type}
                    onChange={e => setNewGoal({...newGoal, type: e.target.value})}
                  >
                    {GOAL_TYPES.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-right block">اسم الهدف</Label>
                  <Input 
                    className="text-right" 
                    placeholder="مثال: شراء سيارة تويوتا كامري" 
                    value={newGoal.name}
                    onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-right block">التكلفة التقريبية (ريال)</Label>
                  <Input 
                    type="number" 
                    className="text-right" 
                    placeholder="مثال: 120000" 
                    value={newGoal.cost || ''}
                    onChange={e => setNewGoal({...newGoal, cost: Number(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-right block">التاريخ المستهدف للتحقيق</Label>
                  <Input 
                    type="date" 
                    className="text-right" 
                    value={newGoal.targetDate}
                    onChange={e => setNewGoal({...newGoal, targetDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-right block">المدخرات الحالية (إن وجدت)</Label>
                  <Input 
                    type="number" 
                    className="text-right" 
                    placeholder="المبلغ الذي وفرته بالفعل (اختياري)" 
                    value={newGoal.currentSaving || ''}
                    onChange={e => setNewGoal({...newGoal, currentSaving: Number(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-right block">المبلغ الشهري الذي يمكنك توفيره</Label>
                  <Input 
                    type="number" 
                    className="text-right" 
                    placeholder="مثال: 2000" 
                    value={newGoal.monthlySaving || ''}
                    onChange={e => setNewGoal({...newGoal, monthlySaving: Number(e.target.value)})}
                  />
                </div>
                
                <Button 
                  className="w-full bg-growup hover:bg-growup-dark mt-2"
                  onClick={handleAddGoal}
                >
                  إضافة الهدف
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* القسم الثاني: عرض الأهداف */}
        {goals.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-right font-cairo">أهدافي الحالية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map(goal => (
                <Card key={goal.id} className="overflow-hidden">
                  <div className="p-4 bg-growup/20">
                    <div className="flex items-center justify-between mb-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        ×
                      </Button>
                      <div className="font-bold text-right text-lg flex items-center gap-2">
                        {getGoalIcon(goal.type)} {goal.name}
                      </div>
                    </div>
                    
                    <Progress value={calculateProgress(goal)} className="h-2 mb-1" />
                    <div className="text-xs text-right text-gray-500">
                      التقدم: {goal.currentSaving.toLocaleString()} من {goal.cost.toLocaleString()} ريال
                      ({calculateProgress(goal).toFixed(0)}%)
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-2 text-right">
                      <div className="flex justify-between">
                        <span>{goal.cost.toLocaleString()} ريال</span>
                        <span className="text-gray-500">التكلفة:</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span dir="ltr">{formatDate(goal.targetDate)}</span>
                        <span className="text-gray-500">التاريخ المستهدف:</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>{goal.monthlySaving.toLocaleString()} ريال</span>
                        <span className="text-gray-500">التوفير الشهري:</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>{calculateMonthsToGoal(goal)} شهر</span>
                        <span className="text-gray-500">المدة المتبقية:</span>
                      </div>
                    </div>
                    
                    {calculateRequiredMonthlySaving(goal) > goal.monthlySaving && (
                      <div className="mt-3 p-2 bg-yellow-50 border-r-2 border-yellow-500 rounded text-right text-sm">
                        <p>لتحقيق هدفك في الموعد المحدد، يجب زيادة التوفير الشهري إلى {calculateRequiredMonthlySaving(goal).toLocaleString()} ريال</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
        
        {/* القسم الثالث: نصائح وفرص */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-growup/20 to-growup/5 border-none">
            <CardHeader>
              <CardTitle className="text-right font-cairo flex items-center justify-end gap-2">
                <Lightbulb className="h-5 w-5" />
                نصائح وأفكار لزيادة الدخل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-bold text-right mb-2">فرص مهنية لزيادة الدخل:</h3>
                
                {CAREER_OPPORTUNITIES.map((opp, index) => (
                  <div key={index} className="bg-white/60 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-growup">{opp.avgIncome}</div>
                      <h4 className="font-bold">{opp.title}</h4>
                    </div>
                    <p className="text-sm text-right mt-1">{opp.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2 justify-end">
                      {opp.resources.map((resource, idx) => (
                        <span key={idx} className="text-xs bg-growup/20 px-2 py-1 rounded">
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
