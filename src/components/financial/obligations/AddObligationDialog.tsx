
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface Obligation {
  id: string;
  name: string;
  amount: number;
  dueDate: number;
  category: string;
  isRecurring: boolean;
  isPaid?: boolean;
}

interface AddObligationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (obligation: Omit<Obligation, 'id'>) => void;
}

export function AddObligationDialog({ open, onOpenChange, onAdd }: AddObligationDialogProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [isRecurring, setIsRecurring] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name && amount && dueDate && category) {
      onAdd({
        name,
        amount: parseFloat(amount),
        dueDate: parseInt(dueDate),
        category,
        isRecurring,
      });
      
      // Reset form
      setName("");
      setAmount("");
      setDueDate("");
      setCategory("");
      setIsRecurring(true);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-cairo">إضافة التزام جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-cairo">اسم الالتزام</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: إيجار المنزل"
              dir="rtl"
              className="font-cairo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount" className="font-cairo">المبلغ</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              dir="rtl"
              className="font-cairo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="font-cairo">تاريخ الاستحقاق (يوم من الشهر)</Label>
            <Input
              id="dueDate"
              type="number"
              min="1"
              max="31"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="15"
              dir="rtl"
              className="font-cairo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="font-cairo">الفئة</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="font-cairo" dir="rtl">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="housing">سكن</SelectItem>
                <SelectItem value="utilities">مرافق</SelectItem>
                <SelectItem value="insurance">تأمين</SelectItem>
                <SelectItem value="loans">قروض</SelectItem>
                <SelectItem value="subscriptions">اشتراكات</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <input
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="recurring" className="font-cairo">التزام شهري متكرر</Label>
          </div>
          
          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="font-cairo">
              إلغاء
            </Button>
            <Button type="submit" className="bg-growup hover:bg-growup-dark font-cairo">
              إضافة
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
