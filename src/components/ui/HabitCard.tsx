
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

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
    if (onComplete) onComplete(id);
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
        >
          <CheckCircle size={20} />
        </button>
        
        <button 
          onClick={() => onEdit && onEdit(id)}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-500 transition-colors"
        >
          <Edit size={18} />
        </button>
        
        <button 
          onClick={() => onDelete && onDelete(id)}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors"
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
}
