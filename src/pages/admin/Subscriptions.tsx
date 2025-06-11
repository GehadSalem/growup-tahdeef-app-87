import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SubscriptionPlansTable } from "@/components/admin/SubscriptionPlansTable";
import { PaymentsTable } from "@/components/admin/PaymentsTable";
import { RefundsTable } from "@/components/admin/RefundsTable";
import { SubscriptionChart } from "@/components/admin/SubscriptionChart";
import { RevenueMetrics } from "@/components/admin/RevenueMetrics";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, FilterIcon, MenuIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SubscriptionsPage() {
  const [selectedTab, setSelectedTab] = useState("plans");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>(["الكل"]);
  const { toast } = useToast();

  const handleExportData = () => {
    toast({
      title: "تم تصدير البيانات",
      description: "تم تصدير بيانات الاشتراكات بنجاح",
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* شريط التنقل لسطح المكتب */}
      <div className="hidden md:block">
        <AdminNav />
      </div>

      {/* الهيدر للجوال */}
      <header className="md:hidden sticky top-0 z-10 bg-background border-b p-4 flex items-center w-[350px]">
        <Drawer open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent side="right" className="w-[280px]">
            <AdminNav isMobile onItemClick={() => setMobileNavOpen(false)} />
          </DrawerContent>
        </Drawer>
        <div className="mr-3">
          <AdminHeader 
            heading="الاشتراكات والمدفوعات" 
            text="إدارة خطط الاشتراك، عرض وتحليل المدفوعات" 
          />
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 p-4 md:p-6 w-[350px]">
        {/* شريط البحث والتصفية */}
        <div className="mb-6">
          <div className="relative mb-3">
            <SearchIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="ابحث عن اشتراك..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 w-full text-sm bg-background"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1 gap-2">
                  <FilterIcon className="h-4 w-4" />
                  <span>تصفية</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem
                  checked={filterStatus.includes("الكل")}
                  onCheckedChange={() => setFilterStatus(["الكل"])}
                >
                  الكل
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterStatus.includes("نشط")}
                  onCheckedChange={() => {
                    const filtered = filterStatus.filter(f => f !== "الكل");
                    setFilterStatus(
                      filterStatus.includes("نشط") 
                        ? filtered.filter(f => f !== "نشط") 
                        : [...filtered, "نشط"]
                    );
                  }}
                >
                  نشط
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterStatus.includes("منتهي")}
                  onCheckedChange={() => {
                    const filtered = filterStatus.filter(f => f !== "الكل");
                    setFilterStatus(
                      filterStatus.includes("منتهي") 
                        ? filtered.filter(f => f !== "منتهي") 
                        : [...filtered, "منتهي"]
                    );
                  }}
                >
                  منتهي
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button className="flex-1" onClick={handleExportData}>
              تصدير البيانات
            </Button>
          </div>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>إجمالي الإيرادات</CardTitle>
              <CardDescription>هذا الشهر</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,850 ج.م</div>
              <div className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 inline-flex items-center">
                  +12.4%
                </span>{" "}
                مقارنة بالشهر السابق
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>معدل التحويل</CardTitle>
              <CardDescription>مستخدمين مجاني → مدفوع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18.2%</div>
              <div className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">+2.3%</span>{" "}
                مقارنة بالشهر السابق
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>معدل الاحتفاظ</CardTitle>
              <CardDescription>تجديد الاشتراكات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76.8%</div>
              <div className="text-xs text-muted-foreground mt-1">
                <span className="text-red-500">-1.2%</span>{" "}
                مقارنة بالشهر السابق
              </div>
            </CardContent>
          </Card>
        </div>

        {/* الرسوم البيانية */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>توزيع الاشتراكات</CardTitle>
              <CardDescription>
                مقارنة بين الخطط الشهرية والسنوية
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <SubscriptionChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>مؤشرات الإيرادات</CardTitle>
              <CardDescription>تحليل أداء الإيرادات عبر الزمن</CardDescription>
            </CardHeader>
            <RevenueMetrics />
          </Card>
        </div>

        {/* تبويبات الجداول مع scroll أفقي فقط */}
        <Tabs 
          defaultValue="plans" 
          value={selectedTab} 
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plans">خطط الاشتراك</TabsTrigger>
            <TabsTrigger value="payments">المدفوعات</TabsTrigger>
            <TabsTrigger value="refunds">طلبات الاسترداد</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="space-y-4">
            <div className="rounded-md border overflow-x-auto">
              <div className="min-w-[800px]"> {/* عرض أدنى للجدول */}
                <SubscriptionPlansTable 
                  searchQuery={searchQuery}
                  filterStatus={filterStatus}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            <div className="rounded-md border overflow-x-auto">
              <div className="min-w-[800px]">
                <PaymentsTable 
                  searchQuery={searchQuery}
                  filterStatus={filterStatus}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="refunds" className="space-y-4">
            <div className="rounded-md border overflow-x-auto">
              <div className="min-w-[800px]">
                <RefundsTable 
                  searchQuery={searchQuery}
                  filterStatus={filterStatus}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}