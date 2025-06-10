
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/ui/AppHeader";
import { useHabitsAPI } from "@/hooks/useHabitsAPI";
import { DailyProgressSection } from "@/components/dashboard/DailyProgressSection";
import { HabitsList } from "@/components/dashboard/HabitsList";
import { QuoteSection } from "@/components/dashboard/QuoteSection";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    habits, 
    toggleHabitComplete, 
    addHabit, 
    deleteHabit,
    editHabit,
    calculateDailyProgress,
    isLoading
  } = useHabitsAPI();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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
  
  // حساب عدد العادات المكتملة
  const completedHabits = habits.filter(habit => habit.completed).length;
  // حساب نسبة التقدم اليومي
  const dailyProgress = calculateDailyProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showMenu title="لوحة التحكم" onMenuClick={() => navigate('/menu')} />
      
      <div className="container mx-auto px-4 py-6">
        {/* قسم تقدم الإنجاز اليومي */}
        <DailyProgressSection 
          completedHabits={completedHabits} 
          totalHabits={habits.length} 
          dailyProgress={dailyProgress} 
        />
        
        {/* قائمة العادات اليومية */}
        <HabitsList 
          habits={habits}
          onHabitComplete={toggleHabitComplete}
          onHabitDelete={deleteHabit}
          onAddHabit={addHabit}
          onHabitEdit={(id, habitData) => {
            editHabit({ id, habitData });
          }}
        />
        
        {/* اقتباس تحفيزي */}
        <QuoteSection />
      </div>
    </div>
  );
}
