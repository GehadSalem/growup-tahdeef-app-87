
import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import { Habit } from "@/lib/types";
import { SAMPLE_HABITS } from "@/lib/constants";

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
        description: `لقد أكملت "${habit.title}"`,
      });
    }
  };
  
  // إضافة عادة جديدة
  const addHabit = (habitData: { 
    title: string; 
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
      title: habitData.title,
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
    title: string; 
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
        title: habitData.title,
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
  
  // الحصول على أيقونة مناسبة للفئة
  const getIconForCategory = (category: string) => {
    const icons: {[key: string]: string} = {
      'learning': '📚',
      'health': '🧘‍♂️',
      'productivity': '⏱️',
      'finance': '💰',
      'social': '👥',
      'other': '✨',
      'تعلم': '📚',
      'صحة': '🧘‍♂️',
      'إنتاجية': '⏱️',
      'مالي': '💰',
      'اجتماعي': '👥',
      'أخرى': '✨',
    };
    
    return icons[category] || '📝';
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
