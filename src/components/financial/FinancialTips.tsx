
import { Card, CardContent } from "@/components/ui/card";

export function FinancialTips() {
  return (
    <section className="mb-6">
      <Card className="bg-gradient-to-br from-growup/20 to-growup/5 border-none">
        <CardContent className="pt-6">
          <h3 className="text-lg font-bold font-cairo mb-3 text-right">نصائح مالية</h3>
          
          <div className="space-y-3 text-right">
            <div className="bg-white/60 p-3 rounded-lg">
              <p className="font-cairo">وفر 15-20% من دخلك الشهري وابدأ بالاستثمار المبكر.</p>
            </div>
            
            <div className="bg-white/60 p-3 rounded-lg">
              <p className="font-cairo">سجل مصاريفك اليومية للتعرف على أنماط الإنفاق.</p>
            </div>
            
            <div className="bg-white/60 p-3 rounded-lg">
              <p className="font-cairo">قارن بين الأسعار قبل الشراء وامتنع عن المشتريات غير الضرورية.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
