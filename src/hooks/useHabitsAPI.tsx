
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HabitService, CreateHabitRequest, UpdateHabitRequest } from "@/services/habitService";
import { useToast } from "./use-toast";

export function useHabitsAPI() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: habits = [], isLoading } = useQuery({
    queryKey: ["habits"],
    queryFn: HabitService.getHabits,
  });

  const createHabitMutation = useMutation({
    mutationFn: (habitData: CreateHabitRequest) => HabitService.createHabit(habitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      toast({
        title: "تم إنشاء العادة",
        description: "تمت إضافة العادة الجديدة بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إنشاء العادة",
        variant: "destructive",
      });
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: ({ id, habitData }: { id: string; habitData: UpdateHabitRequest }) =>
      HabitService.updateHabit(id, habitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث العادة بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحديث العادة",
        variant: "destructive",
      });
    },
  });

  const toggleHabitMutation = useMutation({
    mutationFn: (id: string) => HabitService.markHabitComplete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      toast({
        title: "أحسنت!",
        description: "تم تسجيل إنجاز العادة",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في تسجيل الإنجاز",
        variant: "destructive",
      });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: (id: string) => HabitService.deleteHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      toast({
        title: "تم الحذف",
        description: "تم حذف العادة بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في حذف العادة",
        variant: "destructive",
      });
    },
  });

  return {
    habits,
    isLoading,
    createHabit: createHabitMutation.mutate,
    updateHabit: updateHabitMutation.mutate,
    editHabit: updateHabitMutation.mutate,
    toggleHabit: toggleHabitMutation.mutate,
    deleteHabit: deleteHabitMutation.mutate,
    isCreating: createHabitMutation.isPending,
    isUpdating: updateHabitMutation.isPending,
    isDeleting: deleteHabitMutation.isPending,
  };
}
