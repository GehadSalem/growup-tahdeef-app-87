
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PaymentGatewaySettings() {
  const [testMode, setTestMode] = useState(true);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>الإعدادات العامة للمدفوعات</CardTitle>
          <CardDescription>
            تكوين إعدادات المدفوعات الأساسية
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label>وضع الاختبار</Label>
              <p className="text-sm text-muted-foreground">
                تفعيل وضع الاختبار لبوابات الدفع (لا تتم معالجة المدفوعات الحقيقية)
              </p>
            </div>
            <Switch 
              checked={testMode}
              onCheckedChange={setTestMode}
            />
          </div>
          
          <div className="space-y-2 pt-2">
            <Label htmlFor="currency">العملة الافتراضية</Label>
            <Select defaultValue="EGP">
              <SelectTrigger id="currency">
                <SelectValue placeholder="اختر العملة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EGP">جنيه مصري (EGP)</SelectItem>
                <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 pt-2">
            <Label htmlFor="tax-rate">معدل الضريبة (%)</Label>
            <Input 
              id="tax-rate" 
              type="number" 
              min="0" 
              max="100" 
              defaultValue="14"
            />
          </div>
          
          <div className="flex justify-end pt-2">
            <Button>حفظ الإعدادات العامة</Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stripe">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
          <TabsTrigger value="paymob">Paymob</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stripe" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات Stripe</CardTitle>
              <CardDescription>
                تكوين بوابة دفع Stripe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تفعيل Stripe</Label>
                  <p className="text-sm text-muted-foreground">
                    السماح بالدفع عبر Stripe
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="stripe-publishable-key">مفتاح Publishable</Label>
                <Input 
                  id="stripe-publishable-key" 
                  type="text" 
                  placeholder={testMode ? "pk_test_..." : "pk_live_..."}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stripe-secret-key">المفتاح السري</Label>
                <Input 
                  id="stripe-secret-key" 
                  type="password" 
                  placeholder={testMode ? "sk_test_..." : "sk_live_..."}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  لا تشارك المفتاح السري أبدًا مع أي شخص.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stripe-webhook-secret">سر Webhook</Label>
                <Input 
                  id="stripe-webhook-secret" 
                  type="password" 
                  placeholder="whsec_..."
                />
              </div>
              
              <div className="flex justify-end pt-2">
                <Button>حفظ إعدادات Stripe</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="paypal" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات PayPal</CardTitle>
              <CardDescription>
                تكوين بوابة دفع PayPal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تفعيل PayPal</Label>
                  <p className="text-sm text-muted-foreground">
                    السماح بالدفع عبر PayPal
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="paypal-client-id">معرف العميل (Client ID)</Label>
                <Input 
                  id="paypal-client-id" 
                  type="text" 
                  placeholder="Client ID"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paypal-client-secret">سر العميل (Client Secret)</Label>
                <Input 
                  id="paypal-client-secret" 
                  type="password" 
                  placeholder="Client Secret"
                />
              </div>
              
              <div className="flex justify-end pt-2">
                <Button>حفظ إعدادات PayPal</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="paymob" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات Paymob</CardTitle>
              <CardDescription>
                تكوين بوابة دفع Paymob
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تفعيل Paymob</Label>
                  <p className="text-sm text-muted-foreground">
                    السماح بالدفع عبر Paymob
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="paymob-api-key">مفتاح API</Label>
                <Input 
                  id="paymob-api-key" 
                  type="text" 
                  placeholder="API Key"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymob-integration-id">معرف التكامل</Label>
                <Input 
                  id="paymob-integration-id" 
                  type="text" 
                  placeholder="Integration ID"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymob-iframe-id">معرف Iframe</Label>
                <Input 
                  id="paymob-iframe-id" 
                  type="text" 
                  placeholder="Iframe ID"
                />
              </div>
              
              <div className="flex justify-end pt-2">
                <Button>حفظ إعدادات Paymob</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
