
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BadHabitsService, CreateBadHabitRequest } from '@/services/badHabitsService';
import { useToast } from './use-toast';
import { useNotifications } from '@/contexts/NotificationContext';

export function useBadHabits() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { sendNotification } = useNotifications();
  
  // Get bad habits from API
  const { data: badHabits = [], isLoading } = useQuery({
    queryKey: ['bad-habits'],
    queryFn: BadHabitsService.getBadHabits,
  });

  // Create bad habit mutation
  const addBadHabitMutation = useMutation({
    mutationFn: (habitData: CreateBadHabitRequest) => BadHabitsService.createBadHabit(habitData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bad-habits'] });
      toast({
        title: "تم الإضافة",
        description: "تمت إضافة العادة بنجاح. أنت تستطيع!"
      });
      
      // Send notification
      sendNotification({
        title: "عادة جديدة للتخلص منها",
        message: `تم إضافة العادة "${data.name}" لمساعدتك في التخلص منها`,
        type: "info",
        actionType: "habit"
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

  // Record occurrence mutation
  const recordOccurrenceMutation = useMutation({
    mutationFn: (id: string) => BadHabitsService.recordOccurrence(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bad-habits'] });
      toast({
        title: "أحسنت!",
        description: `يوم إضافي من النجاح في تجنب ${data.name}! استمر!`
      });
      
      // Send congratulatory notification for milestones
      if (data.dayCount % 7 === 0) { // Every week
        sendNotification({
          title: "إنجاز رائع!",
          message: `تهانينا! ${data.dayCount} يوم من تجنب ${data.name}`,
          type: "success",
          actionType: "habit"
        });
      }
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تسجيل اليوم",
        variant: "destructive"
      });
    }
  });

  // Update bad habit mutation
  const updateBadHabitMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBadHabitRequest> }) =>
      BadHabitsService.updateBadHabit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bad-habits'] });
      toast({
        title: "تم التحديث",
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

  // Delete bad habit mutation
  const deleteBadHabitMutation = useMutation({
    mutationFn: (id: string) => BadHabitsService.deleteBadHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bad-habits'] });
      toast({
        title: "تم الحذف",
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

  // Helper function to calculate progress percentage
  const calculateProgress = (dayCount: number, targetDays = 30) => {
    return Math.min(Math.round((dayCount / targetDays) * 100), 100);
  };

  return {
    badHabits,
    isLoading,
    addBadHabit: (habitData: CreateBadHabitRequest) => addBadHabitMutation.mutate(habitData),
    incrementDayCount: (id: string) => recordOccurrenceMutation.mutate(id),
    updateBadHabit: (id: string, data: Partial<CreateBadHabitRequest>) => 
      updateBadHabitMutation.mutate({ id, data }),
    deleteBadHabit: (id: string) => deleteBadHabitMutation.mutate(id),
    calculateProgress,
    isAdding: addBadHabitMutation.isPending,
    isUpdating: updateBadHabitMutation.isPending,
    isDeleting: deleteBadHabitMutation.isPending,
  };
}
