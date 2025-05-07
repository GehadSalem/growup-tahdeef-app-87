
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const users = [
  {
    id: "u1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    status: "نشط",
    date: "منذ يومين",
    subscribed: true,
  },
  {
    id: "u2",
    name: "سارة أحمد",
    email: "sara@example.com",
    status: "نشط",
    date: "منذ 3 أيام",
    subscribed: false,
  },
  {
    id: "u3",
    name: "محمد علي",
    email: "mohamed@example.com",
    status: "نشط",
    date: "منذ 4 أيام",
    subscribed: true,
  },
  {
    id: "u4",
    name: "نورا حسن",
    email: "nora@example.com",
    status: "نشط",
    date: "منذ أسبوع",
    subscribed: false,
  },
  {
    id: "u5",
    name: "خالد مصطفى",
    email: "khaled@example.com",
    status: "نشط",
    date: "منذ أسبوع",
    subscribed: true,
  }
];

export function RecentUsers() {
  return (
    <div className="space-y-8">
      {users.map((user) => (
        <div key={user.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="mr-4 flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge 
            variant={user.subscribed ? "default" : "outline"} 
            className={user.subscribed ? "bg-growup" : ""}
          >
            {user.subscribed ? "مشترك" : "غير مشترك"}
          </Badge>
        </div>
      ))}
    </div>
  );
}
