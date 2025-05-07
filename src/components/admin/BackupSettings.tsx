
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, CloudUpload, Download, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export function BackupSettings() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [scheduledBackup, setScheduledBackup] = useState(true);
  const { toast } = useToast();

  const handleBackupNow = () => {
    toast({
      title: "بدء النسخ الاحتياطي",
      description: "جارٍ عمل نسخة احتياطية جديدة...",
    });
    
    setTimeout(() => {
      toast({
        title: "اكتمل النسخ الاحتياطي",
        description: "تم إنشاء نسخة احتياطية جديدة بنجاح.",
      });
    }, 3000);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>النسخ الاحتياطي التلقائي</CardTitle>
          <CardDescription>
            إعداد مواعيد النسخ الاحتياطي التلقائية
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label>النسخ الاحتياطي المجدول</Label>
              <p className="text-sm text-muted-foreground">
                تفعيل النسخ الاحتياطي التلقائي على فترات منتظمة
              </p>
            </div>
            <Switch 
              checked={scheduledBackup}
              onCheckedChange={setScheduledBackup}
            />
          </div>
          
          {scheduledBackup && (
            <>
              <div className="space-y-2 pt-2">
                <Label htmlFor="backup-frequency">تكرار النسخ الاحتياطي</Label>
                <Select defaultValue="weekly">
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="اختر التكرار" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">يومي</SelectItem>
                    <SelectItem value="weekly">أسبوعي</SelectItem>
                    <SelectItem value="monthly">شهري</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backup-time">وقت النسخ الاحتياطي</Label>
                <Select defaultValue="midnight">
                  <SelectTrigger id="backup-time">
                    <SelectValue placeholder="اختر الوقت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="midnight">12:00 ص (منتصف الليل)</SelectItem>
                    <SelectItem value="3am">3:00 ص</SelectItem>
                    <SelectItem value="6am">6:00 ص</SelectItem>
                    <SelectItem value="noon">12:00 م (الظهر)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="retention-period">فترة الاحتفاظ بالنسخ الاحتياطية</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="retention-period">
                    <SelectValue placeholder="اختر المدة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 أيام</SelectItem>
                    <SelectItem value="14">14 يوم</SelectItem>
                    <SelectItem value="30">30 يوم</SelectItem>
                    <SelectItem value="60">60 يوم</SelectItem>
                    <SelectItem value="90">90 يوم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          <div className="flex justify-end pt-2">
            <Button>حفظ إعدادات النسخ الاحتياطي</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>النسخ الاحتياطي اليدوي</CardTitle>
          <CardDescription>
            إنشاء واستعادة النسخ الاحتياطية يدويًا
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <Button 
              className="flex items-center gap-2"
              onClick={handleBackupNow}
            >
              <CloudUpload className="h-4 w-4" />
              إنشاء نسخة احتياطية الآن
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              استعادة من نسخة احتياطية
            </Button>
          </div>
          
          <div className="pt-4">
            <h3 className="text-lg font-medium mb-2">النسخ الاحتياطية السابقة</h3>
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">التاريخ</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">الحجم</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-3 px-4">15 مايو 2024, 12:00 ص</td>
                    <td className="py-3 px-4">24.3 MB</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">تنزيل</span>
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">8 مايو 2024, 12:00 ص</td>
                    <td className="py-3 px-4">23.8 MB</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">تنزيل</span>
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">1 مايو 2024, 12:00 ص</td>
                    <td className="py-3 px-4">23.1 MB</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">تنزيل</span>
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>إعدادات التخزين</CardTitle>
          <CardDescription>
            تكوين مكان تخزين النسخ الاحتياطية
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storage-option">موقع التخزين</Label>
            <Select defaultValue="local">
              <SelectTrigger id="storage-option">
                <SelectValue placeholder="اختر موقع التخزين" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">التخزين المحلي</SelectItem>
                <SelectItem value="s3">Amazon S3</SelectItem>
                <SelectItem value="dropbox">Dropbox</SelectItem>
                <SelectItem value="gdrive">Google Drive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="storage-encryption">تشفير النسخ الاحتياطية</Label>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch id="storage-encryption" defaultChecked />
              <Label htmlFor="storage-encryption">تمكين تشفير النسخ الاحتياطية</Label>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              يزيد التشفير من أمان نسختك الاحتياطية ولكنه قد يبطئ عملية النسخ والاستعادة.
            </p>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button>حفظ إعدادات التخزين</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
