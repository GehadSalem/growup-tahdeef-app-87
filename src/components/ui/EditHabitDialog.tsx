
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from './button';
import { Label } from './label';
import { Input } from './input';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { TimePicker } from './TimePicker';
import { Habit } from '@/lib/types';

const HABIT_CATEGORIES = [
  { id: 'learning', label: 'تعلم' },
  { id: 'health', label: 'صحة' },
  { id: 'productivity', label: 'إنتاجية' },
  { id: 'finance', label: 'مالي' },
  { id: 'social', label: 'اجتماعي' },
  { id: 'other', label: 'أخرى' },
];

const FREQUENCY_TYPES = [
  { id: 'daily', label: 'يومي' },
  { id: 'weekly', label: 'أسبوعي' },
  { id: 'monthly', label: 'شهري' },
];

const DAYS_OF_WEEK = [
  { id: 0, label: 'الأحد' },
  { id: 1, label: 'الإثنين' },
  { id: 2, label: 'الثلاثاء' },
  { id: 3, label: 'الأربعاء' },
  { id: 4, label: 'الخميس' },
  { id: 5, label: 'الجمعة' },
  { id: 6, label: 'السبت' },
];

interface EditHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditHabit: (updatedHabit: {
    name: string;
    category: string;
    frequency?: {
      type: 'daily' | 'weekly' | 'monthly';
      time?: string;
      days?: number[];
      dayOfMonth?: number;
    };
  }) => Promise<void>; // Changed to return Promise
  habit: Habit;
}
export function EditHabitDialog({ open, onOpenChange, onEditHabit, habit }: EditHabitDialogProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(habit.category);
  const [frequencyType, setFrequencyType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // بتحديث القيم عندما يتغير العادة المرسلة للتعديل
  useEffect(() => {
    setName(habit.name);
    setCategory(habit.category);
    
    if (habit.frequency) {
      setFrequencyType(habit.frequency.type);
      if (habit.frequency.time) {
        setSelectedTime(habit.frequency.time);
      }
      if (habit.frequency.days) {
        setSelectedDays(habit.frequency.days);
      }
      if (habit.frequency.dayOfMonth) {
        setDayOfMonth(habit.frequency.dayOfMonth);
      }
    }
  }, [habit]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const updatedHabit = {
        name,
        category,
        ...(frequencyType && {
          frequency: {
            type: frequencyType,
            ...(selectedTime && { time: selectedTime }),
            ...(frequencyType === 'weekly' && { days: selectedDays }),
            ...(frequencyType === 'monthly' && { dayOfMonth }),
          }
        })
      };

      await onEditHabit(updatedHabit);
      onOpenChange(false);
    } catch (error) {
      console.error("Error editing habit:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] text-right font-cairo">
        <DialogHeader>
          <DialogTitle className="text-right">تعديل العادة</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="habit-name" className="text-right block">اسم العادة</Label>
            <Input
              id="habit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: قراءة 10 صفحات يومياً"
              className="input-field"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="habit-category" className="text-right block">الفئة</Label>
            <div className="grid grid-cols-3 gap-2">
              {HABIT_CATEGORIES.map((cat) => (
                <Button
                  key={cat.id}
                  type="button"
                  variant={category === cat.id ? "default" : "outline"}
                  onClick={() => setCategory(cat.id)}
                  className={`font-cairo ${category === cat.id ? "bg-growup hover:bg-growup-dark" : ""}`}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency-type" className="text-right block">نوع التكرار</Label>
            <Select 
              value={frequencyType} 
              onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setFrequencyType(value)}
            >
              <SelectTrigger id="frequency-type">
                <SelectValue placeholder="اختر نوع التكرار" />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCY_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {frequencyType === 'daily' && (
            <div className="space-y-2">
              <Label htmlFor="daily-time" className="text-right block">الوقت اليومي</Label>
              <TimePicker
                value={selectedTime}
                onChange={setSelectedTime}
              />
            </div>
          )}
          
          {frequencyType === 'weekly' && (
            <div className="space-y-2">
              <Label className="text-right block">أيام الأسبوع</Label>
              <div className="grid grid-cols-4 gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <Button
                    key={day.id}
                    type="button"
                    variant={selectedDays.includes(day.id) ? "default" : "outline"}
                    onClick={() => {
                      setSelectedDays(
                        selectedDays.includes(day.id)
                          ? selectedDays.filter(d => d !== day.id)
                          : [...selectedDays, day.id]
                      );
                    }}
                    className={`font-cairo ${
                      selectedDays.includes(day.id) ? "bg-growup hover:bg-growup-dark" : ""
                    }`}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
              
              <div className="mt-2">
                <Label htmlFor="weekly-time" className="text-right block">الوقت</Label>
                <TimePicker
                  value={selectedTime}
                  onChange={setSelectedTime}
                />
              </div>
            </div>
          )}
          
          {frequencyType === 'monthly' && (
            <div className="space-y-2">
              <Label htmlFor="day-of-month" className="text-right block">اليوم من الشهر</Label>
              <Input
                type="number"
                id="day-of-month"
                min={1}
                max={31}
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(Number(e.target.value))}
                className="input-field"
              />
              
              <div className="mt-2">
                <Label htmlFor="monthly-time" className="text-right block">الوقت</Label>
                <TimePicker
                  value={selectedTime}
                  onChange={setSelectedTime}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-row-reverse justify-between sm:justify-between">
            <Button 
              type="submit" 
              className="bg-growup hover:bg-growup-dark"
              disabled={isLoading}
            >
              {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
