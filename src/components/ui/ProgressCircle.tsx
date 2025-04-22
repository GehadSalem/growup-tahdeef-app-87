
import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  circleColor?: string;
  progressColor?: string;
  textColor?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressCircle({
  percentage,
  size = 120,
  strokeWidth = 10,
  circleColor = "#E6F4EA",
  progressColor = "#219653",
  textColor = "#219653",
  showPercentage = true,
  className,
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={circleColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      
      {showPercentage && (
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-cairo font-bold" 
          style={{ color: textColor }}
        >
          {percentage}%
        </div>
      )}
    </div>
  );
}
