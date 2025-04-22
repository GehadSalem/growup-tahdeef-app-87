
import { useState } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { HabitCard } from "@/components/ui/HabitCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddHabitDialog } from "@/components/ui/AddHabitDialog";
import { useToast } from "@/hooks/use-toast";

// Sample daily habits for self development
const initialHabits = [
  { id: "1", title: "قرأت 10 صفحات من كتاب", category: "قراءة", completed: false, icon: "📚" },
  { id: "2", title: "استمعت لبودكاست", category: "سمعي", completed: false, icon: "🎧" },
  { id: "3", title: "متابعة أخبار مهنية", category: "معرفة", completed: false, icon: "🌐" },
  { id: "4", title: "تعلم مهارة جديدة", category: "تعلم", completed: false, icon: "🎯" },
  { id: "5", title: "كتابة يوميات", category: "كتابة", completed: false, icon: "✏️" },
];

export default function SelfDevelopment() {
  const { toast } = useToast();
  const [habits, setHabits] = useState(initialHabits);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [points, setPoints] = useState(30);
  
  // Calculate progress
  const completedHabits = habits.filter(habit => habit.completed).length;
  
  const handleHabitComplete = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit && !habit.completed) {
      // Add points when completing a habit
      setPoints(points + 10);
      toast({
        title: "أحسنت! 👏",
        description: `حصلت على 10 نقاط إضافية!`,
      });
    }
    
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
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
      <AppHeader showBackButton title="تطوير الذات" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Points Card */}
        <section className="mb-6">
          <div className="bg-growup text-white rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-cairo">نقاطك اليوم</h2>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold">{points}</span>
                <span>👏</span>
              </div>
            </div>
            <p className="text-white/80 text-sm mt-1">استمر في إكمال العادات لزيادة نقاطك!</p>
          </div>
        </section>
        
        {/* Daily Development Habits */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-cairo">المهام اليومية</h2>
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
                onEdit={() => {}}
              />
            ))}
          </div>
        </section>
        
        {/* Development Tips */}
        <section className="section-card">
          <h3 className="text-lg font-cairo font-bold mb-3">نصائح للتطوير الذاتي</h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-growup/10 rounded-lg">
              <p className="font-cairo font-medium">اقرأ اليوم، تفوق بكرة.</p>
            </div>
            <div className="p-3 bg-growup/10 rounded-lg">
              <p className="font-cairo font-medium">كل بودكاست تسمعه، يبني وعيك أكثر.</p>
            </div>
            <div className="p-3 bg-growup/10 rounded-lg">
              <p className="font-cairo font-medium">التعلم عادة الناجحين، خلك منهم.</p>
            </div>
          </div>
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
