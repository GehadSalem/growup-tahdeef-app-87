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
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Desktop Navigation (always visible) */}
      <div className="hidden md:block">
        <AdminNav />
      </div>

      {/* Mobile Header with Drawer */}
      <header className="md:hidden sticky top-0 z-10 bg-background border-b p-4 flex items-center">
        <Drawer open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent side="right" className="w-[280px]">
            <AdminNav 
              isMobile 
              onItemClick={() => setMobileNavOpen(false)} 
            />
          </DrawerContent>
        </Drawer>
        <div className="mr-3">
                  <AdminHeader heading="لوحة التحكم" text="نظرة عامة على أداء التطبيق" />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between mb-4">
          <Tabs defaultValue="overview" className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="revenue">الإيرادات</TabsTrigger>
                <TabsTrigger value="users">المستخدمين</TabsTrigger>
              </TabsList>
              <DateRangePicker 
                date={dateRange} 
                setDate={setDateRange}
                className="w-full md:w-auto"
                align="end"
              />
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              <StatsCards dateRange={dateRange} />
              
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
                <Card className="col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>نظرة عامة</CardTitle>
                    <CardDescription>إيرادات واشتراكات الفترة الأخيرة</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 h-[300px]">
                    <Overview dateRange={dateRange} />
                  </CardContent>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>المستخدمون الجدد</CardTitle>
                    <CardDescription>آخر 10 مستخدمين سجلوا في التطبيق</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentUsers />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-4 mt-4">
              <StatsCards dateRange={dateRange} filter="revenue" />
              
              <Card>
                <CardHeader>
                  <CardTitle>تحليل الإيرادات</CardTitle>
                  <CardDescription>مقارنة بين إيرادات الاشتراكات الشهرية والسنوية</CardDescription>
                </CardHeader>
                <CardContent className="p-0 h-[300px]">
                  <RevenueChart dateRange={dateRange} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4 mt-4">
              <StatsCards dateRange={dateRange} filter="users" />
              
              <Card>
                <CardHeader>
                  <CardTitle>تسجيلات المستخدمين</CardTitle>
                  <CardDescription>معدل تسجيل المستخدمين الجدد عبر الوقت</CardDescription>
                </CardHeader>
                <CardContent className="p-0 h-[300px]">
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