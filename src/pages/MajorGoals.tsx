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
      <AppHeader showBackButton title="
