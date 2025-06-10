
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HabitService, Habit, CreateHabitRequest } from '@/services/habitService';
import { useToast } from './use-toast';
import { apiClient } from '@/lib/api.ts';

export const useHabitsAPI = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  // Get all habits
  const { data: habitsData = [], isLoading, error } = useQuery({
    queryKey: ['habits'],
    queryFn: HabitService.getHabits,
  });

  // Create habit mutation
  const createHabitMutation = useMutation({
    mutationFn: (habitData: CreateHabitRequest) => HabitService.createHabit(habitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: "تم إضافة العادة",
        description: "تمت إضافة العادة الجديدة بنجاح"
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة العادة",
        variant: "destructive"
      });
    }
  });

  // Toggle habit completion mutation
  const toggleHabitMutation = useMutation({
    mutationFn: (habitId: string) => HabitService.markHabitComplete(habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: "تم تحديث العادة",
        description: "تم تحديث حالة العادة بنجاح"
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تحديث العادة",
        variant: "destructive"
      });
    }
  });

  const editHabitMutation = useMutation({
  mutationFn: ({ id, habitData }: { id: string; habitData: Partial<CreateHabitRequest> }) => 
    HabitService.updateHabit(id, habitData),
  onSuccess: (updatedHabit) => {
    queryClient.invalidateQueries({ queryKey: ['habits'] });
    toast({
      title: "تم التعديل",
      description: "تم تعديل العادة بنجاح",
    });
  },
  onError: (error: any) => {
    toast({
      title: "خطأ",
      description: error?.response?.data?.message || "فشل في تعديل العادة",
      variant: "destructive",
    });
  }
});

  // Delete habit mutation
  const deleteHabitMutation = useMutation({
    mutationFn: (id: string) => HabitService.deleteHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: "تم الحذف",
        description: "تم حذف العادة بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error?.response?.data?.message || "فشل في حذف العادة",
        variant: "destructive",
      });
      console.error("Error deleting habit:", error);
    }
  });


  // Update habit mutation
  const updateHabitMutation = useMutation({
    mutationFn: ({ id, habitData }: { id: string; habitData: Partial<CreateHabitRequest> }) => 
      HabitService.updateHabit(id, habitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: "تم تحديث العادة",
        description: "تم تحديث العادة بنجاح"
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تحديث العادة",
        variant: "destructive"
      });
    }
  });

  // Calculate daily progress
  const calculateDailyProgress = () => {
    if (habitsData.length === 0) return 0;
    const completedHabits = habitsData.filter(habit => habit.completed).length;
    return Math.round((completedHabits / habitsData.length) * 100);
  };

  return {
    habits: habitsData,
    isLoading,
    error,
    addHabit: createHabitMutation.mutate,
    toggleHabitComplete: toggleHabitMutation.mutate,
    deleteHabit: deleteHabitMutation.mutate,
  editHabit: editHabitMutation.mutateAsync,    calculateDailyProgress,
    isCreating: createHabitMutation.isPending,
    isToggling: toggleHabitMutation.isPending,
    isDeleting: deleteHabitMutation.isPending,
    isEditing: updateHabitMutation.isPending,
  };
};
