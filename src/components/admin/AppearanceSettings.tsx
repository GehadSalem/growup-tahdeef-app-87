
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function AppearanceSettings() {
  const [primaryColor, setPrimaryColor] = useState("#219653");
  const [secondaryColor, setSecondaryColor] = useState("#1E874B");
  const [accentColor, setAccentColor] = useState("#34A853");
  const [logo, setLogo] = useState<File | null>(null);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="theme">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="theme">السمات والألوان</TabsTrigger>
          <TabsTrigger value="logos">الشعارات</TabsTrigger>
          <TabsTrigger value="fonts">الخطوط</TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الألوان الرئيسية</CardTitle>
              <CardDescription>
                تخصيص الألوان الرئيسية للتطبيق
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">اللون الرئيسي</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-8 w-8 rounded-md border" 
                      style={{ backgroundColor: primaryColor }}
                    />
                    <Input 
                      id="primary-color" 
                      type="text" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">اللون الثانوي</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-8 w-8 rounded-md border" 
                      style={{ backgroundColor: secondaryColor }}
                    />
                    <Input 
                      id="secondary-color" 
                      type="text" 
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accent-color">لون التأكيد</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-8 w-8 rounded-md border" 
                      style={{ backgroundColor: accentColor }}
                    />
                    <Input 
                      id="accent-color" 
                      type="text" 
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse pt-2">
                <Switch 
                  id="dark-mode" 
                  checked={darkModeEnabled}
                  onCheckedChange={setDarkModeEnabled}
                />
                <Label htmlFor="dark-mode">تفعيل الوضع المظلم</Label>
              </div>
              
              <div className="flex justify-end">
                <Button>حفظ التغييرات</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>معاينة</CardTitle>
              <CardDescription>
                عرض التطبيق بالألوان المختارة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6">
                <div className="flex gap-4 mb-4">
                  <div 
                    className="h-10 w-24 rounded-md flex items-center justify-center text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    رئيسي
                  </div>
                  <div 
                    className="h-10 w-24 rounded-md flex items-center justify-center text-white"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    ثانوي
                  </div>
                  <div 
                    className="h-10 w-24 rounded-md flex items-center justify-center text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    تأكيد
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="h-20 rounded-md flex items-center justify-center text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    زر رئيسي
                  </div>
                  <div 
                    className="h-20 rounded-md border flex items-center justify-center"
                    style={{ color: primaryColor, borderColor: primaryColor }}
                  >
                    زر ثانوي
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الشعار</CardTitle>
              <CardDescription>
                تحميل وإدارة شعارات التطبيق
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="mb-2 block">الشعار الرئيسي</Label>
                  <div className="border border-dashed rounded-md p-6 text-center">
                    <div className="h-24 mb-4 flex items-center justify-center bg-gray-50">
                      {logo ? (
                        <img 
                          src={URL.createObjectURL(logo)} 
                          alt="Logo preview" 
                          className="h-full object-contain"
                        />
                      ) : (
                        <span className="text-muted-foreground">معاينة الشعار</span>
                      )}
                    </div>
                    <Input 
                      id="logo-upload" 
                      type="file" 
                      className="hidden"
                      onChange={(e) => setLogo(e.target.files?.[0] || null)}
                      accept="image/*"
                    />
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <Button variant="outline" className="w-full" type="button">
                        اختر صورة
                      </Button>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPG or SVG. الحد الأقصى 1MB.
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">أيقونة الموقع (Favicon)</Label>
                  <div className="border border-dashed rounded-md p-6 text-center">
                    <div className="h-24 mb-4 flex items-center justify-center bg-gray-50">
                      <span className="text-muted-foreground">معاينة الأيقونة</span>
                    </div>
                    <Input 
                      id="favicon-upload" 
                      type="file" 
                      className="hidden"
                    />
                    <Label htmlFor="favicon-upload" className="cursor-pointer">
                      <Button variant="outline" className="w-full" type="button">
                        اختر صورة
                      </Button>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG or ICO. يفضل حجم 32x32 بكسل.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>حفظ التغييرات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fonts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الخطوط</CardTitle>
              <CardDescription>
                تخصيص خطوط التطبيق
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-font">الخط الرئيسي</Label>
                  <Select defaultValue="cairo">
                    <SelectTrigger id="primary-font">
                      <SelectValue placeholder="اختر الخط" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cairo">Cairo</SelectItem>
                      <SelectItem value="tajawal">Tajawal</SelectItem>
                      <SelectItem value="ibm">IBM Plex Arabic</SelectItem>
                      <SelectItem value="lateef">Lateef</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="headings-font">خط العناوين</Label>
                  <Select defaultValue="cairo">
                    <SelectTrigger id="headings-font">
                      <SelectValue placeholder="اختر الخط" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cairo">Cairo</SelectItem>
                      <SelectItem value="tajawal">Tajawal</SelectItem>
                      <SelectItem value="ibm">IBM Plex Arabic</SelectItem>
                      <SelectItem value="lateef">Lateef</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-font-weight">وزن الخط الرئيسي</Label>
                  <Select defaultValue="400">
                    <SelectTrigger id="primary-font-weight">
                      <SelectValue placeholder="اختر الوزن" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">خفيف (300)</SelectItem>
                      <SelectItem value="400">عادي (400)</SelectItem>
                      <SelectItem value="500">متوسط (500)</SelectItem>
                      <SelectItem value="700">سميك (700)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font-size">حجم الخط الأساسي</Label>
                  <Select defaultValue="16">
                    <SelectTrigger id="font-size">
                      <SelectValue placeholder="اختر الحجم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14">14px</SelectItem>
                      <SelectItem value="16">16px (افتراضي)</SelectItem>
                      <SelectItem value="18">18px</SelectItem>
                      <SelectItem value="20">20px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">معاينة الخط</h3>
                <div className="border rounded-md p-4">
                  <p className="text-2xl font-bold mb-2">هذا هو عنوان باستخدام الخط المحدد</p>
                  <p className="mb-2">
                    هذا نص عادي لعرض شكل الخط المحدد. يمكنك من خلاله معرفة كيف سيظهر المحتوى في واجهة المستخدم الخاصة بالتطبيق.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    هذا نص أصغر لعرض الأحجام المختلفة للخط.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>حفظ التغييرات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
