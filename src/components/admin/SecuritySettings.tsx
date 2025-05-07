
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from 'lucide-react';

export function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activityLogging, setActivityLogging] = useState(true);
  const [autoLogout, setAutoLogout] = useState(true);
  const [passwordLength, setPasswordLength] = useState("8");
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>المصادقة</CardTitle>
          <CardDescription>
            إدارة طرق تسجيل الدخول والمصادقة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label>المصادقة الثنائية</Label>
              <p className="text-sm text-muted-foreground">
                تفعيل المصادقة الثنائية لحسابات المسؤولين
              </p>
            </div>
            <Switch 
              checked={twoFactorEnabled} 
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>
          
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label>تسجيل الخروج التلقائي</Label>
              <p className="text-sm text-muted-foreground">
                تسجيل الخروج بعد فترة من عدم النشاط
              </p>
            </div>
            <Switch 
              checked={autoLogout} 
              onCheckedChange={setAutoLogout}
            />
          </div>
          
          {autoLogout && (
            <div className="mt-2">
              <Label htmlFor="session-timeout" className="mb-1 block">مدة الجلسة (بالدقائق)</Label>
              <Select defaultValue="30">
                <SelectTrigger id="session-timeout">
                  <SelectValue placeholder="اختر المدة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 دقيقة</SelectItem>
                  <SelectItem value="30">30 دقيقة</SelectItem>
                  <SelectItem value="60">60 دقيقة</SelectItem>
                  <SelectItem value="120">120 دقيقة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="pt-2">
            <Button>حفظ إعدادات المصادقة</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>سياسة كلمة المرور</CardTitle>
          <CardDescription>
            تكوين متطلبات قوة كلمة المرور
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="min-password-length">الحد الأدنى لطول كلمة المرور</Label>
            <Select 
              defaultValue={passwordLength}
              onValueChange={setPasswordLength}
            >
              <SelectTrigger id="min-password-length">
                <SelectValue placeholder="اختر الحد الأدنى" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 أحرف</SelectItem>
                <SelectItem value="8">8 أحرف</SelectItem>
                <SelectItem value="10">10 أحرف</SelectItem>
                <SelectItem value="12">12 حرف</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch id="password-uppercase" defaultChecked />
              <Label htmlFor="password-uppercase">تتطلب حرف كبير واحد على الأقل</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch id="password-number" defaultChecked />
              <Label htmlFor="password-number">تتطلب رقم واحد على الأقل</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch id="password-special" defaultChecked />
              <Label htmlFor="password-special">تتطلب حرف خاص واحد على الأقل</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch id="password-expiry" />
              <Label htmlFor="password-expiry">تاريخ انتهاء صلاحية كلمة المرور (كل 90 يوم)</Label>
            </div>
          </div>
          
          {parseInt(passwordLength) < 8 && (
            <div className="rounded-md bg-yellow-50 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="mr-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    تنبيه أمان
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      كلمات المرور الأقل من 8 أحرف لا تعتبر آمنة بشكل كافٍ. يوصى باستخدام 8 أحرف على الأقل.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-2">
            <Button>حفظ سياسة كلمة المرور</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>تسجيل النشاط</CardTitle>
          <CardDescription>
            إدارة سجلات أنشطة المسؤولين
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label>تمكين تسجيل النشاط</Label>
              <p className="text-sm text-muted-foreground">
                تتبع جميع أنشطة المسؤولين في لوحة التحكم
              </p>
            </div>
            <Switch 
              checked={activityLogging} 
              onCheckedChange={setActivityLogging} 
            />
          </div>
          
          {activityLogging && (
            <div className="space-y-2 pt-2">
              <Label className="mb-1 block">تتبع الأنشطة التالية:</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch id="log-login" defaultChecked />
                  <Label htmlFor="log-login">تسجيل الدخول/الخروج</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch id="log-users" defaultChecked />
                  <Label htmlFor="log-users">إدارة المستخدمين</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch id="log-content" defaultChecked />
                  <Label htmlFor="log-content">تعديل المحتوى</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch id="log-settings" defaultChecked />
                  <Label htmlFor="log-settings">تغيير الإعدادات</Label>
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="log-retention" className="mb-1 block">مدة الاحتفاظ بالسجلات</Label>
                <Select defaultValue="90">
                  <SelectTrigger id="log-retention">
                    <SelectValue placeholder="حدد مدة الاحتفاظ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 يوم</SelectItem>
                    <SelectItem value="60">60 يوم</SelectItem>
                    <SelectItem value="90">90 يوم</SelectItem>
                    <SelectItem value="180">180 يوم</SelectItem>
                    <SelectItem value="365">سنة كاملة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="pt-2">
            <Button>حفظ إعدادات التسجيل</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
