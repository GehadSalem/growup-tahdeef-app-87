
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HabitService, Habit, CreateHabitRequest } from '@/services/habitService';
import { useToast } from './use-toast';

export const useHabitsAPI = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all habits
  const { data: habitsData = [], isLoading, error } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      console.log('Fetching habits via useQuery...');
      const habits = await HabitService.getHabits();
      console.log('Habits fetched via useQuery:', habits);
      return habits;
    },
  });

  // Create habit mutation
  const createHabitMutation = useMutation({
    mutationFn: async (habitData: CreateHabitRequest) => {
      console.log('Creating habit mutation:', habitData);
      return await HabitService.addHabit(habitData);
    },
    onSuccess: (newHabit) => {
      console.log('Habit created successfully:', newHabit);
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: "تم إضافة العادة",
        description: "تمت إضافة العادة الجديدة بنجاح"
      });
    },
    onError: (error: any) => {
      console.error('Error creating habit:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة العادة",
        variant: "destructive"
      });
    }
  });

  // Toggle habit completion mutation
  const toggleHabitMutation = useMutation({
    mutationFn: async (habitId: string) => {
      console.log('Toggling habit completion:', habitId);
      return await HabitService.markHabitComplete(habitId);
    },
    onSuccess: (updatedHabit) => {
      console.log('Habit completion toggled successfully:', updatedHabit);
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: "تم تحديث العادة",
        description: "تم تحديث حالة العادة بنجاح"
      });
    },
    onError: (error: any) => {
      console.error('Error toggling habit:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث العادة",
        variant: "destructive"
      });
    }
  });

  // Edit habit mutation
  const editHabitMutation = useMutation({
    mutationFn: async ({ id, habitData }: { id: string; habitData: Partial<CreateHabitRequest> }) => {
      console.log('Editing habit:', id, habitData);
      return await HabitService.updateHabit(id, habitData);
    },
    onSuccess: (updatedHabit) => {
      console.log('Habit edited successfully:', updatedHabit);
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: "تم التعديل",
        description: "تم تعديل العادة بنجاح",
      });
    },
    onError: (error: any) => {
      console.error('Error editing habit:', error);
      toast({
        title: "خطأ",
        description: error?.response?.data?.message || "فشل في تعديل العادة",
        variant: "destructive",
      });
    }
  });

  // Delete habit mutation
  const deleteHabitMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting habit:', id);
      await HabitService.deleteHabit(id);
      return id;
    },
    onSuccess: (deletedId) => {
      console.log('Habit deleted successfully:', deletedId);
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: "تم الحذف",
        description: "تم حذف العادة بنجاح",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting habit:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف العادة",
        variant: "destructive",
      });
    }
  });

  return {
    habits: habitsData,
    isLoading,
    error,
    createHabit: createHabitMutation.mutate,
    toggleHabit: toggleHabitMutation.mutate,
    editHabit: editHabitMutation.mutate,
    deleteHabit: deleteHabitMutation.mutate,
    isCreating: createHabitMutation.isPending,
    isToggling: toggleHabitMutation.isPending,
    isEditing: editHabitMutation.isPending,
    isDeleting: deleteHabitMutation.isPending,
  };
};
