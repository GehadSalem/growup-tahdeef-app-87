
import { CheckCircle, Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface HabitCardProps {
  id: string;
  title: string;
  category: string;
  completed?: boolean;
  icon?: React.ReactNode;
  onComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function HabitCard({ 
  id, 
  title, 
  category, 
  completed = false, 
  icon, 
  onComplete,
  onEdit,
  onDelete
}: HabitCardProps) {
  const [isCompleted, setIsCompleted] = useState(completed);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
    if (onComplete) onComplete(id);
  };
  
  const handleDelete = () => {
    if (confirmDelete) {
      if (onDelete) onDelete(id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      // إعادة تعيين حالة التأكيد بعد 3 ثواني
      setTimeout(() => {
        setConfirmDelete(false);
      }, 3000);
    }
  };

  return (
    <div 
      className={cn(
        "relative flex items-center justify-between rounded-xl border p-4 transition-all",
        isCompleted 
          ? "border-growup/50 bg-growup/10" 
          : "border-gray-200 hover:border-growup/30 hover:bg-growup/5"
      )}
    >
      <div className="flex items-center gap-3">
        <div 
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-2xl",
            isCompleted ? "bg-growup/20 text-growup" : "bg-gray-100 text-gray-400"
          )}
        >
          {icon || <span>📝</span>}
        </div>
        
        <div>
          <h3 className={cn(
            "font-cairo font-semibold text-lg", 
            isCompleted && "text-growup line-through opacity-70"
          )}>
            {title}
          </h3>
          <span className="text-sm text-gray-500">{category}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={handleComplete}
          className={cn(
            "rounded-full p-1 transition-colors",
            isCompleted ? "text-growup hover:bg-growup/20" : "text-gray-400 hover:bg-gray-100 hover:text-growup"
          )}
          aria-label={isCompleted ? "علّم كغير مكتمل" : "علّم كمكتمل"}
        >
          <CheckCircle size={20} />
        </button>
        
        <button 
          onClick={() => onEdit && onEdit(id)}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-500 transition-colors"
          aria-label="تعديل العادة"
        >
          <Edit size={18} />
        </button>
        
        <button 
          onClick={handleDelete}
          className={cn(
            "rounded-full p-1 transition-colors",
            confirmDelete 
              ? "bg-red-100 text-red-500" 
              : "text-gray-400 hover:bg-gray-100 hover:text-red-500"
          )}
          aria-label={confirmDelete ? "اضغط للتأكيد" : "حذف العادة"}
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
}
