
import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, MessageSquare } from "lucide-react";

// نموذج بيانات لتذاكر الاتصال - في تطبيق حقيقي ستأتي من API
const contactTickets = [
  {
    id: "contact1",
    name: "سارة أحمد",
    email: "sara@example.com",
    subject: "استفسار عن خطة الاشتراك السنوي",
    message: "مرحبا، أود معرفة المزيد عن مزايا الاشتراك السنوي وهل هناك أي خصومات متاحة حاليًا؟",
    date: "18 مايو 2024",
    status: "جديد",
    priority: "متوسط",
  },
  {
    id: "contact2",
    name: "محمد عبدالله",
    email: "mohammad@example.com",
    subject: "مشكلة في إتمام عملية الدفع",
    message: "واجهت مشكلة في إتمام عملية الدفع باستخدام بطاقة الائتمان، تظهر رسالة خطأ عند محاولة الدفع. هل يمكنكم المساعدة؟",
    date: "17 مايو 2024",
    status: "جديد",
    priority: "عالي",
  },
  {
    id: "contact3",
    name: "فاطمة محمود",
    email: "fatima@example.com",
    subject: "اقتراح لتحسين التطبيق",
    message: "أقترح إضافة ميزة تذكير يومية للمهام والأهداف المالية. أعتقد أنها ستكون مفيدة للمستخدمين وخاصة المبتدئين.",
    date: "16 مايو 2024",
    status: "تمت المراجعة",
    priority: "منخفض",
  },
  {
    id: "contact4",
    name: "خالد سعد",
    email: "khalid@example.com",
    subject: "طلب استرداد مبلغ الاشتراك",
    message: "أرغب في استرداد مبلغ الاشتراك لأنني اشتركت بالخطأ مرتين. أرجو منكم معالجة هذا الأمر في أقرب وقت ممكن.",
    date: "15 مايو 2024",
    status: "جديد",
    priority: "عالي",
  },
  {
    id: "contact5",
    name: "نورة علي",
    email: "noura@example.com",
    subject: "شكر وتقدير للفريق",
    message: "أود أن أشكركم على جهودكم الرائعة في تطوير هذا التطبيق. لقد ساعدني كثيراً في تنظيم أموري المالية وتحقيق أهدافي.",
    date: "14 مايو 2024",
    status: "تم الرد",
    priority: "منخفض",
  },
];

export function ContactTickets() {
  const [selectedTicket, setSelectedTicket] = useState<typeof contactTickets[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const viewTicket = (ticket: typeof contactTickets[0]) => {
    setSelectedTicket(ticket);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "جديد":
        return <Badge className="bg-green-500">جديد</Badge>;
      case "تمت المراجعة":
        return <Badge className="bg-blue-500">تمت المراجعة</Badge>;
      case "تم الرد":
        return <Badge className="bg-gray-500">تم الرد</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "عالي":
        return <Badge className="bg-red-500">عالي</Badge>;
      case "متوسط":
        return <Badge className="bg-yellow-500">متوسط</Badge>;
      case "منخفض":
        return <Badge className="bg-blue-500">منخفض</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الموضوع</TableHead>
              <TableHead>المرسل</TableHead>
              <TableHead>تاريخ الإرسال</TableHead>
              <TableHead>الأولوية</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-left"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">
                  {ticket.subject}
                </TableCell>
                <TableCell>
                  <div>
                    <div>{ticket.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {ticket.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{ticket.date}</TableCell>
                <TableCell>
                  {getPriorityBadge(ticket.priority)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(ticket.status)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button size="sm" onClick={() => viewTicket(ticket)}>
                      عرض الرسالة
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedTicket && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {selectedTicket.subject}
              </DialogTitle>
              <DialogDescription className="flex items-center justify-between">
                <div>من: {selectedTicket.name}</div>
                <div>{selectedTicket.date}</div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Mail className="h-4 w-4" />
              <span>{selectedTicket.email}</span>
            </div>
            <div className="bg-muted/20 p-4 rounded-md">
              <p className="whitespace-pre-line">{selectedTicket.message}</p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {getStatusBadge(selectedTicket.status)}
                {getPriorityBadge(selectedTicket.priority)}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                إغلاق
              </Button>
              <Button
                className="bg-growup hover:bg-growup/90"
              >
                الرد على الرسالة
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
