
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from './button';
import { Label } from './label';
import { Input } from './input';
import { useState } from 'react';

const HABIT_CATEGORIES = [
  { id: 'learning', label: 'تعلم' },
  { id: 'health', label: 'صحة' },
  { id: 'productivity', label: 'إنتاجية' },
  { id: 'finance', label: 'مالي' },
  { id: 'social', label: 'اجتماعي' },
  { id: 'other', label: 'أخرى' },
];

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHabit: (habit: { title: string; category: string }) => void;
}

export function AddHabitDialog({ open, onOpenChange, onAddHabit }: AddHabitDialogProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('learning');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddHabit({ title, category });
      setTitle('');
      setCategory('learning');
      onOpenChange(false);
    }
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
