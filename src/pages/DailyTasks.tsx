import { useState, useEffect } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, CheckCircle, Circle } from "lucide-react";
import { DailyTaskService, CreateDailyTaskRequest } from "@/services/dailyTaskService";
import { DailyTask } from "@/lib/types";
import { DailyTaskForm } from "@/components/daily-tasks/DailyTaskForm";
import { useNavigate } from "react-router-dom";

export default function DailyTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await DailyTaskService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (task: CreateDailyTaskRequest) => {
    try {
      const newTask = await DailyTaskService.createTask(task);
      setTasks(prevTasks => [...prevTasks, newTask]);
      setShowAddTaskForm(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateTask = async (id: string, updatedTask: Partial<DailyTask>) => {
    try {
      const updated = await DailyTaskService.updateTask(id, updatedTask);
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === id ? { ...task, ...updated } : task))
      );
      setIsEditing(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const markTaskComplete = async (id: string) => {
    try {
      await DailyTaskService.markTaskComplete(id);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, isCompleted: true } : task
        )
      );
    } catch (error) {
      console.error("Error marking task as complete:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await DailyTaskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditClick = (task: DailyTask) => {
    setSelectedTask(task);
    setIsEditing(true);
    setShowAddTaskForm(true);
  };

  const completedTasks = tasks.filter(task => task.isCompleted);
  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const overdueTasks = tasks.filter(task => 
    !task.isCompleted && new Date(task.dueDate) < new Date()
  );

  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate).toDateString();
    const today = new Date().toDateString();
    return taskDate === today;
  });

  const completedTodayTasks = todayTasks.filter(task => task.isCompleted);

  const toggleTaskCompletion = async (taskId: string, currentStatus: boolean) => {
    if (currentStatus) {
      // Task is currently completed, we need to mark it as incomplete
      // This might require a separate API endpoint or updating the task
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await updateTask(taskId, { ...task, isCompleted: false });
      }
    } else {
      await markTaskComplete(taskId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <AppHeader
        showMenu
        title="المهام اليومية"
        onBackClick={() => navigate("/main-menu")}
      />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Add Task Section */}
        <section className="mb-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md text-center border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold font-cairo mb-2">
              إدارة المهام اليومية
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 font-cairo">
              خطط ليومك بكفاءة
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowAddTaskForm(!showAddTaskForm);
                  setSelectedTask(null);
                  setIsEditing(false);
                }}
                className="flex items-center justify-center gap-2 text-growup font-bold hover:bg-growup/5 rounded-lg px-3 sm:px-4 py-2 transition-colors text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>إضافة مهمة جديدة</span>
              </button>
            </div>
          </div>
        </section>

        {/* Add/Edit Task Form */}
        {showAddTaskForm && (
          <section className="mb-6">
            <DailyTaskForm
              onSubmit={addTask}
              onUpdate={updateTask}
              onCancel={() => {
                setShowAddTaskForm(false);
                setSelectedTask(null);
                setIsEditing(false);
              }}
              task={selectedTask}
              isEditing={isEditing}
            />
          </section>
        )}

        {/* Task Lists */}
        {isLoading ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-4 font-cairo text-sm sm:text-base">جاري التحميل...</p>
          </div>
        ) : (
          <>
            {/* Today's Tasks */}
            <section className="space-y-4 sm:space-y-6">
              <h3 className="text-lg font-bold font-cairo">مهام اليوم</h3>
              {todayTasks.length > 0 ? (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleTaskCompletion(task.id, task.isCompleted)}
                        className="mr-4"
                      >
                        {task.isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400" />
                        )}
                      </button>
                      <div>
                        <h4
                          className={`font-bold font-cairo ${
                            task.isCompleted ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {task.title}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {new Date(task.dueDate).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditClick(task)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 font-cairo text-sm">لا توجد مهام محددة لهذا اليوم</p>
                </div>
              )}
            </section>

            {/* Pending Tasks */}
            <section className="space-y-4 sm:space-y-6">
              <h3 className="text-lg font-bold font-cairo">المهام المعلقة</h3>
              {pendingTasks.length > 0 ? (
                pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleTaskCompletion(task.id, task.isCompleted)}
                        className="mr-4"
                      >
                        {task.isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400" />
                        )}
                      </button>
                      <div>
                        <h4
                          className={`font-bold font-cairo ${
                            task.isCompleted ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {task.title}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {new Date(task.dueDate).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditClick(task)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 font-cairo text-sm">لا توجد مهام معلقة</p>
                </div>
              )}
            </section>

            {/* Completed Tasks */}
            <section className="space-y-4 sm:space-y-6">
              <h3 className="text-lg font-bold font-cairo">المهام المكتملة</h3>
              {completedTasks.length > 0 ? (
                completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleTaskCompletion(task.id, task.isCompleted)}
                        className="mr-4"
                      >
                        {task.isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400" />
                        )}
                      </button>
                      <div>
                        <h4
                          className={`font-bold font-cairo ${
                            task.isCompleted ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {task.title}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {new Date(task.dueDate).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditClick(task)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 font-cairo text-sm">لا توجد مهام مكتملة</p>
                </div>
              )}
            </section>

            {/* Overdue Tasks */}
            <section className="space-y-4 sm:space-y-6">
              <h3 className="text-lg font-bold font-cairo">المهام المتأخرة</h3>
              {overdueTasks.length > 0 ? (
                overdueTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleTaskCompletion(task.id, task.isCompleted)}
                        className="mr-4"
                      >
                        {task.isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400" />
                        )}
                      </button>
                      <div>
                        <h4
                          className={`font-bold font-cairo ${
                            task.isCompleted ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {task.title}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {new Date(task.dueDate).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditClick(task)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 font-cairo text-sm">لا توجد مهام متأخرة</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
