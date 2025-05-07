
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const payments = [
  {
    id: "pay1",
    user: "أحمد محمد",
    email: "ahmed@example.com",
    amount: 499.99,
    status: "ناجح",
    date: "15 مايو 2024",
    plan: "سنوي أساسي",
    method: "بطاقة ائتمان",
  },
  {
    id: "pay2",
    user: "سارة علي",
    email: "sara@example.com",
    amount: 49.99,
    status: "ناجح",
    date: "12 مايو 2024",
    plan: "شهري أساسي",
    method: "بطاقة ائتمان",
  },
  {
    id: "pay3",
    user: "محمد أحمد",
    email: "mohamed@example.com",
    amount: 999.99,
    status: "ناجح",
    date: "10 مايو 2024",
    plan: "سنوي متميز",
    method: "PayPal",
  },
  {
    id: "pay4",
    user: "نورا كريم",
    email: "nora@example.com",
    amount: 49.99,
    status: "فاشل",
    date: "8 مايو 2024",
    plan: "شهري أساسي",
    method: "بطاقة ائتمان",
  },
  {
    id: "pay5",
    user: "عمر خالد",
    email: "omar@example.com",
    amount: 99.99,
    status: "ناجح",
    date: "5 مايو 2024",
    plan: "شهري متميز",
    method: "PayPal",
  },
];

export function PaymentsTable() {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium">سجل المدفوعات</h3>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المستخدم</TableHead>
              <TableHead>الخطة</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>تاريخ الدفع</TableHead>
              <TableHead>طريقة الدفع</TableHead>
              <TableHead>الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{payment.user}</div>
                    <div className="text-xs text-muted-foreground">
                      {payment.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{payment.plan}</TableCell>
                <TableCell>{payment.amount} ج.م</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>
                  <Badge 
                    className={payment.status === "ناجح" ? "bg-green-500" : "bg-red-500"}
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
