
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const refunds = [
  {
    id: "ref1",
    user: "نورا كريم",
    email: "nora@example.com",
    amount: 499.99,
    status: "قيد المراجعة",
    date: "14 مايو 2024",
    plan: "سنوي أساسي",
    reason: "لم يلبِ التطبيق احتياجاتي",
  },
  {
    id: "ref2",
    user: "كريم محمود",
    email: "kareem@example.com",
    amount: 99.99,
    status: "موافق",
    date: "10 مايو 2024",
    plan: "شهري متميز",
    reason: "مشاكل تقنية",
  },
  {
    id: "ref3",
    user: "رنا سليم",
    email: "rana@example.com",
    amount: 49.99,
    status: "مرفوض",
    date: "5 مايو 2024",
    plan: "شهري أساسي",
    reason: "تجاوز المدة المسموحة للاسترداد",
  },
];

export function RefundsTable() {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium">طلبات استرداد الأموال</h3>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المستخدم</TableHead>
              <TableHead>الخطة</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>تاريخ الطلب</TableHead>
              <TableHead>سبب الاسترداد</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-left"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {refunds.map((refund) => (
              <TableRow key={refund.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{refund.user}</div>
                    <div className="text-xs text-muted-foreground">
                      {refund.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{refund.plan}</TableCell>
                <TableCell>{refund.amount} ج.م</TableCell>
                <TableCell>{refund.date}</TableCell>
                <TableCell>
                  <span className="text-sm">{refund.reason}</span>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      refund.status === "موافق" ? "bg-green-500" : 
                      refund.status === "مرفوض" ? "bg-red-500" : 
                      "bg-yellow-500"
                    }
                  >
                    {refund.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {refund.status === "قيد المراجعة" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-green-500">
                        قبول
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-500">
                        رفض
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
