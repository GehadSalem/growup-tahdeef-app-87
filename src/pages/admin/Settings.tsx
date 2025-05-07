
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

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader 
          heading="الإعدادات" 
          text="إدارة وتخصيص إعدادات التطبيق" 
        />
        
        <Tabs defaultValue="appearance" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
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
      </div>
    </div>
  );
}
