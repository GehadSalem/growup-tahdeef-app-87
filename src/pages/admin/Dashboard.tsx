
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
import { useQuery } from "@tanstack/react-query";
import { StatsService } from "@/services/statsService";

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Fetch dashboard stats
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: StatsService.getDashboardStats,
  });

  // Fetch weekly stats
  const { data: weeklyStats, isLoading: weeklyLoading } = useQuery({
    queryKey: ['admin-weekly-stats'],
    queryFn: StatsService.getWeeklyStats,
  });

  // Fetch monthly stats
  const { data: monthlyStats, isLoading: monthlyLoading } = useQuery({
    queryKey: ['admin-monthly-stats'],
    queryFn: StatsService.getMonthlyStats,
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl font-cairo text-gray-600">جاري تحميل الإحصائيات...</p>
        </div>
      </div>
    );
  }

  if (statsError) {
    console.error('Admin dashboard stats error:', statsError);
  }

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
              <StatsCards 
                dateRange={dateRange} 
                dashboardStats={dashboardStats}
              />
              
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
                <Card className="col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>نظرة عامة</CardTitle>
                    <CardDescription>إيرادات واشتراكات الفترة الأخيرة</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 h-[300px]">
                    <Overview 
                      dateRange={dateRange} 
                      dashboardStats={dashboardStats}
                      isLoading={statsLoading}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>المستخدمين الجدد</CardTitle>
                    <CardDescription>آخر المنضمين للمنصة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentUsers />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>تحليل الإيرادات</CardTitle>
                  <CardDescription>تطور الإيرادات خلال الفترة المحددة</CardDescription>
                </CardHeader>
                <CardContent>
                  <RevenueChart 
                    data={dashboardStats?.revenueData || []}
                    isLoading={statsLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>إحصائيات المستخدمين</CardTitle>
                  <CardDescription>تسجيلات المستخدمين الجدد</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserRegistrationChart 
                    data={dashboardStats?.userRegistrations || []}
                    isLoading={statsLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
