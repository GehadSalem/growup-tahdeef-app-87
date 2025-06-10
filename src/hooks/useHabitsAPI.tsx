
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HabitService, Habit, CreateHabitRequest } from '@/services/habitService';
import { useToast } from './use-toast';

export const useHabitsAPI = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all habits
  const { data: habits = [], isLoading, error } = useQuery({
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

  // Delete habit mutation
  const deleteHabitMutation = useMutation({
    mutationFn: (habitId: string) => HabitService.deleteHabit(habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: "تم حذف العادة",
        description: "تم حذف العادة بنجاح"
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حذف العادة",
        variant: "destructive"
      });
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
    if (habits.length === 0) return 0;
    const completedHabits = habits.filter(habit => habit.completed).length;
    return Math.round((completedHabits / habits.length) * 100);
  };

  return {
    habits,
    isLoading,
    error,
    addHabit: createHabitMutation.mutate,
    toggleHabitComplete: toggleHabitMutation.mutate,
    deleteHabit: deleteHabitMutation.mutate,
    updateHabit: updateHabitMutation.mutate,
    calculateDailyProgress,
    isCreating: createHabitMutation.isPending,
    isToggling: toggleHabitMutation.isPending,
    isDeleting: deleteHabitMutation.isPending,
    isUpdating: updateHabitMutation.isPending,
  };
};
