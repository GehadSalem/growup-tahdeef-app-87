import { format, addMonths, isBefore } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Obligation } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface ObligationsListProps {
  obligations: Obligation[];
  onUpdate: (id: string, updatedData: Partial<Obligation>) => void;
  onDelete: (id: string) => void;
  togglePaymentStatus: (id: string) => void;
}

export function ObligationsList({ obligations, onUpdate, onDelete, togglePaymentStatus }: ObligationsListProps) {
  const { toast } = useToast();

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "d MMMM yyyy", { locale: ar });
    } catch (error) {
      return dateString;
    }
  };

  const getNextPaymentDate = (dueDate: string, recurrence?: string): string => {
    try {
      const date = new Date(dueDate);
      const today = new Date();
      let nextDate = new Date(date);

      if (isBefore(nextDate, today)) {
        switch (recurrence) {
          case "شهري":
            while (isBefore(nextDate, today)) {
              nextDate = addMonths(nextDate, 1);
            }
            break;
          case "ربع سنوي":
            while (isBefore(nextDate, today)) {
              nextDate = addMonths(nextDate, 3);
            }
            break;
          case "سنوي":
            while (isBefore(nextDate, today)) {
              nextDate = addMonths(nextDate, 12);
            }
            break;
          default:
            break;
        }
      }

      return format(nextDate, "yyyy-MM-dd");
    } catch (error) {
      return dueDate;
    }
  };

  const handleTogglePayment = async (id: string) => {
    try {
      const obligation = obligations.find(o => o.id === id);
      if (!obligation) return;

      const newStatus = !obligation.isPaid;

      await apiClient.patch(`/custom-installment-plans/${id}`, {
        status: newStatus ? "paid" : "unpaid"
      });

      onUpdate(id, { isPaid: newStatus });

      toast({
        title: "تم التحديث",
        description: `تم ${newStatus ? "تمييز" : "إلغاء تمييز"} الالتزام على أنه مدفوع`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الدفع",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/custom-installment-plans/${id}`);
      onDelete(id);

      toast({
        title: "تم الحذف",
        description: "تم حذف الالتزام بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الالتزام",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-3 text-right font-cairo">قائمة الالتزامات</h3>
      {obligations.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الإجراءات</TableHead>
              <TableHead className="text-right">حالة السداد</TableHead>
              <TableHead className="text-right">تاريخ السداد القادم</TableHead>
              <TableHead className="text-right">التكرار</TableHead>
              <TableHead className="text-right">المبلغ</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">اسم الالتزام</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {obligations.map((obligation) => (
              <TableRow key={obligation.id}>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(obligation.id)}
                  >
                    حذف
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={obligation.isPaid ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTogglePayment(obligation.id)}
                    className={obligation.isPaid ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {obligation.isPaid ? "تم الدفع" : "غير مدفوع"}
                  </Button>
                </TableCell>
                <TableCell className="text-right" dir="rtl">
                  {formatDate(getNextPaymentDate(obligation.dueDate, obligation.recurrence || undefined))}
                </TableCell>
                <TableCell className="text-right">
                  {obligation.recurrence || "مرة واحدة"}
                </TableCell>
                <TableCell className="text-right">
                  {obligation.totalAmount} ريال
                </TableCell>
                <TableCell className="text-right">
                  {obligation.type || "غير محدد"}
                </TableCell>
                <TableCell className="text-right">
                  {obligation.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center p-4 bg-gray-50 rounded-md">
          لا يوجد التزامات مضافة بعد. قم بإضافة التزام جديد باستخدام الزر أعلاه.
        </div>
      )}
    </div>
  );
}
