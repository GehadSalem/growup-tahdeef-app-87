
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserTableProps {
  searchQuery: string;
  filterStatus: string[];
}

const users = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "ahmed@example.com",
    status: "نشط",
    registeredDate: "15 مايو 2024",
    plan: "سنوي",
    activity: "عالي",
  },
  {
    id: 2,
    name: "سارة علي",
    email: "sara@example.com",
    status: "معلق",
    registeredDate: "22 أبريل 2024",
    plan: "شهري",
    activity: "متوسط",
  },
  {
    id: 3,
    name: "محمد أحمد",
    email: "mohamed@example.com",
    status: "نشط",
    registeredDate: "10 مارس 2024",
    plan: "سنوي",
    activity: "عالي",
  },
  {
    id: 4,
    name: "نورا كريم",
    email: "nora@example.com",
    status: "نشط",
    registeredDate: "5 فبراير 2024",
    plan: "شهري",
    activity: "منخفض",
  },
  {
    id: 5,
    name: "عمر خالد",
    email: "omar@example.com",
    status: "معلق",
    registeredDate: "18 يناير 2024",
    plan: "تجريبي",
    activity: "متوسط",
  },
  {
    id: 6,
    name: "هدى سمير",
    email: "huda@example.com",
    status: "نشط",
    registeredDate: "20 ديسمبر 2023",
    plan: "سنوي",
    activity: "عالي",
  },
  {
    id: 7,
    name: "كريم محمود",
    email: "kareem@example.com",
    status: "نشط",
    registeredDate: "5 نوفمبر 2023",
    plan: "شهري",
    activity: "متوسط",
  },
  {
    id: 8,
    name: "رنا سليم",
    email: "rana@example.com",
    status: "معلق",
    registeredDate: "12 أكتوبر 2023",
    plan: "تجريبي",
    activity: "منخفض",
  }
];

export function UserTable({ searchQuery, filterStatus }: UserTableProps) {
  const { toast } = useToast();
  
  const filteredUsers = users.filter(user => {
    // تصفية حسب البحث
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    // تصفية حسب الحالة
    const matchesStatus = filterStatus.includes("الكل") || filterStatus.includes(user.status);
    
    return matchesSearch && matchesStatus;
  });
  
  const handleSendNotification = (userId: number) => {
    toast({
      title: "تم إرسال الإشعار",
      description: `تم إرسال إشعار إلى المستخدم رقم ${userId}`,
    });
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">المستخدم</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>تاريخ التسجيل</TableHead>
          <TableHead>الاشتراك</TableHead>
          <TableHead>مستوى النشاط</TableHead>
          <TableHead className="text-left"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.status === "نشط" ? "default" : "outline"}
                  className={user.status === "نشط" ? "bg-green-500" : ""}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.registeredDate}</TableCell>
              <TableCell>
                <Badge 
                  variant={user.plan === "تجريبي" ? "outline" : "default"} 
                  className={user.plan === "سنوي" ? "bg-growup" : ""}
                >
                  {user.plan}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div 
                    className={`h-2 w-2 rounded-full mr-2 ${
                      user.activity === "عالي"
                        ? "bg-green-500"
                        : user.activity === "متوسط"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`} 
                  />
                  {user.activity}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">القائمة</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSendNotification(user.id)}>
                      إرسال إشعار
                    </DropdownMenuItem>
                    <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                    <DropdownMenuItem>تعديل</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">
                      تعليق الحساب
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              لا توجد نتائج مطابقة للبحث
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
