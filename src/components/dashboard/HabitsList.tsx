
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HabitCard } from "@/components/ui/HabitCard";
import { AddHabitDialog } from "@/components/ui/AddHabitDialog";
import { EditHabitDialog } from "@/components/ui/EditHabitDialog";
import { Habit } from "@/lib/types";
import { getIconForCategory } from "@/lib/icons";

interface HabitsListProps {
  habits: Habit[];
  onHabitComplete: (id: string) => void;
  onHabitDelete: (id: string) => void;
  onHabitEdit?: (id: string, habit: { 
    name: string; 
    category: string;
    frequency?: {
      type: 'daily' | 'weekly' | 'monthly';
      time?: string;
      days?: number[];
      dayOfMonth?: number;
    };
  }) => void;
  onAddHabit: (habit: { 
    name: string; 
    category: string;
    frequency: {
      type: 'daily' | 'weekly' | 'monthly';
      time?: string;
      days?: number[];
      dayOfMonth?: number;
    };
  }) => void;
}

export function HabitsList({ 
  habits, 
  onHabitComplete, 
  onHabitDelete, 
  onHabitEdit, 
  onAddHabit 
}: HabitsListProps)  {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
  const handleOpenEditDialog = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
      console.log('Opening edit dialog for habit:', habit);
      setSelectedHabit(habit);
      setEditDialogOpen(true);
    }
  };
  
  const handleHabitComplete = async (id: string) => {
    console.log('HabitsList: Completing habit:', id);
    await onHabitComplete(id);
  };

  const handleHabitDelete = async (id: string) => {
    console.log('HabitsList: Deleting habit:', id);
    await onHabitDelete(id);
  };

  console.log('HabitsList: Rendering with habits:', habits);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-cairo">العادات اليومية</h2>
        <Button 
          onClick={() => setDialogOpen(true)}
          className="bg-growup hover:bg-growup-dark"
          aria-label="إضافة عادة جديدة"
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
            name={habit.name} 
            category={habit.category}
            completed={habit.completed}
            icon={getIconForCategory(habit.category)}
            streak={habit.streak}
            createdAt={habit.createdAt}
            updatedAt={habit.updatedAt}
            frequency={habit.frequency}
            onComplete={handleHabitComplete}
            onDelete={handleHabitDelete}
            onEdit={onHabitEdit ? () => handleOpenEditDialog(habit.id) : undefined}
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
      
      <AddHabitDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onAddHabit={onAddHabit} 
      />
      
      {selectedHabit && onHabitEdit && (
        <EditHabitDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onEditHabit={async (updatedHabit) => {
            console.log('Editing habit via dialog:', selectedHabit.id, updatedHabit);
            onHabitEdit(selectedHabit.id, updatedHabit);
          }}
          habit={selectedHabit}
        />
      )}
    </section>
  );
}
