
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/ui/AppHeader";
import { HabitCard } from "@/components/ui/HabitCard";
import { ProgressCircle } from "@/components/ui/ProgressCircle";
import { WeeklyChart } from "@/components/stats/WeeklyChart";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddHabitDialog } from "@/components/ui/AddHabitDialog";
import { useToast } from "@/hooks/use-toast";

// Sample data for the weekly chart
const weeklyData = [
  { name: "الأحد", value: 70, label: "إنجاز اليوم" },
  { name: "الإثنين", value: 80, label: "إنجاز اليوم" },
  { name: "الثلاثاء", value: 60, label: "إنجاز اليوم" },
  { name: "الأربعاء", value: 90, label: "إنجاز اليوم" },
  { name: "الخميس", value: 75, label: "إنجاز اليوم" },
  { name: "الجمعة", value: 65, label: "إنجاز اليوم" },
  { name: "السبت", value: 85, label: "إنجاز اليوم" },
];

// Sample daily habits
const initialHabits = [
  { id: "1", title: "قرأت 10 صفحات من كتاب", category: "تعلم", completed: false, icon: "📚" },
  { id: "2", title: "استمعت لبودكاست", category: "تطوير", completed: false, icon: "🎧" },
  { id: "3", title: "ممارسة التأمل", category: "صحة", completed: true, icon: "🧘‍♂️" },
  { id: "4", title: "متابعة أخبار مهنية", category: "تطوير", completed: false, icon: "🌐" },
  { id: "5", title: "تواصل مع العائلة", category: "اجتماعي", completed: false, icon: "👨‍👩‍👧" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [habits, setHabits] = useState(initialHabits);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Calculate daily progress
  const completedHabits = habits.filter(habit => habit.completed).length;
  const dailyProgress = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;
  
  const handleHabitComplete = (id: string) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
    
    // Show toast when habit is completed
    const habit = habits.find(h => h.id === id);
    if (habit && !habit.completed) {
      toast({
        title: "أحسنت! 👏",
        description: `لقد أكملت "${habit.title}"`,
      });
    }
  };
  
  const handleAddHabit = (habit: { title: string; category: string }) => {
    const newHabit = {
      id: Date.now().toString(),
      title: habit.title,
      category: habit.category,
      completed: false,
      icon: getIconForCategory(habit.category),
    };
    
    setHabits([...habits, newHabit]);
    
    toast({
      title: "تمت الإضافة",
      description: "تم إضافة عادة جديدة بنجاح",
    });
  };
  
  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
    
    toast({
      title: "تم الحذف",
      description: "تم حذف العادة بنجاح",
    });
  };
  
  const getIconForCategory = (category: string) => {
    const icons: {[key: string]: string} = {
      'learning': '📚',
      'health': '🧘‍♂️',
      'productivity': '⏱️',
      'finance': '💰',
      'social': '👥',
      'other': '✨',
    };
    
    return icons[category] || '📝';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showMenu title="لوحة التحكم" onMenuClick={() => navigate('/menu')} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Progress Overview */}
        <section className="mb-8">
          <div className="section-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-cairo">تقدمك اليوم</h2>
              <div className="text-sm text-gray-500 font-cairo">
                {completedHabits}/{habits.length} مكتمل
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8">
              <ProgressCircle percentage={dailyProgress} />
              
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-lg font-bold font-cairo mb-2">تقدمك الأسبوعي</h3>
                <WeeklyChart data={weeklyData} />
              </div>
            </div>
            
            <div className="text-center mt-4">
              <p className="font-cairo text-growup-text">
                {dailyProgress < 30 
                  ? "يمكنك تحقيق المزيد اليوم!"
                  : dailyProgress < 70 
                    ? "أنت في الطريق الصحيح!"
                    : "أحسنت! أنت تقترب من إكمال أهدافك اليوم"}
              </p>
            </div>
          </div>
        </section>
        
        {/* Daily Habits */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-cairo">العادات اليومية</h2>
            <Button 
              onClick={() => setDialogOpen(true)}
              className="bg-growup hover:bg-growup-dark"
            >
              <Plus className="mr-0 ml-2 h-4 w-4" />
              إضافة عادة
            </Button>
          </div>
          
          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitCard 
                key={habit.id} 
                id={habit.id}
                title={habit.title} 
                category={habit.category}
                completed={habit.completed}
                icon={<span>{habit.icon}</span>}
                onComplete={handleHabitComplete}
                onDelete={handleDeleteHabit}
                onEdit={(id) => navigate(`/edit-habit/${id}`)}
              />
            ))}
          </div>
          
          {habits.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 mb-4 font-cairo">لم تقم بإضافة أي عادات بعد</p>
              <Button 
                onClick={() => setDialogOpen(true)}
                className="bg-growup hover:bg-growup-dark"
              >
                <Plus className="mr-0 ml-2 h-4 w-4" />
                إضافة عادة جديدة
              </Button>
            </div>
          )}
        </section>
        
        {/* Motivation Quote */}
        <section className="section-card card-gradient">
          <h3 className="text-lg font-cairo font-bold mb-2">اقتباس اليوم</h3>
          <p className="text-xl font-cairo text-gray-700">
            "صغير الجهد اليوم، كبير الأثر بكرة."
          </p>
        </section>
      </div>
      
      {/* Add Habit Dialog */}
      <AddHabitDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onAddHabit={handleAddHabit} 
      />
    </div>
  );
}
