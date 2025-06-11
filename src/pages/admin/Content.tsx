import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ExpenseCategoriesManager } from "@/components/admin/ExpenseCategoriesManager";
import { TipsManager } from "@/components/admin/TipsManager";
import { NotificationsManager } from "@/components/admin/NotificationsManager";
import { GoalsManager } from "@/components/admin/GoalsManager";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

export default function ContentManagementPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
          <DrawerContent side="right" className="">
            <AdminNav isMobile onItemClick={() => setMobileNavOpen(false)} />
          </DrawerContent>
        </Drawer>
        <div className="mr-3">
          <AdminHeader 
            heading="إدارة المحتوى" 
            text="تخصيص وإدارة محتوى التطبيق وتجربة المستخدم" 
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Tabs defaultValue="categories" className="space-y-4 w-[320px]">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full ">
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
      </main>
    </div>
  );
}