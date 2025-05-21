
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

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("tickets");

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader 
          heading="خدمة العملاء والدعم" 
          text="إدارة تذاكر الدعم والمساعدة" 
        />
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="tickets">تذاكر الدعم</TabsTrigger>
            <TabsTrigger value="contact">رسائل الاتصال</TabsTrigger>
            <TabsTrigger value="analytics">تحليلات الملاحظات</TabsTrigger>
            <TabsTrigger value="satisfaction">رضا العملاء</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tickets" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">جميع التذاكر</h3>
              <Button size="sm">تذكرة جديدة</Button>
            </div>
            <SupportTicketsTable />
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">رسائل نموذج الاتصال</h3>
              <Button size="sm">تصدير البيانات</Button>
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
      </div>
    </div>
  );
}
