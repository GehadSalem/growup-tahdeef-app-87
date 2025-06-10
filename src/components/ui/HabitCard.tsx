
import { CheckCircle, Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { getIconForCategory } from "@/lib/icons";

interface HabitCardProps {
  id: string;
  name: string;
  category: string;
  completed?: boolean;
  icon?: React.ReactNode;
  streak?: number;
  createdAt?: string;
  updatedAt?: string;
  frequency?: {
    type: 'daily' | 'weekly' | 'monthly';
    time?: string;
    days?: number[];
    dayOfMonth?: number;
  };
  onComplete?: (id: string) => Promise<void>;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
}

export function HabitCard({ 
  id, 
  name, 
  category, 
  completed = false, 
  icon, 
  streak = 0,
  createdAt,
  updatedAt,
  frequency,
  onComplete,
  onEdit,
  onDelete
}: HabitCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onComplete || isCompleting) return;
    
    try {
      setIsCompleting(true);
      console.log('HabitCard: Completing habit:', id);
      await onComplete(id);
      console.log('HabitCard: Habit completed successfully');
    } catch (error) {
      console.error("HabitCard: Error completing habit:", error);
    } finally {
      setIsCompleting(false);
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      console.log('HabitCard: Editing habit:', id);
      onEdit(id);
    }
  };
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete || isDeleting) return;
    
    try {
      setIsDeleting(true);
      console.log('HabitCard: Deleting habit:', id);
      await onDelete(id);
      console.log('HabitCard: Habit deleted successfully');
    } catch (error) {
      console.error("HabitCard: Error deleting habit:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('ar-SA');
    } catch {
      return dateString;
    }
  };

  return (
    <div 
      className={cn(
        "relative flex items-center justify-between rounded-xl border p-4 transition-all",
        completed 
          ? "border-growup/50 bg-growup/10" 
          : "border-gray-200 hover:border-growup/30 hover:bg-growup/5",
        (isCompleting || isDeleting) && "opacity-70 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full text-2xl shrink-0",
          completed ? "bg-growup/20 text-growup" : "bg-gray-100 text-gray-400"
        )}>
          {getIconForCategory(category)}
        </div>
        
        <div className="min-w-0 flex-1">
          <h3 className={cn(
            "font-cairo font-semibold text-lg truncate", 
            completed && "text-growup line-through opacity-70"
          )}>
            {name}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="truncate">{category}</span>
            {streak > 0 && (
              <>
                <span>•</span>
                <span className="text-growup font-medium">🔥 {streak} أيام</span>
              </>
            )}
          </div>
          
          {frequency?.time && (
            <p className="text-xs text-gray-400 mt-1">
              {frequency.time}
            </p>
          )}
          
          {(createdAt || updatedAt) && (
            <div className="text-xs text-gray-400 mt-1">
              {createdAt && <span>إنشاء: {formatDate(createdAt)}</span>}
              {updatedAt && createdAt !== updatedAt && (
                <span> • تحديث: {formatDate(updatedAt)}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={handleComplete}
          disabled={isCompleting || isDeleting}
          className={cn(
            "rounded-full p-1 transition-colors",
            completed ? "text-growup hover:bg-growup/20" : "text-gray-400 hover:bg-gray-100 hover:text-growup",
            (isCompleting || isDeleting) && "opacity-50"
          )}
          aria-label={completed ? "علّم كغير مكتمل" : "علّم كمكتمل"}
        >
          <CheckCircle size={20} />
        </button>
        
        <button 
          onClick={handleEdit}
          disabled={isCompleting || isDeleting}
          className={cn(
            "rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-500 transition-colors",
            (isCompleting || isDeleting) && "opacity-50"
          )}
          aria-label="تعديل العادة"
        >
          <Edit size={18} />
        </button>
        
        <button 
          onClick={handleDelete}
          disabled={isCompleting || isDeleting}
          className={cn(
            "rounded-full p-1 transition-colors text-gray-400 hover:bg-gray-100 hover:text-red-500",
            (isCompleting || isDeleting) && "opacity-50"
          )}
          aria-label="حذف العادة"
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
}
