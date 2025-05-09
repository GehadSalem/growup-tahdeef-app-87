
import React, { useState } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Target, TrendingUp, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

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

interface MonthlySaving {
  month: string; // تاريخ الشهر بتنسيق YYYY-MM
  amount: number; // المبلغ الذي تم توفيره
  date: string; // تاريخ الإضافة
}

interface Goal {
  id: string;
  type: string;
  name: string;
  cost: number;
  targetDate: string;
  monthlySaving: number;
  currentSaving: number;
  monthlySavingsHistory: MonthlySaving[];
  lastReminderDate?: string;
}

export default function MajorGoals() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isAddingMonthlySaving, setIsAddingMonthlySaving] = useState(false);
  const [newMonthlySaving, setNewMonthlySaving] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<string>(format(new Date(), "yyyy-MM"));
  
  const form = useForm({
    defaultValues: {
      amount: 0,
    }
  });
  
  // نموذج لإضافة هدف جديد
  const [newGoal, setNewGoal] = useState<Omit<Goal, "id" | "monthlySavingsHistory">>({
    type: "marriage",
    name: "",
    cost: 0,
    targetDate: "",
    monthlySaving: 0,
    currentSaving: 0,
  });

  // حساب المدة المتبقية بالشهور للوصول للهدف
  const calculateMonthsToGoal = (goal: Omit<Goal, "id" | "monthlySavingsHistory"> | Goal): number => {
    if (goal.monthlySaving <= 0) return 0;
    
    const remainingAmount = goal.cost - goal.currentSaving;
    return Math.ceil(remainingAmount / goal.monthlySaving);
  };
  
  // تنسيق عرض المدة المتبقية بالسنوات والشهور
  const formatRemainingTime = (months: number): string => {
    if (months <= 0) return "0 شهر";
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${remainingMonths} شهر`;
    } else if (remainingMonths === 0) {
      return `${years} سنة`;
    } else {
      return `${years} سنة و${remainingMonths} أشهر`;
    }
  };
  
  // حساب المبلغ الشهري اللازم توفيره للوصول للهدف في الوقت المحدد
  const calculateRequiredMonthlySaving = (goal: Omit<Goal, "id" | "monthlySavingsHistory"> | Goal): number => {
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

  // التحقق من توفر توفير شهري للشهر الحالي
  const hasCurrentMonthSaving = (goal: Goal): boolean => {
    const currentMonthStr = format(new Date(), "yyyy-MM");
    return goal.monthlySavingsHistory.some(saving => saving.month === currentMonthStr);
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
      monthlySaving: newGoal.monthlySaving || requiredMonthlySaving,
      monthlySavingsHistory: []
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
  
  // فتح مربع حوار إضافة توفير شهري
  const openAddMonthlySavingDialog = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsAddingMonthlySaving(true);
  };
  
  // إضافة توفير شهري جديد
  const handleAddMonthlySaving = () => {
    if (!selectedGoalId) return;
    
    if (newMonthlySaving <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال مبلغ صحيح للتوفير",
        variant: "destructive"
      });
      return;
    }
    
    // تحديث الهدف المحدد بإضافة التوفير الشهري الجديد
    setGoals(goals.map(goal => {
      if (goal.id === selectedGoalId) {
        // التحقق مما إذا كان هناك توفير مسجل لهذا الشهر بالفعل
        const existingMonthSavingIndex = goal.monthlySavingsHistory.findIndex(
          saving => saving.month === currentMonth
        );
        
        let updatedSavingsHistory = [...goal.monthlySavingsHistory];
        
        if (existingMonthSavingIndex >= 0) {
          // تحديث التوفير الموجود لهذا الشهر
          updatedSavingsHistory[existingMonthSavingIndex] = {
            month: currentMonth,
            amount: newMonthlySaving,
            date: new Date().toISOString()
          };
        } else {
          // إضافة توفير جديد لهذا الشهر
          updatedSavingsHistory.push({
            month: currentMonth,
            amount: newMonthlySaving,
            date: new Date().toISOString()
          });
        }
        
        // حساب إجمالي المبلغ المتوفر الجديد
        const totalSavings = updatedSavingsHistory.reduce((sum, saving) => sum + saving.amount, 0);
        
        return {
          ...goal,
          currentSaving: totalSavings,
          monthlySavingsHistory: updatedSavingsHistory
        };
      }
      return goal;
    }));
    
    // إغلاق مربع الحوار وإعادة تعيين القيم
    setIsAddingMonthlySaving(false);
    setSelectedGoalId(null);
    setNewMonthlySaving(0);
    
    toast({
      title: "تم التحديث",
      description: "تم تسجيل التوفير الشهري بنجاح",
    });
  };
  
  // حساب نسبة التقدم نحو الهدف
  const calculateProgress = (goal: Goal): number => {
    return Math.min(100, (goal.currentSaving / goal.cost) * 100);
  };
  
  // تنسيق التاريخ بشكل مقروء
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: ar });
  };

  // تنسيق الشهر والسنة
  const formatMonth = (yearMonth: string): string => {
    const [year, month] = yearMonth.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return format(date, "MMMM yyyy", { locale: ar });
  };
  
  // الحصول على أيقونة الهدف
  const getGoalIcon = (type: string): string => {
    const goalType = GOAL_TYPES.find(g => g.id === type);
    return goalType ? goalType.icon : "🎯";
  };

  // الحصول على الهدف من خلال المعرف
  const getSelectedGoal = (): Goal | undefined => {
    return goals.find(goal => goal.id === selectedGoalId);
  };
  
  // حذف هدف
  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
    
    toast({
      title: "تم الحذف",
      description: "تم حذف الهدف بنجاح",
    });
  };

  // إنشاء تذكيرات للأهداف
  React.useEffect(() => {
    const today = new Date();
    const currentMonthStr = format(today, "yyyy-MM");
    
    goals.forEach(goal => {
      // التحقق مما إذا كان المستخدم قد أدخل توفير للشهر الحالي
      if (!hasCurrentMonthSaving(goal) && 
          (!goal.lastReminderDate || 
           new Date(goal.lastReminderDate).getMonth() !== today.getMonth())) {
        
        // إظهار تذكير للتوفير الشهري
        toast({
          title: `تذكير بهدفك: ${goal.name}`,
          description: `يجب عليك ادخار ${goal.monthlySaving} ريال هذا الشهر للوصول إلى هدفك في الوقت المحدد.`,
        });
        
        // تحديث تاريخ آخر تذكير
        setGoals(goals.map(g => 
          g.id === goal.id ? { ...g, lastReminderDate: today.toISOString() } : g
        ));
      }
    });
  }, [goals, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showBackButton title="الأهداف الكبرى" />
      
      <div className="container mx-auto py-6 px-4">
        <div className="space-y-6">
          {/* نموذج إضافة هدف جديد */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5" />
                إضافة هدف مالي جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goal-type">نوع الهدف</Label>
                    <select 
                      id="goal-type"
                      className="w-full rounded-md border border-gray-300 p-2 mt-1"
                      value={newGoal.type}
                      onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
                    >
                      {GOAL_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.icon} {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="goal-name">اسم الهدف</Label>
                    <Input 
                      id="goal-name"
                      placeholder="مثال: شراء سيارة تويوتا كامري"
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="goal-cost">تكلفة الهدف (ريال)</Label>
                    <Input 
                      id="goal-cost"
                      type="number"
                      placeholder="التكلفة الإجمالية"
                      value={newGoal.cost || ""}
                      onChange={(e) => setNewGoal({...newGoal, cost: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-target-date">تاريخ تحقيق الهدف</Label>
                    <Input 
                      id="goal-target-date"
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-current-saving">المبلغ المتوفر حالياً (ريال)</Label>
                    <Input 
                      id="goal-current-saving"
                      type="number"
                      placeholder="المبلغ المتوفر حالياً"
                      value={newGoal.currentSaving || ""}
                      onChange={(e) => setNewGoal({...newGoal, currentSaving: Number(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="goal-monthly-saving">
                    المبلغ الشهري المخطط توفيره (ريال)
                    {newGoal.targetDate && (
                      <span className="text-xs text-gray-500 block">
                        المبلغ المقترح: {calculateRequiredMonthlySaving(newGoal)} ريال شهرياً
                      </span>
                    )}
                  </Label>
                  <Input 
                    id="goal-monthly-saving"
                    type="number"
                    placeholder="المبلغ الشهري"
                    value={newGoal.monthlySaving || ""}
                    onChange={(e) => setNewGoal({...newGoal, monthlySaving: Number(e.target.value)})}
                  />
                </div>
                
                <Button onClick={handleAddGoal}>
                  إضافة الهدف
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* قائمة الأهداف */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">أهدافك المالية ({goals.length})</h2>
            
            {goals.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Target className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-gray-500">
                    لم تقم بإضافة أي هدف مالي بعد
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => (
                  <Card key={goal.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          <span className="inline-block mr-2">{getGoalIcon(goal.type)}</span>
                          {goal.name}
                        </CardTitle>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 h-8 px-2"
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>التكلفة الإجمالية:</span>
                          <span className="font-bold">{goal.cost.toLocaleString()} ريال</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>المبلغ المتوفر حالياً:</span>
                          <span className="font-bold">{goal.currentSaving.toLocaleString()} ريال</span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>نسبة الإنجاز:</span>
                            <span className="font-bold">{calculateProgress(goal).toFixed(1)}%</span>
                          </div>
                          <Progress value={calculateProgress(goal)} className="h-2" />
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>المبلغ الشهري المطلوب:</span>
                          <span className="font-bold">{goal.monthlySaving.toLocaleString()} ريال</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>المدة المتبقية:</span>
                          <span className="font-bold">{formatRemainingTime(calculateMonthsToGoal(goal))}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>التاريخ المستهدف:</span>
                          <span className="font-bold">{formatDate(goal.targetDate)}</span>
                        </div>
                        
                        {/* قسم الادخار الشهري */}
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <Button
                              size="sm"
                              onClick={() => openAddMonthlySavingDialog(goal.id)}
                              className="bg-green-600 hover:bg-green-700 text-xs"
                            >
                              <Calendar className="h-4 w-4 ml-1" />
                              إضافة إدخار هذا الشهر
                            </Button>
                            <h4 className="text-sm font-bold">سجل الادخار الشهري</h4>
                          </div>
                          
                          {goal.monthlySavingsHistory.length > 0 ? (
                            <div className="max-h-36 overflow-y-auto">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr>
                                    <th className="text-right">الشهر</th>
                                    <th className="text-right">المبلغ</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {goal.monthlySavingsHistory
                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                    .map((saving, idx) => (
                                    <tr key={idx} className="border-b border-gray-100">
                                      <td className="py-1">{formatMonth(saving.month)}</td>
                                      <td className="py-1 font-semibold">{saving.amount.toLocaleString()} ريال</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-sm text-center text-gray-500">لم تسجل أي مبالغ مدخرة بعد</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* فرص زيادة الدخل */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Lightbulb className="h-5 w-5" />
                فرص لزيادة الدخل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CAREER_OPPORTUNITIES.map((opportunity, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{opportunity.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{opportunity.description}</p>
                      <p className="text-sm mb-2">
                        <span className="font-bold">متوسط الدخل: </span>
                        {opportunity.avgIncome}
                      </p>
                      <div>
                        <span className="text-sm font-bold">مصادر للتعلم: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {opportunity.resources.map((resource, idx) => (
                            <span 
                              key={idx}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* مربع حوار إضافة توفير شهري */}
      <Dialog open={isAddingMonthlySaving} onOpenChange={setIsAddingMonthlySaving}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-right font-cairo">
              إضافة مبلغ الادخار الشهري
              {selectedGoalId && (
                <div className="text-sm font-normal text-gray-500 mt-1">
                  {goals.find(g => g.id === selectedGoalId)?.name}
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="month" className="text-right col-span-1">الشهر</Label>
              <Input
                id="month"
                type="month"
                className="col-span-3"
                value={currentMonth}
                onChange={(e) => setCurrentMonth(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right col-span-1">المبلغ</Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="amount"
                  type="number"
                  placeholder="أدخل المبلغ الذي وفرته هذا الشهر"
                  value={newMonthlySaving || ""}
                  onChange={(e) => setNewMonthlySaving(Number(e.target.value))}
                />
                <span>ريال</span>
              </div>
            </div>
            
            {selectedGoalId && (
              <div className="text-sm text-amber-600 mt-2">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>المبلغ المطلوب شهرياً:</span>
                  <strong>{goals.find(g => g.id === selectedGoalId)?.monthlySaving.toLocaleString()} ريال</strong>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingMonthlySaving(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddMonthlySaving}>
              حفظ المبلغ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
