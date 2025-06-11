import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SupportTicketsTable } from "@/components/admin/SupportTicketsTable";
import { FeedbackAnalytics } from "@/components/admin/FeedbackAnalytics";
import { CustomerSatisfactionChart } from "@/components/admin/CustomerSatisfactionChart";
import { ContactTickets } from "@/components/admin/ContactTickets";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { MenuIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { toast } = useToast();

  const handleExportData = () => {
    toast({
      title: "تم تصدير البيانات",
      description: "تم تصدير بيانات الاتصال بنجاح",
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <AdminNav />
      </div>

      {/* Mobile Header */}
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
            heading="خدمة العملاء والدعم" 
            text="إدارة تذاكر الدعم والمساعدة" 
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 w-[350px]">
        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                التذاكر المفتوحة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">24</div>
                <Badge className="bg-yellow-500">بانتظار الرد</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                وقت الاستجابة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">3.2 ساعة</div>
                <Badge className="bg-green-500">متوسط الوقت</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                رضا العميل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">93%</div>
                <Badge className="bg-growup">ممتاز</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="tickets">تذاكر الدعم</TabsTrigger>
            <TabsTrigger value="contact">رسائل الاتصال</TabsTrigger>
            <TabsTrigger value="analytics">تحليلات الملاحظات</TabsTrigger>
            <TabsTrigger value="satisfaction">رضا العملاء</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tickets" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <h3 className="text-lg font-medium">جميع التذاكر</h3>
              <Button size="sm" className="w-full sm:w-auto">تذكرة جديدة</Button>
            </div>
            <SupportTicketsTable />
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <h3 className="text-lg font-medium">رسائل نموذج الاتصال</h3>
              <Button 
                size="sm" 
                className="w-full sm:w-auto"
                onClick={handleExportData}
              >
                تصدير البيانات
              </Button>
            </div>
            <ContactTickets />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تحليل ملاحظات المستخدمين</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <FeedbackAnalytics />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="satisfaction" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>معدل رضا المستخدمين</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <CustomerSatisfactionChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}