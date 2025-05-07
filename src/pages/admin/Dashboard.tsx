
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/admin/Overview";
import { RecentUsers } from "@/components/admin/RecentUsers";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { UserRegistrationChart } from "@/components/admin/UserRegistrationChart";
import { StatsCards } from "@/components/admin/StatsCards";
import { DateRangePicker } from "@/components/admin/DateRangePicker";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader heading="لوحة التحكم" text="نظرة عامة على أداء التطبيق" />
        
        <div className="flex items-center justify-between">
          <Tabs defaultValue="overview" className="space-y-4 w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="revenue">الإيرادات</TabsTrigger>
                <TabsTrigger value="users">المستخدمين</TabsTrigger>
              </TabsList>
              <DateRangePicker 
                date={dateRange} 
                setDate={setDateRange} 
                className="ml-auto" 
                align="end"
              />
            </div>

            <TabsContent value="overview" className="space-y-4">
              <StatsCards dateRange={dateRange} />
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1 md:col-span-2">
                  <CardHeader>
                    <CardTitle>نظرة عامة</CardTitle>
                    <CardDescription>
                      إيرادات واشتراكات الفترة الأخيرة
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pr-2">
                    <Overview dateRange={dateRange} />
                  </CardContent>
                </Card>
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>المستخدمون الجدد</CardTitle>
                    <CardDescription>
                      آخر 10 مستخدمين سجلوا في التطبيق
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentUsers />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="revenue" className="space-y-4">
              <StatsCards dateRange={dateRange} filter="revenue" />
              <Card>
                <CardHeader>
                  <CardTitle>تحليل الإيرادات</CardTitle>
                  <CardDescription>
                    مقارنة بين إيرادات الاشتراكات الشهرية والسنوية
                  </CardDescription>
                </CardHeader>
                <CardContent className="pr-2">
                  <RevenueChart dateRange={dateRange} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <StatsCards dateRange={dateRange} filter="users" />
              <Card>
                <CardHeader>
                  <CardTitle>تسجيلات المستخدمين</CardTitle>
                  <CardDescription>
                    معدل تسجيل المستخدمين الجدد عبر الوقت
                  </CardDescription>
                </CardHeader>
                <CardContent className="pr-2">
                  <UserRegistrationChart dateRange={dateRange} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
