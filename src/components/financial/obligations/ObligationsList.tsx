
import { format, addMonths, addDays, isAfter, isBefore } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Obligation } from "./AddObligationDialog";

interface ObligationsListProps {
  obligations: Obligation[];
  income: number;
  togglePaymentStatus: (id: string) => void;
}

export function ObligationsList({ obligations, income, togglePaymentStatus }: ObligationsListProps) {
  // تنسيق التاريخ بالعربية
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: ar });
  };

  // حساب تأثير الالتزام على الراتب كنسبة مئوية
  const calculateImpact = (amount: number): string => {
    const percentage = (amount / income) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  // حساب تاريخ السداد القادم حسب التكرار
  const getNextPaymentDate = (dueDate: string, recurrence: string): string => {
    const date = new Date(dueDate);
    const today = new Date();
    
    let nextDate = new Date(date);
    
    // إذا كان التاريخ قد مر، نحسب التاريخ القادم
    if (isBefore(nextDate, today)) {
      switch (recurrence) {
        case "شهري":
          // نضيف شهر حتى نصل لتاريخ مستقبلي
          while (isBefore(nextDate, today)) {
            nextDate = addMonths(nextDate, 1);
          }
          break;
        case "ربع سنوي":
          // نضيف 3 أشهر حتى نصل لتاريخ مستقبلي
          while (isBefore(nextDate, today)) {
            nextDate = addMonths(nextDate, 3);
          }
          break;
        case "سنوي":
          // نضيف سنة (12 شهر) حتى نصل لتاريخ مستقبلي
          while (isBefore(nextDate, today)) {
            nextDate = addMonths(nextDate, 12);
          }
          break;
        case "مرة واحدة":
          // لا نغير التاريخ لأنه يحدث مرة واحدة فقط
          break;
      }
    }
    
    return format(nextDate, "yyyy-MM-dd");
  };

  return (
    <div className="mb-6 overflow-x-auto">
      <h3 className="text-lg font-bold mb-3 text-right font-cairo">قائمة الالتزامات</h3>
      {obligations.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">نسبة التأثير</TableHead>
              <TableHead className="text-right">حالة السداد</TableHead>
              <TableHead className="text-right">تاريخ السداد القادم</TableHead>
              <TableHead className="text-right">المبلغ</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">اسم الالتزام</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {obligations.map((obligation) => (
              <TableRow key={obligation.id}>
                <TableCell className="text-right">{calculateImpact(obligation.amount)}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant={obligation.isPaid ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => togglePaymentStatus(obligation.id)}
                    className={obligation.isPaid ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {obligation.isPaid ? "تم الدفع" : "غير مدفوع"}
                  </Button>
                </TableCell>
                <TableCell className="text-right" dir="rtl">
                  {formatDate(getNextPaymentDate(obligation.dueDate, obligation.recurrence))}
                </TableCell>
                <TableCell className="text-right">{obligation.amount} ريال</TableCell>
                <TableCell className="text-right">{obligation.type}</TableCell>
                <TableCell className="text-right">{obligation.name}</TableCell>
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
