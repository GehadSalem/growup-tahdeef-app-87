
import { Card, CardContent } from "@/components/ui/card";

export function MotivationalTips() {
  return (
    <Card className="bg-gradient-to-r from-growup/20 to-growup/5 border-none">
      <CardContent className="pt-6">
        <h3 className="text-lg font-bold font-cairo mb-3 text-right">نصائح للتغلب على العادات السيئة</h3>
        <ul className="space-y-2 text-right font-cairo">
          <li className="flex items-center justify-end gap-2">
            <span>تجنب المحفزات التي تدفعك للعودة للعادة السيئة</span>
            <span className="text-growup text-lg">✓</span>
          </li>
          <li className="flex items-center justify-end gap-2">
            <span>استبدل العادة السيئة بعادة إيجابية</span>
            <span className="text-growup text-lg">✓</span>
          </li>
          <li className="flex items-center justify-end gap-2">
            <span>شارك تقدمك مع صديق مقرب</span>
            <span className="text-growup text-lg">✓</span>
          </li>
          <li className="flex items-center justify-end gap-2">
            <span>كافئ نفسك على كل إنجاز صغير</span>
            <span className="text-growup text-lg">✓</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
