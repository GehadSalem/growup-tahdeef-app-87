
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };
  
  return (
    <div className={cn("flex items-center gap-2 font-cairo", className)}>
      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-growup-light rounded-full scale-150 opacity-30 animate-pulse-light" />
        <div className={cn("text-growup font-bold", sizeClasses[size])}>
          🌱
        </div>
      </div>
      <div className={cn("font-bold text-growup", sizeClasses[size])}>
        GrowUp
      </div>
    </div>
  );
}
