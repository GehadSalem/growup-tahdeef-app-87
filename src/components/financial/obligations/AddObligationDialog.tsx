
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// تعريف أنواع الالتزامات
export type ObligationType = "loan" | "subscription" | "purchase" | "other";
export type RecurrenceType = "monthly" | "quarterly" | "yearly" | "one-time";

// تعريف واجهة الالتزام
export interface Obligation {
  id: string;
  name: string;
  type: ObligationType;
  amount: number;
  dueDate: string;
  recurrence: RecurrenceType;
  notes?: string;
  isPaid: boolean;
  enableNotifications?: boolean;
}

// واجهة الالتزام
type NewObligationData = Omit<Obligation, "id" | "isPaid" | "enableNotifications">;

interface AddObligationDialogProps {
  onAddObligation: (obligation: Obligation) => void;
}

export function AddObligationDialog({ onAddObligation }: AddObligationDialogProps) {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [newObligation, setNewObligation] = useState<NewObligationData>({
    name: "",
    type: "loan",
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    recurrence: "monthly",
    notes: "",
  });

  const handleAddObligation = () => {
    if (newObligation.name.trim() === "") {
      toast({
        title: "خطأ",
        description: "يجب إدخال اسم الالتزام",
        variant: "destructive",
      });
      return;
    }

    if (newObligation.amount <= 0) {
      toast({
        title: "خطأ",
        description: "يجب إدخال مبلغ صحيح",
        variant: "destructive",
      });
      return;
    }

    const newId = `obligation-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    onAddObligation({
      ...newObligation,
      id: newId,
      isPaid: false,
    });
    
    setNewObligation({
      name: "",
      type: "loan",
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      recurrence: "monthly",
      notes: "",
    });
    
    setShowDialog(false);
    
    toast({
      title: "تم الإضافة",
      description: "تم إضافة الالتزام الجديد بنجاح",
    });
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button className="bg-growup hover:bg-growup-dark">
          <Plus className="mr-0 ml-2 h-4 w-4" />
          إضافة التزام جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right">إضافة التزام جديد</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-right block">الاسم</Label>
            <Input 
              className="text-right" 
              placeholder="مثال: قسط سيارة" 
              value={newObligation.name}
              onChange={e => setNewObligation({...newObligation, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-right block">نوع الالتزام</Label>
            <select 
              className="w-full p-2 border rounded text-right" 
              value={newObligation.type}
              onChange={e => setNewObligation({...newObligation, type: e.target.value as ObligationType})}
            >
              <option value="loan">قسط</option>
              <option value="subscription">مناسبة</option>
              <option value="purchase">شراء</option>
              <option value="other">آخر</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-right block">المبلغ (ريال)</Label>
            <Input 
              type="number" 
              className="text-right" 
              placeholder="مثال: 3000" 
              value={newObligation.amount || ''}
              onChange={e => setNewObligation({...newObligation, amount: Number(e.target.value)})}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-right block">تاريخ الاستحقاق</Label>
            <Input 
              type="date" 
              className="text-right" 
              value={newObligation.dueDate}
              onChange={e => setNewObligation({...newObligation, dueDate: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-right block">تكرار الالتزام</Label>
            <select 
              className="w-full p-2 border rounded text-right" 
              value={newObligation.recurrence}
              onChange={e => setNewObligation({...newObligation, recurrence: e.target.value as RecurrenceType})}
            >
              <option value="monthly">شهري</option>
              <option value="quarterly">ربع سنوي</option>
              <option value="yearly">سنوي</option>
              <option value="one-time">مرة واحدة</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-right block">ملاحظة إضافية (اختياري)</Label>
            <Textarea 
              className="text-right" 
              placeholder="أضف أي ملاحظات إضافية هنا" 
              value={newObligation.notes}
              onChange={e => setNewObligation({...newObligation, notes: e.target.value})}
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-growup hover:bg-growup-dark"
              onClick={handleAddObligation}
            >
              إضافة
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
