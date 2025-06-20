
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/ui/AppHeader";
import { useHabitsAPI } from "@/hooks/useHabitsAPI";
import { HabitsList } from "@/components/dashboard/HabitsList";
import { AddHabitDialog } from "@/components/ui/AddHabitDialog";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SelfDevelopment() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const { 
    habits, 
    toggleHabit: toggleHabitComplete, 
    createHabit: addHabit, 
    deleteHabit,
    editHabit,
    isLoading
  } : any = useHabitsAPI();
  
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
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl font-cairo text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const handleAddHabit = async (habitData: { name: string; category: string; frequency: { type: "daily" | "weekly" | "monthly"; time?: string; days?: number[]; dayOfMonth?: number; } }) => {
    await addHabit(habitData);
    setShowAddDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <AppHeader showMenu title="تطوير الذات" onBackClick={() => navigate('/main-menu')} />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="mb-6 text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 font-cairo">عادات تطوير الذات</h1>
          <p className="text-sm sm:text-base text-gray-600 font-cairo">ابني عادات إيجابية لتطوير نفسك</p>
        </div>

        {/* Add Habit Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-growup hover:bg-growup-dark w-full text-sm sm:text-base py-2 sm:py-3"
          >
            <Plus className="ml-2 h-4 w-4" />
            إضافة عادة جديدة
          </Button>
        </div>
        
        {/* Habits List */}
        <HabitsList 
          habits={habits}
          onHabitComplete={toggleHabitComplete}
          onHabitDelete={deleteHabit}
          onAddHabit={addHabit}
          onHabitEdit={async (id, habitData) => {
            await editHabit({ id, habitData });
          }}
        />

        {/* Add Habit Dialog */}
        <AddHabitDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAddHabit={handleAddHabit}
        />
      </div>
    </div>
  );
}
