import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AppearanceSettings } from "@/components/admin/AppearanceSettings";
import { PaymentGatewaySettings } from "@/components/admin/PaymentGatewaySettings";
import { BackupSettings } from "@/components/admin/BackupSettings";
import { SecuritySettings } from "@/components/admin/SecuritySettings";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { MenuIcon } from "lucide-react";

export default function SettingsPage() {
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
          <DrawerContent side="right" className="w-[280px]">
            <AdminNav isMobile onItemClick={() => setMobileNavOpen(false)} />
          </DrawerContent>
        </Drawer>
        <div className="mr-3">
          <AdminHeader 
            heading="الإعدادات" 
            text="إدارة وتخصيص إعدادات التطبيق" 
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 w-[350px]">
        <Tabs defaultValue="appearance" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full gap-1">
            <TabsTrigger value="appearance">المظهر</TabsTrigger>
            <TabsTrigger value="security">الأمان</TabsTrigger>
            <TabsTrigger value="payment">الدفع</TabsTrigger>
            <TabsTrigger value="backup">النسخ الاحتياطي</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4">
            <AppearanceSettings />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <SecuritySettings />
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-4">
            <PaymentGatewaySettings />
          </TabsContent>
          
          <TabsContent value="backup" className="space-y-4">
            <BackupSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}