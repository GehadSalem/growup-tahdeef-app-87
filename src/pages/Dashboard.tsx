
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/ui/AppHeader";
import { useHabits } from "@/hooks/useHabits";
import { DailyProgressSection } from "@/components/dashboard/DailyProgressSection";
import { HabitsList } from "@/components/dashboard/HabitsList";
import { QuoteSection } from "@/components/dashboard/QuoteSection";

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    habits, 
    toggleHabitComplete, 
    addHabit, 
    deleteHabit,
    calculateDailyProgress
  } = useHabits();
  
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
        />
        
        {/* اقتباس تحفيزي */}
        <QuoteSection />
      </div>
    </div>
  );
}
