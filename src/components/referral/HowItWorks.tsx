
import { Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function HowItWorks() {
  return (
    <Card className="mb-6 border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Award className="h-5 w-5 text-growup" />
          كيف يعمل برنامج الإحالة؟
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 bg-growup/10 h-8 w-8 rounded-full flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <h3 className="font-bold text-base">شارك رابط أو رمز الإحالة الخاص بك</h3>
            <p className="text-sm text-gray-600">
              أرسل الرابط لأصدقائك عبر الرسائل، وسائل التواصل الاجتماعي، أو البريد الإلكتروني.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-shrink-0 bg-growup/10 h-8 w-8 rounded-full flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h3 className="font-bold text-base">قم بدعوة أصدقائك للتسجيل</h3>
            <p className="text-sm text-gray-600">
              عندما ينقر صديقك على الرابط، سيتم توجيهه إلى صفحة التسجيل مع تطبيق رمز الإحالة الخاص بك تلقائيًا.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-shrink-0 bg-growup/10 h-8 w-8 rounded-full flex items-center justify-center font-bold">
            3
          </div>
          <div>
            <h3 className="font-bold text-base">احصل على المكافآت</h3>
            <p className="text-sm text-gray-600">
              بمجرد اشتراك صديقك، ستحصل على شهر مجاني من اشتراك Premium! وسيحصل صديقك أيضًا على شهر مجاني للبدء.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
