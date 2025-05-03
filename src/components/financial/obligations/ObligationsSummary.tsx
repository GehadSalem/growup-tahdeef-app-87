
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Obligation } from "./AddObligationDialog";

interface ObligationsSummaryProps {
  totalObligations: number;
  remainingIncome: number;
  savingsRemaining: number;
  obligationPercentage: number;
}

export function ObligationsSummary({ 
  totalObligations, 
  remainingIncome, 
  savingsRemaining, 
  obligationPercentage
}: ObligationsSummaryProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-right">
            <div className="text-sm text-gray-500">إجمالي الالتزامات</div>
            <div className="text-xl font-bold">{totalObligations} ريال</div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-right">
            <div className="text-sm text-gray-500">الراتب بعد الالتزامات</div>
            <div className="text-xl font-bold">{remainingIncome} ريال</div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-right">
            <div className="text-sm text-gray-500">المتبقي للادخار</div>
            <div className="text-xl font-bold">{savingsRemaining} ريال</div>
          </CardContent>
        </Card>
        
        <Card className={`${obligationPercentage > 50 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
          <CardContent className="p-4 text-right">
            <div className="text-sm text-gray-500">نسبة الالتزامات من الدخل</div>
            <div className="text-xl font-bold">{obligationPercentage.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>
      
      {obligationPercentage > 50 && (
        <div className="bg-red-100 border-r-4 border-red-500 p-4 mb-6 flex items-center rounded-md">
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="font-bold text-red-700">تحذير</span>
              <AlertTriangle className="h-5 w-5 text-red-700" />
            </div>
            <p className="text-red-700">الالتزامات تستهلك أكثر من 50% من دخلك. يُنصح بمراجعة الإنفاق الشهري.</p>
          </div>
        </div>
      )}
      
      {savingsRemaining < 0 && (
        <div className="bg-amber-100 border-r-4 border-amber-500 p-4 mb-6 flex items-center rounded-md">
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="font-bold text-amber-700">تنبيه</span>
              <AlertTriangle className="h-5 w-5 text-amber-700" />
            </div>
            <p className="text-amber-700">
              أنت بحاجة إلى {Math.abs(savingsRemaining)} ريال إضافية لتحقيق هدف الادخار لهذا الشهر.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
