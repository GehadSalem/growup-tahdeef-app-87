
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HabitCard } from "@/components/ui/HabitCard";
import { AddHabitDialog } from "@/components/ui/AddHabitDialog";
import { Habit } from "@/lib/types";

interface HabitsListProps {
  habits: Habit[];
  onHabitComplete: (id: string) => void;
  onHabitDelete: (id: string) => void;
  onAddHabit: (habit: { 
    title: string; 
    category: string;
    frequency: {
      type: 'daily' | 'weekly' | 'monthly';
      time?: string;
      days?: number[];
      dayOfMonth?: number;
    };
  }) => void;
}

export function HabitsList({ habits, onHabitComplete, onHabitDelete, onAddHabit }: HabitsListProps) {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  
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
            title={habit.title} 
            category={habit.category}
            completed={habit.completed}
            icon={<span>{habit.icon}</span>}
            onComplete={onHabitComplete}
            onDelete={onHabitDelete}
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
      
      <AddHabitDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onAddHabit={onAddHabit} 
      />
    </section>
  );
}
