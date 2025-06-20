
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DailyTaskService, CreateDailyTaskRequest } from '@/services/dailyTaskService';
import { useToast } from './use-toast';

export const useDailyTasks = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get daily tasks from API
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['daily-tasks'],
    queryFn: DailyTaskService.getTasks,
  });

  // Create daily task mutation
  const createTaskMutation = useMutation({
    mutationFn: (taskData: CreateDailyTaskRequest) => DailyTaskService.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-tasks'] });
      toast({
        title: "تم إنشاء المهمة",
        description: "تم إنشاء المهمة اليومية بنجاح"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إنشاء المهمة",
        variant: "destructive"
      });
    }
  });

  // Mark task complete mutation
  const markCompleteMutation = useMutation({
    mutationFn: (id: string) => DailyTaskService.markTaskComplete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-tasks'] });
      toast({
        title: "تم إكمال المهمة",
        description: "تم تحديث حالة المهمة بنجاح"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحديث المهمة",
        variant: "destructive"
      });
    }
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDailyTaskRequest> }) =>
      DailyTaskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-tasks'] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث المهمة بنجاح"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحديث المهمة",
        variant: "destructive"
      });
    }
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => DailyTaskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-tasks'] });
      toast({
        title: "تم الحذف",
        description: "تم حذف المهمة بنجاح"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في حذف المهمة",
        variant: "destructive"
      });
    }
  });

  return {
    tasks,
    isLoading,
    createTask: (taskData: CreateDailyTaskRequest) => createTaskMutation.mutate(taskData),
    markComplete: (id: string) => markCompleteMutation.mutate(id),
    updateTask: (id: string, data: Partial<CreateDailyTaskRequest>) => 
      updateTaskMutation.mutate({ id, data }),
    deleteTask: (id: string) => deleteTaskMutation.mutate(id),
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending || markCompleteMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
};
