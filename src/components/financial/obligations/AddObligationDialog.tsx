
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import type { Obligation, ObligationType, RecurrenceType } from "@/lib/types";

export interface NewObligationData {
  name: string;
  type: ObligationType;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  recurrence: RecurrenceType;
  notes: string;
}

interface AddObligationDialogProps {
  open: boolean;
  onClose: () => void;
  onAddObligation: (obligation: Omit<Obligation, 'id'>) => void;
}

export function AddObligationDialog({open, 
  onClose, 
  onAddObligation 
}: AddObligationDialogProps) {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [newObligation, setNewObligation] = useState<NewObligationData>({
    name: "",
    type: "قسط",
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    recurrence: "شهري",
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
      isPaid: false,
      enableNotifications: true,
    });
    
    setNewObligation({
      name: "",
      type: "قسط",
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      recurrence: "شهري",
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
              <option value="قسط">قسط</option>
              <option value="مناسبة">مناسبة</option>
              <option value="شراء">شراء</option>
              <option value="آخر">آخر</option>
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
              <option value="شهري">شهري</option>
              <option value="ربع سنوي">ربع سنوي</option>
              <option value="سنوي">سنوي</option>
              <option value="مرة واحدة">مرة واحدة</option>
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
