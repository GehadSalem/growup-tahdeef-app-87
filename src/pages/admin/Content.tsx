
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ExpenseCategoriesManager } from "@/components/admin/ExpenseCategoriesManager";
import { TipsManager } from "@/components/admin/TipsManager";
import { NotificationsManager } from "@/components/admin/NotificationsManager";
import { GoalsManager } from "@/components/admin/GoalsManager";

export default function ContentManagementPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader 
          heading="إدارة المحتوى" 
          text="تخصيص وإدارة محتوى التطبيق وتجربة المستخدم" 
        />
        
        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="categories">فئات المصروفات</TabsTrigger>
            <TabsTrigger value="tips">النصائح</TabsTrigger>
            <TabsTrigger value="goals">الأهداف المقترحة</TabsTrigger>
            <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-4">
            <ExpenseCategoriesManager />
          </TabsContent>
          
          <TabsContent value="tips" className="space-y-4">
            <TipsManager />
          </TabsContent>
          
          <TabsContent value="goals" className="space-y-4">
            <GoalsManager />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <NotificationsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
