
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, CheckCircle2, Clock, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DailyTaskService, CreateDailyTaskRequest } from "@/services/dailyTaskService";

export default function DailyTasks() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high"
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Get daily tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['dailyTasks'],
    queryFn: DailyTaskService.getTasks,
    enabled: isAuthenticated,
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: (taskData: CreateDailyTaskRequest) => DailyTaskService.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyTasks'] });
      toast({
        title: "تم إضافة المهمة",
        description: "تمت إضافة المهمة بنجاح"
      });
      setNewTask({ title: "", description: "", priority: "medium" });
      setShowAddForm(false);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة المهمة",
        variant: "destructive"
      });
    }
  });

  // Complete task mutation
  const completeTaskMutation = useMutation({
    mutationFn: (id: string) => DailyTaskService.markTaskComplete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyTasks'] });
      toast({
        title: "تم إنجاز المهمة",
        description: "تم تحديث حالة المهمة"
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تحديث المهمة",
        variant: "destructive"
      });
    }
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => DailyTaskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyTasks'] });
      toast({
        title: "تم حذف المهمة",
        description: "تم حذف المهمة بنجاح"
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حذف المهمة",
        variant: "destructive"
      });
    }
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عنوان المهمة",
        variant: "destructive"
      });
      return;
    }

    addTaskMutation.mutate({
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high": return "عالية";
      case "medium": return "متوسطة";
      case "low": return "منخفضة";
      default: return "غير محدد";
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl font-cairo text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <AppHeader showMenu title="المهام اليومية" onBackClick={() => navigate('/main-menu')} />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="mb-6 text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 font-cairo">مهامك اليومية</h1>
          <p className="text-sm sm:text-base text-gray-600 font-cairo">نظم مهامك وحقق إنتاجية أفضل</p>
        </div>

        {/* Add Task Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-growup hover:bg-growup-dark w-full text-sm sm:text-base py-2 sm:py-3"
          >
            <Plus className="ml-2 h-4 w-4" />
            إضافة مهمة جديدة
          </Button>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-lg sm:text-xl">إضافة مهمة جديدة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-right block font-cairo text-sm sm:text-base">عنوان المهمة</Label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="text-right text-sm sm:text-base"
                    placeholder="مثال: مراجعة التقارير الشهرية"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-right block font-cairo text-sm sm:text-base">الوصف (اختياري)</Label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="text-right text-sm sm:text-base"
                    placeholder="تفاصيل إضافية عن المهمة"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-right block font-cairo text-sm sm:text-base">الأولوية</Label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as "low" | "medium" | "high" })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                  </select>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="text-sm sm:text-base py-2 sm:py-3"
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleAddTask}
                    disabled={addTaskMutation.isPending}
                    className="bg-growup hover:bg-growup-dark text-sm sm:text-base py-2 sm:py-3"
                  >
                    {addTaskMutation.isPending ? "جاري الإضافة..." : "إضافة المهمة"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <div className="space-y-3 sm:space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className={`${task.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'} transition-all duration-200`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 text-right">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {getPriorityText(task.priority)}
                      </span>
                      <h3 className={`font-bold text-sm sm:text-base font-cairo ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h3>
                    </div>
                    {task.description && (
                      <p className={`text-xs sm:text-sm text-gray-600 font-cairo ${task.isCompleted ? 'line-through' : ''}`}>
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center justify-end gap-2 mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(task.createdAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={task.isCompleted ? "default" : "outline"}
                      onClick={() => completeTaskMutation.mutate(task.id)}
                      disabled={completeTaskMutation.isPending}
                      className={`text-xs sm:text-sm ${task.isCompleted ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    >
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {task.isCompleted ? "مكتملة" : "إنجاز"}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteTaskMutation.mutate(task.id)}
                      disabled={deleteTaskMutation.isPending}
                      className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 mb-4 font-cairo text-sm sm:text-base">لا توجد مهام بعد</p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-growup hover:bg-growup-dark text-sm sm:text-base py-2 sm:py-3"
              >
                <Plus className="mr-0 ml-2 h-4 w-4" />
                إضافة مهمة جديدة
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
