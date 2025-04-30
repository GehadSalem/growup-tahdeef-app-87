
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressCircle } from "@/components/ui/ProgressCircle";
import { BadHabit } from "@/lib/types";

interface BadHabitCardProps {
  habit: BadHabit;
  onIncrementDay: (id: string) => void;
  progressPercentage: number;
}

export function BadHabitCard({ habit, onIncrementDay, progressPercentage }: BadHabitCardProps) {
  return (
    <Card key={habit.id} className="border-2 border-growup/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-right font-cairo">{habit.name}</CardTitle>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-growup/10 text-growup font-medium">
            {habit.goal}
          </span>
        </div>
        <CardDescription className="text-right font-cairo">
          كم يوم صامد؟
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarClock className="text-growup h-5 w-5" />
            <div className="text-2xl font-bold font-cairo text-growup">
              {habit.dayCount} <span className="text-sm font-normal">أيام</span>
            </div>
          </div>
          
          <ProgressCircle 
            percentage={progressPercentage} 
            size={80} 
            strokeWidth={8} 
          />
        </div>
        
        <div className="mt-6 p-3 bg-growup/10 rounded-lg">
          <p className="font-cairo font-medium text-right">
            <span className="font-bold">البديل: </span>
            {habit.alternativeAction}
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <Button 
            className="bg-growup hover:bg-growup-dark" 
            onClick={() => onIncrementDay(habit.id)}
          >
            أضف يوم نجاح ✅
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-center text-growup-text font-cairo">
          "ما في عادة أقوى من إرادتك. انت قادر!"
        </p>
      </CardFooter>
    </Card>
  );
}
