
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
    toggleHabitComplete, 
    addHabit, 
    deleteHabit,
    editHabit,
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

  const handleAddHabit = async (habitData: { name: string; category: string; frequency: { type: "daily" | "weekly" | "monthly"; time?: string; days?: number[]; dayOfMonth?: number; } }) => {
    await addHabit(habitData);
    setShowAddDialog(false);
  };

  const handleEditHabit = async (updatedHabit: { name: string; category: string; frequency?: { type: "daily" | "weekly" | "monthly"; time?: string; days?: number[]; dayOfMonth?: number; } }) => {
    // This function signature matches what HabitsList expects
    console.log('Edit habit called with:', updatedHabit);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showMenu title="تطوير الذات" onMenuClick={() => navigate('/menu')} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2 font-cairo">عادات تطوير الذات</h1>
          <p className="text-gray-600 font-cairo">ابني عادات إيجابية لتطوير نفسك</p>
        </div>

        {/* Add Habit Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-growup hover:bg-growup-dark w-full"
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
          onAddHabit={handleAddHabit}
          onHabitEdit={handleEditHabit}
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
