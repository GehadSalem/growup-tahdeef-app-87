
import { useState } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useBadHabits } from "@/hooks/useBadHabits";
import { BadHabitForm } from "@/components/bad-habits/BadHabitForm";
import { BadHabitCard } from "@/components/bad-habits/BadHabitCard";
import { MotivationalTips } from "@/components/bad-habits/MotivationalTips";
import { useNavigate } from "react-router-dom";

export default function BreakHabits() {
  const { badHabits, addBadHabit, incrementDayCount, calculateProgress } = useBadHabits();
  const [showAddForm, setShowAddForm] = useState(false);
    const navigate = useNavigate();
  
  const handleAddHabit = (habit: { name: string; goal: string; alternativeAction: string }) => {
    const result = addBadHabit(habit);
    if (result) {
      setShowAddForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <AppHeader showMenu title="كسر العادات السيئة" onMenuClick={() => navigate('/main-menu')} />
      <div className="container mx-auto py-6">
        {/* قسم العنوان */}
        <section className="mb-6">
          <div className="bg-white rounded-xl p-6 shadow-md text-center border border-gray-100">
            <h2 className="text-xl font-bold font-cairo mb-2">مسار التغيير</h2>
            <p className="text-gray-600 mb-4 font-cairo">كل يوم تصمد فيه هو انتصار على نفسك</p>
            <div className="flex justify-center">
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center justify-center gap-2 text-growup font-bold hover:bg-growup/5 rounded-lg px-4 py-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>إضافة عادة للتخلص منها</span>
              </button>
            </div>
          </div>
        </section>
        
        {/* نموذج إضافة عادة سيئة */}
        {showAddForm && (
          <section className="mb-6">
            <BadHabitForm 
              onAddHabit={handleAddHabit}
              onCancel={() => setShowAddForm(false)}
            />
          </section>
        )}
        
        {/* قائمة العادات السيئة */}
        <section className="space-y-6">
          {badHabits.map(habit => (
            <BadHabitCard
              key={habit.id}
              habit={habit}
              onIncrementDay={incrementDayCount}
              progressPercentage={calculateProgress(habit.dayCount)}
            />
          ))}
          
          {badHabits.length === 0 && !showAddForm && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 mb-4 font-cairo">لم تقم بإضافة أي عادات بعد</p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-growup hover:bg-growup-dark"
              >
                <Plus className="mr-0 ml-2 h-4 w-4" />
                إضافة عادة للتخلص منها
              </Button>
            </div>
          )}
        </section>
        
        {/* قسم النصائح التحفيزية */}
        <section className="mt-8">
          <MotivationalTips />
        </section>
      </div>
    </div>
  );
}
