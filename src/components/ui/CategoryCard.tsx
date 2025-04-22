
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function CategoryCard({ icon, label, isActive = false, onClick }: CategoryCardProps) {
  return (
    <div 
      className={cn("category-card", isActive && "active")}
      onClick={onClick}
    >
      <div className={cn("text-3xl", isActive ? "text-growup" : "text-gray-500")}>
        {icon}
      </div>
      <div className={cn("font-cairo font-medium", isActive ? "text-growup" : "text-gray-700")}>
        {label}
      </div>
    </div>
  );
}
