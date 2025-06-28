
import { Card, CardContent } from "@/components/ui/card";
import { LightbulbIcon } from "lucide-react";
interface ObligationsTipsProps {
  obligationPercentage: number;
  savingsRemaining: number;
}

export function ObligationsTips({ obligationPercentage, savingsRemaining }: ObligationsTipsProps) {
  return (
    <div className="mt-6">
      <Card className="bg-gradient-to-br from-growup/20 to-growup/5 border-none">
        <CardContent className="pt-6">
          <div className="flex items-center justify-end gap-2 mb-3">
            <h3 className="text-lg font-bold font-cairo">نصائح لإدارة الالتزامات</h3>
            <LightbulbIcon className="h-5 w-5 text-amber-500" />
          </div>
          
          <div className="space-y-3 text-right">
            <div className="bg-white/60 p-3 rounded-lg">
              <p className="font-cairo">خصص ما بين 50-30-20 من دخلك: 50% للضروريات، 30% للرغبات، 20% للادخار.</p>
            </div>
            
            <div className="bg-white/60 p-3 rounded-lg">
              <p className="font-cairo">حدد الالتزامات غير الضرورية وفكر في تقليلها أو إلغائها.</p>
            </div>
            
            <div className="bg-white/60 p-3 rounded-lg">
              <p className="font-cairo">جدول دفعاتك مبكراً لتجنب الغرامات والفوائد الإضافية.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}