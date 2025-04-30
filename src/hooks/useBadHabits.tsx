
import { useState } from "react";
import { useToast } from "./use-toast";
import { BadHabit } from "@/lib/types";
import { SAMPLE_BAD_HABITS } from "@/lib/constants";

export function useBadHabits() {
  const [badHabits, setBadHabits] = useState<BadHabit[]>(SAMPLE_BAD_HABITS);
  const { toast } = useToast();
  
  // إضافة عادة سيئة جديدة للتخلص منها
  const addBadHabit = (habitData: { name: string; goal: string; alternativeAction: string }) => {
    if (!habitData.name || !habitData.goal) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم العادة والهدف",
        variant: "destructive"
      });
      return;
    }
    
    const habit: BadHabit = {
      id: Date.now().toString(),
      name: habitData.name,
      goal: habitData.goal,
      dayCount: 0,
      alternativeAction: habitData.alternativeAction || "جرب ممارسة التنفس العميق لمدة دقيقة"
    };
    
    setBadHabits([...badHabits, habit]);
    
    toast({
      title: "تم الإضافة",
      description: "تمت إضافة العادة بنجاح. أنت تستطيع!"
    });

    return habit;
  };
  
  // زيادة عدد الأيام التي مرت بدون العادة السيئة
  const incrementDayCount = (id: string) => {
    setBadHabits(badHabits.map(habit => 
      habit.id === id ? { ...habit, dayCount: habit.dayCount + 1 } : habit
    ));
    
    toast({
      title: "أحسنت!",
      description: "يوم إضافي من النجاح! استمر!"
    });
  };
  
  // احتساب نسبة التقدم في هدف التخلص من العادة
  const calculateProgress = (dayCount: number, targetDays = 30) => {
    return Math.min(Math.round((dayCount / targetDays) * 100), 100);
  };

  return {
    badHabits,
    setBadHabits,
    addBadHabit,
    incrementDayCount,
    calculateProgress
  };
}
