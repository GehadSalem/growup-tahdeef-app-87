
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CheckCircle, Clock, AlertCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DailyTaskService, CreateDailyTaskRequest, DailyTask } from "@/services/dailyTaskService";

export default function DailyTasks() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<CreateDailyTaskRequest>({
    title: '',
    description: '',
    priority: 'medium'
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

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: DailyTaskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyTasks'] });
      setNewTask({ title: '', description: '', priority: 'medium' });
      setShowAddForm(false);
      toast({
        title: "تمت الإضافة",
        description: "تم إنشاء المهمة بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء المهمة",
        variant: "destructive",
      });
    },
  });

  // Complete task mutation
  const completeTaskMutation = useMutation({
    mutationFn: DailyTaskService.markTaskComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyTasks'] });
      toast({
        title: "تم الإنجاز",
        description: "تم إنجاز المهمة بنجاح",
      });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: DailyTaskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyTasks'] });
      toast({
        title: "تم الحذف",
        description: "تم حذف المهمة بنجاح",
      });
    },
  });

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عنوان المهمة",
        variant: "destructive",
      });
      return;
    }
    createTaskMutation.mutate(newTask);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-cairo text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showMenu title="المهام اليومية" onMenuClick={() => navigate('/menu')} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Add New Task Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-growup hover:bg-growup-dark w-full"
          >
            <Plus className="ml-2 h-4 w-4" />
            إضافة مهمة جديدة
          </Button>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-right font-cairo">إضافة مهمة جديدة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-right block font-cairo">العنوان</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="أدخل عنوان المهمة"
                  className="text-right"
                />
              </div>
              
              <div>
                <Label className="text-right block font-cairo">الوصف (اختياري)</Label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="أدخل وصف المهمة"
                  className="text-right"
                />
              </div>

              <div>
                <Label className="text-right block font-cairo">الأولوية</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') => 
                    setNewTask({ ...newTask, priority: value })
                  }
                >
                  <SelectTrigger className="text-right">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">منخفضة</SelectItem>
                    <SelectItem value="medium">متوسطة</SelectItem>
                    <SelectItem value="high">عالية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateTask}
                  disabled={createTaskMutation.isPending}
                  className="flex-1 bg-growup hover:bg-growup-dark"
                >
                  {createTaskMutation.isPending ? "جاري الإضافة..." : "إضافة المهمة"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">لا توجد مهام</h3>
                <p className="text-gray-600">ابدأ بإضافة مهمة جديدة</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task: DailyTask) => (
              <Card key={task.id} className={task.completed ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getPriorityIcon(task.priority)}
                        <h3 className={`font-bold ${task.completed ? "line-through" : ""}`}>
                          {task.title}
                        </h3>
                      </div>
                      {task.description && (
                        <p className="text-gray-600 text-sm">{task.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!task.completed && (
                        <Button
                          size="sm"
                          onClick={() => completeTaskMutation.mutate(task.id)}
                          disabled={completeTaskMutation.isPending}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteTaskMutation.mutate(task.id)}
                        disabled={deleteTaskMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
