
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, BarChart2, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  dateRange?: { from: Date; to: Date };
  filter?: string;
}

export function StatsCards({ dateRange, filter }: StatsCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">المستخدمين النشطين</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2,351</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-green-500 inline-flex items-center">
              +12.5%
            </span>{" "}
            مقارنة بالشهر السابق
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">13,500 ج.م</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-green-500 inline-flex items-center">
              +18.7%
            </span>{" "}
            مقارنة بالشهر السابق
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">معدل الاحتفاظ</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">78.5%</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-red-500 inline-flex items-center">
              -2.3%
            </span>{" "}
            مقارنة بالشهر السابق
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">الأهداف المكتملة</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,243</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-green-500 inline-flex items-center">
              +7.2%
            </span>{" "}
            مقارنة بالشهر السابق
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
