
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from './button';
import { Label } from './label';
import { Input } from './input';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { TimePicker } from './TimePicker';

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

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHabit: (habit: {
    name: string;
    category: string;
    frequency: {
      type: 'daily' | 'weekly' | 'monthly';
      time?: string;
      days?: number[];
      dayOfMonth?: number;
    };
  }) => void;
}
export function AddHabitDialog({ open, onOpenChange, onAddHabit }: AddHabitDialogProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('learning');
  const [frequencyType, setFrequencyType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      const habit = {
        name,
        category,
        frequency: {
          type: frequencyType,
          time: selectedTime,
          ...(frequencyType === 'weekly' && { days: selectedDays }),
          ...(frequencyType === 'monthly' && { dayOfMonth }),
        },
      };
      
      onAddHabit(habit);
      resetForm();
      onOpenChange(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setCategory('learning');
    setFrequencyType('daily');
    setSelectedTime('09:00');
    setSelectedDays([]);
    setDayOfMonth(1);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] text-right font-cairo">
        <DialogHeader>
          <DialogTitle className="text-right">إضافة عادة جديدة</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="habit-title" className="text-right block">اسم العادة</Label>
            <Input
              id="habit-title"
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
            <Select value={frequencyType} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setFrequencyType(value)}>
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
          
          {/* حقول إضافية حسب نوع التكرار */}
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
            >
              إضافة
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
