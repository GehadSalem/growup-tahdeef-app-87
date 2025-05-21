
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export function ReferralFAQ() {
  return (
    <Card className="mb-4 border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">الأسئلة الشائعة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-bold mb-1">كم عدد الأصدقاء الذين يمكنني دعوتهم؟</h3>
          <p className="text-sm text-gray-600">
            يمكنك دعوة عدد غير محدود من الأصدقاء! كلما زاد عدد الأشخاص الذين يقبلون دعوتك، زادت الشهور المجانية التي تحصل عليها.
          </p>
        </div>
        
        <div>
          <h3 className="font-bold mb-1">متى سأحصل على الشهر المجاني؟</h3>
          <p className="text-sm text-gray-600">
            سيتم إضافة الشهر المجاني إلى حسابك بمجرد اشتراك صديقك في خطة مدفوعة بعد انتهاء الفترة التجريبية.
          </p>
        </div>
        
        <div>
          <h3 className="font-bold mb-1">هل يمكنني استخدام الشهور المجانية المتراكمة دفعة واحدة؟</h3>
          <p className="text-sm text-gray-600">
            نعم! سيتم إضافة جميع الشهور المجانية التي تكسبها إلى نهاية فترة اشتراكك الحالية تلقائيًا.
          </p>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50">
        <p className="text-sm text-gray-600 w-full text-center">
          لمزيد من الأسئلة، يرجى التواصل مع
          <a href="#" className="text-growup hover:underline mr-1">الدعم الفني</a>
        </p>
      </CardFooter>
    </Card>
  );
}
