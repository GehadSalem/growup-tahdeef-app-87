
import { Card, CardContent } from "@/components/ui/card";

type Tip = {
  id: string;
  content: string;
};

const financialTips: Tip[] = [
  {
    id: "tip-1",
    content: "وفر 15-20% من دخلك الشهري وابدأ بالاستثمار المبكر."
  },
  {
    id: "tip-2",
    content: "سجل مصاريفك اليومية للتعرف على أنماط الإنفاق."
  },
  {
    id: "tip-3",
    content: "قارن بين الأسعار قبل الشراء وامتنع عن المشتريات غير الضرورية."
  }
];

export function FinancialTips() {
  return (
    <section className="mb-6">
      <Card className="bg-gradient-to-br from-growup/20 to-growup/5 border-none">
        <CardContent className="pt-6">
          <h3 className="text-lg font-bold font-cairo mb-3 text-right">نصائح مالية</h3>
          
          <div className="space-y-3 text-right">
            {financialTips.map(tip => (
              <div key={tip.id} className="bg-white/60 p-3 rounded-lg">
                <p className="font-cairo">{tip.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
