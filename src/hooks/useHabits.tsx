
import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import { Habit } from "@/lib/types";
import { SAMPLE_HABITS } from "@/lib/constants";
import { getIconForCategory } from "@/lib/icons";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(SAMPLE_HABITS);
  const { toast } = useToast();
  
  // حساب التقدم اليومي
  const calculateDailyProgress = () => {
    const completedHabits = habits.filter(habit => habit.completed).length;
    return habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;
  };

  // تغيير حالة العادة (مكتملة/غير مكتملة)
  const toggleHabitComplete = (id: string) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
    
    // إظهار رسالة نجاح عند إكمال العادة
    const habit = habits.find(h => h.id === id);
    if (habit && !habit.completed) {
      toast({
        title: "أحسنت! 👏",
        description: `لقد أكملت "${habit.name}"`,
      });
    }
  };
  
  // إضافة عادة جديدة
  const addHabit = (habitData: { 
    name: string; 
    category: string;
    frequency: {
      type: 'daily' | 'weekly' | 'monthly';
      time?: string;
      days?: number[];
      dayOfMonth?: number;
    };
  }) => {
    const newHabit = {
      id: Date.now().toString(),
      name: habitData.name,
      category: habitData.category,
      completed: false,
      icon: getIconForCategory(habitData.category),
      frequency: habitData.frequency
    };
    
    setHabits([...habits, newHabit]);
    
    toast({
      title: "تمت الإضافة",
      description: "تم إضافة عادة جديدة بنجاح",
    });
  };
  
  // تعديل عادة
  const editHabit = (id: string, habitData: { 
    name: string; 
    category: string;
    frequency?: {
      type: 'daily' | 'weekly' | 'monthly';
      time?: string;
      days?: number[];
      dayOfMonth?: number;
    };
  }) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { 
        ...habit, 
        name: habitData.name,
        category: habitData.category,
        icon: getIconForCategory(habitData.category),
        frequency: habitData.frequency || habit.frequency
      } : habit
    ));
    
    toast({
      title: "تم التعديل",
      description: "تم تعديل العادة بنجاح",
    });
  };
  
  // حذف عادة
  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
    
    toast({
      title: "تم الحذف",
      description: "تم حذف العادة بنجاح",
    });
  };
  


  return { 
    habits, 
    setHabits, 
    toggleHabitComplete, 
    addHabit,
    editHabit, 
    deleteHabit, 
    getIconForCategory,
    calculateDailyProgress
  };
}
