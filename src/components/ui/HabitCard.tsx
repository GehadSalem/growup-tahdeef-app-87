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
  frequency,
  onComplete,
  onEdit,
  onDelete
}: HabitCardProps) {
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

   const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onComplete) return;
    
    try {
      setIsLoading(true);
      await onComplete(id);
      setIsCompleted(!isCompleted); // تحديث الحالة المحلية
    } catch (error) {
      console.error("Error marking habit complete:", error);
      setIsCompleted(isCompleted); // الرجوع للحالة الأصلية في حالة الخطأ
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(id);
  };
  
  const handleDelete = async (e: React.MouseEvent) => {
  e.stopPropagation();
  if (!onDelete) return;
  
  try {
    setIsLoading(true);
    await onDelete(id);
  } catch (error) {
    console.error("Error deleting habit:", error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div 
      className={cn(
        "relative flex items-center justify-between rounded-xl border p-4 transition-all",
        isCompleted 
          ? "border-growup/50 bg-growup/10" 
          : "border-gray-200 hover:border-growup/30 hover:bg-growup/5",
        isLoading && "opacity-70 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={cn(
  "flex h-10 w-10 items-center justify-center rounded-full text-2xl shrink-0",
  isCompleted ? "bg-growup/20 text-growup" : "bg-gray-100 text-gray-400"
)}>
  {getIconForCategory(category)}
</div>
        
        <div className="min-w-0">
          <h3 className={cn(
            "font-cairo font-semibold text-lg truncate", 
            isCompleted && "text-growup line-through opacity-70"
          )}>
            {name}
          </h3>
          <span className="text-sm text-gray-500 truncate">{category}</span>
          {frequency?.time && (
            <p className="text-xs text-gray-400 mt-1">
              {frequency.time}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={handleComplete}
          disabled={isLoading}
          className={cn(
            "rounded-full p-1 transition-colors",
            isCompleted ? "text-growup hover:bg-growup/20" : "text-gray-400 hover:bg-gray-100 hover:text-growup",
            isLoading && "opacity-50"
          )}
          aria-label={isCompleted ? "علّم كغير مكتمل" : "علّم كمكتمل"}
        >
          <CheckCircle size={20} />
        </button>
        
        <button 
          onClick={handleEdit}
          disabled={isLoading}
          className={cn(
            "rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-500 transition-colors",
            isLoading && "opacity-50"
          )}
          aria-label="تعديل العادة"
        >
          <Edit size={18} />
        </button>
        
        <button 
          onClick={handleDelete}
          disabled={isLoading}
          className={cn(
            "rounded-full p-1 transition-colors",
            showDeleteConfirm 
              ? "bg-red-100 text-red-500" 
              : "text-gray-400 hover:bg-gray-100 hover:text-red-500",
            isLoading && "opacity-50"
          )}
          aria-label={showDeleteConfirm ? "اضغط للتأكيد" : "حذف العادة"}
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
}