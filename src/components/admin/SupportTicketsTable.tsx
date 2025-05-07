
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

const tickets = [
  {
    id: "tick1",
    user: "أحمد محمد",
    email: "ahmed@example.com",
    subject: "مشكلة في تسجيل المصروفات",
    date: "16 مايو 2024",
    status: "مفتوح",
    priority: "عالي",
  },
  {
    id: "tick2",
    user: "سارة علي",
    email: "sara@example.com",
    subject: "استفسار عن الاشتراك السنوي",
    date: "15 مايو 2024",
    status: "قيد المعالجة",
    priority: "متوسط",
  },
  {
    id: "tick3",
    user: "محمد أحمد",
    email: "mohamed@example.com",
    subject: "طلب استرداد أموال",
    date: "14 مايو 2024",
    status: "مفتوح",
    priority: "عالي",
  },
  {
    id: "tick4",
    user: "نورا كريم",
    email: "nora@example.com",
    subject: "خطأ في التقارير الشهرية",
    date: "13 مايو 2024",
    status: "مغلق",
    priority: "منخفض",
  },
  {
    id: "tick5",
    user: "عمر خالد",
    email: "omar@example.com",
    subject: "اقتراح لتحسين التطبيق",
    date: "12 مايو 2024",
    status: "قيد المعالجة",
    priority: "متوسط",
  },
];

export function SupportTicketsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الموضوع</TableHead>
            <TableHead>المستخدم</TableHead>
            <TableHead>تاريخ الإنشاء</TableHead>
            <TableHead>الأولوية</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-left"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">
                {ticket.subject}
              </TableCell>
              <TableCell>
                <div>
                  <div>{ticket.user}</div>
                  <div className="text-xs text-muted-foreground">
                    {ticket.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>{ticket.date}</TableCell>
              <TableCell>
                <Badge 
                  className={
                    ticket.priority === "عالي" ? "bg-red-500" : 
                    ticket.priority === "متوسط" ? "bg-yellow-500" : 
                    "bg-blue-500"
                  }
                >
                  {ticket.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  className={
                    ticket.status === "مفتوح" ? "bg-green-500" : 
                    ticket.status === "قيد المعالجة" ? "bg-yellow-500" : 
                    "bg-gray-500"
                  }
                >
                  {ticket.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Button size="sm">عرض التذكرة</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
